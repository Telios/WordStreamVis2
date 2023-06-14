import pandas as pd
import numpy as np
import sqlite3
import time
import os
import json


# Takes unique_player_ids as numpy array.
# Returns a pd.DataFrame with index player_id (as in NBA database)
# and column "position", containing either "Guard", "Forward" or "Center" depending on that players role.
def get_player_positions(unique_player_ids, conn):

    # get role for each involved player
    #   get role from our dataset
    #   if role entry does not exist: consider other dataset

    common_player_positions_by_id = pd.read_sql_query("SELECT person_id, position FROM common_player_info", conn,
                                                      dtype={"person_id": np.int32, "position": str},
                                                      index_col="person_id")

    player_names_by_id = pd.read_sql_query("SELECT id, full_name FROM player", conn,
                                           dtype={"id": np.int32, "full_name": str},
                                           index_col="id")

    player_position_by_name_and_team = pd.read_csv("../datasets/basketball/nba_players_performance_and_salaries/players.csv",
                                            usecols=["name", "position", "draft_team"],
                                            dtype={"name": str, "position": str, "draft_team": str},
                                            na_filter=False)
    player_position_by_name_and_team["position"] = player_position_by_name_and_team["position"].str.replace("/", " and ")

    def get_player_position(player_id):
        # TODO nicknames are a problem
        #  ike austin -> isaac austin
        mapped_player_names = {
            "Ike Austin": "Isaac Austin",
            "Clar. Weatherspoon": "Clarence Weatherspoon",
            "Horacio Llamas": "Horacio Llamas Grey",
            "Mark Baker": "LaMark Baker",
            "Makhtar N'diaye": "Makhtar N'Diaye",
            "Mamadou N'diaye": "Mamadou N'Diaye",
            "Wang Zhi-zhi": "Wang Zhizhi",
            "Norman Richardson": "Norm Richardson",
            "Ike Fontaine": "Isaac Fontaine",
            "Flip Murray": "Ronald Murray",
            "Efthimios Rentzias": "Efthimi Rentzias",
            "Roger Mason Jr.": "Roger Mason",
            "Michael Sweetney": "Mike Sweetney",
            "JR Smith": "J.R. Smith",
            "DJ Mbenga": "D.J. Mbenga",
            "Ibrahim Kutluay": "Ibo Kutluay",
            "CJ Miles": "C.J. Miles",
            "Boniface Ndong": "Boniface N'Dong",
            "JJ Hickson": "J.J. Hickson",
            "DJ White": "D.J. White",
            "AJ Price": "A.J. Price",
            "Pooh Jeter": "Eugene Jeter",
            "Hamady Ndiaye": "Hamady N'Diaye",
            "Enes Freedom": "Enes Kanter",
            "Perry Jones III": "Perry Jones",
            "JJ Redick": "J.J. Redick",
            "DJ Stephens": "D.J. Stephens",
            "James Ennis III": "James Ennis",
            "Johnny O'Bryant III": "Johnny O'Bryant",
            "RJ Hunter": "R.J. Hunter",
            "JJ O'Brien": "J.J. O'Brien",
            "Wade Baldwin IV": "Wade Baldwin",
            "AJ Hammons": "A.J. Hammons",
            "O.G. Anunoby": "OG Anunoby",
            "Kevin Knox II": "Kevin Knox",
            "Mo Bamba": "Mohamed Bamba",
            "Wes Iwundu": "Wesley Iwundu",
            "Svi Mykhailiuk": "Sviatoslav Mykhailiuk",
            "Robert Williams III": "Robert Williams",
            "Melvin Frazier Jr.": "Melvin Frazier",
            "Vincent Edwards": "Vince Edwards",
            "Cam Reynolds": "Cameron Reynolds",
            "BJ Johnson": "B.J. Johnson",
            "Terence Davis": "Terry Davis",
        }
        try:
            if player_id in common_player_positions_by_id.index:
                # position is stored in NBA DB, retrieve
                return common_player_positions_by_id.loc[player_id]["position"]
            else:
                if player_id not in player_names_by_id.index:
                    # player id that occurred in play-by-play records is not in player table
                    # inconsistency in NBA dataset, cannot know which player this was, ignore
                    return ""

                # retrieve player name, map name from NBA DB to Player DB
                player_name = player_names_by_id.loc[player_id]["full_name"]
                if player_name in mapped_player_names:
                    player_name = mapped_player_names[player_name]

                # lookup player name in dataset
                index = player_position_by_name_and_team["name"] == player_name
                result = player_position_by_name_and_team[index]

                if len(result) == 0:
                    # found no result in Player DB
                    raise RuntimeError(f"No results for player name {player_name} (with id {player_id}) in Player DB, "
                                       f"position not in NBA DB, could not find player in Player DB ")

                if len(result) == 1:
                    # found single result, return position
                    return result["position"].values[0]

                # check if positions are the same, if yes, return right away
                unique_positions_of_player = result["position"].unique()
                if len(unique_positions_of_player == 1):
                    return unique_positions_of_player[0]

                raise RuntimeError(f"No results for player name {player_name} (with id {player_id}) in Player DB"
                                   f"with different positions; cannot figure out correct one due to ambiguity")

        except RuntimeError as e:
            # TODO
            print(e)
            return ""

    # get all unique player ids involved in play_by_play records
    player_positions_by_id = pd.DataFrame(unique_player_ids, columns=["player_id"])
    player_positions_by_id["position"] = player_positions_by_id.apply(
        lambda row: get_player_position(row["player_id"]), axis=1)
    player_positions_by_id = player_positions_by_id[player_positions_by_id["position"] != ""]

    # general roles are Center, Forward and Guard
    def get_general_position(position):
        POSITION_CATEGORIES = {
            "Shooting Guard": "Guard",
            "Point Guard": "Guard",
            "Forward Guard": "Guard",
            "Small Forward": "Forward",
            "Center Forward": "Forward",
            "Power Forward": "Forward",
            "Guard Forward": "Forward",
            "Forward Center": "Center",
        }

        if position in POSITION_CATEGORIES:
            return POSITION_CATEGORIES[position]

        return position

    def get_dominating_general_position(positions):
        general_positions = list(map(get_general_position, positions))
        unique_general_positions, counts = np.unique(general_positions, return_counts=True)
        return unique_general_positions[np.argmax(counts)]

    unique_positions = pd.Series(player_positions_by_id["position"].unique(), name="positions")
    unique_positions = unique_positions[unique_positions != ""]
    general_position = unique_positions.str.replace("-", " ")
    general_position = general_position.str.split(" and ")
    general_position = general_position.apply(get_dominating_general_position)
    general_position.name = "general_position"

    positions_to_general_position = pd.concat([unique_positions, general_position], axis=1)
    positions_to_general_position = positions_to_general_position.set_index("positions")

    player_positions_by_id = player_positions_by_id.join(positions_to_general_position, on="position")
    player_positions_by_id = player_positions_by_id[["player_id", "general_position"]]\
        .set_index("player_id")\
        .rename(columns={"general_position": "position"})
    return player_positions_by_id


def main():
    start_time_all = time.perf_counter()
    start_time = time.perf_counter()

    conn = sqlite3.connect("../datasets/basketball/nba_db/nba.sqlite")

    # WordStreams for specific states
    #   use play-by-play records of past games
    #   names of involved players as words
    #   position of the player as category
    #   team of the player as country (use city->state associations)

    # therefore play-by-play records PER STATE contains all players of teams from cities within that state
    # cases of missing data:
    #   - no player is associated with play (player1_id, player2_id, player3_id all empty)
    #     -> remove row
    #   - playerN_team_city is missing for player N
    #     -> remove row (?)

    # turns out, multiple SELECTs and pandas' .join are MUCH faster than joining in a single, longer SQL statement
    games = pd.read_sql_query("SELECT game_id, game_date, season_id FROM game", conn,
                              dtype={"game_id": np.int32, "season_id": np.int32},
                              index_col="game_id")

    teams = pd.read_sql_query("SELECT id, state FROM team", conn,
                              dtype={"id": np.int32},
                              index_col="id")

    players = pd.read_sql_query("SELECT id, full_name FROM player", conn,
                                dtype={"id": np.int32, "full_name": str},
                                index_col="id")

    start_time = time.perf_counter()
    print("query play by play ... ", end="")
    # type of team_id, should be int, but is float, therefore cast
    sql_query = "SELECT game_id, player1_id AS \"player_id\", CAST(player1_team_id AS INTEGER) AS \"team_id\" " \
                "FROM play_by_play " \
                "WHERE player1_id != 0 AND player1_team_id IS NOT NULL " \
                "UNION ALL " \
                "SELECT game_id, player2_id AS \"player_id\", CAST(player2_team_id as INTEGER) AS \"team_id\" " \
                "FROM play_by_play " \
                "WHERE player2_id != 0 AND player2_team_id IS NOT NULL " \
                "UNION ALL " \
                "SELECT game_id, player3_id AS \"player_id\", CAST(player3_team_id as INTEGER) AS \"team_id\" " \
                "FROM play_by_play " \
                "WHERE player3_id != 0 AND player3_team_id IS NOT NULL"
    play_by_play = pd.read_sql_query(sql_query, conn, dtype={"game_id": np.int32,
                                                             "player_id": np.int32,
                                                             "team_id": np.int32})
    print(f"took {time.perf_counter() - start_time}")

    # filter out records without player and team associations
    print(f"filtering play by play records ... ", end="")
    start_time = time.perf_counter()
    play_by_play = play_by_play[play_by_play["player_id"].notna() & play_by_play["team_id"].notna()]
    print(f"took {time.perf_counter() - start_time}s")

    start_time = time.perf_counter()
    print(f"join team ... ", end="")
    play_by_play = play_by_play.join(teams, on="team_id", how="inner")
    print(f"took {time.perf_counter() - start_time}s")

    start_time = time.perf_counter()
    print(f"join games ... ", end="")
    play_by_play = play_by_play.join(games, on="game_id", how="inner")
    print(f"took {time.perf_counter() - start_time}s")

    start_time = time.perf_counter()
    print(f"getting player positions ... ", end="")
    player_positions = get_player_positions(play_by_play["player_id"].unique(), conn)
    print(f"took {time.perf_counter() - start_time}s")

    start_time = time.perf_counter()
    print(f"join player positions ... ", end="")
    play_by_play = play_by_play.join(player_positions, on="player_id", how="inner")
    print(f"took {time.perf_counter() - start_time}s")

    start_time = time.perf_counter()
    print(f"join player names ... ", end="")
    play_by_play = play_by_play.join(players, on="player_id", how="inner")
    print(f"took {time.perf_counter() - start_time}s")

    # season_id contains 2YYYY-> strip away
    start_time = time.perf_counter()
    print(f"fix season_id ... ", end="")
    play_by_play["season_id"] = play_by_play["season_id"].apply(lambda season_id: season_id - 20000)
    print(f"took {time.perf_counter() - start_time}s")

    # group records per season and state, count player occurrences
    start_time = time.perf_counter()
    print(f"grouping and file output ... ", end="")
    os.makedirs("../output/basketball", exist_ok=True)

    output_dict = {}

    # get overall counts per season
    overall_counts = play_by_play.groupby(["season_id", "player_id"], as_index=False, sort=False)\
        .agg({"player_id": "count", "full_name": "first", "position": "first"})\
        .rename(columns={"player_id": "count"})\
        .sort_values(["season_id"])

    output_dict["overall_counts"] = overall_counts.to_dict(orient="records")

    # get counts within each state per season
    state_counts = play_by_play\
        .groupby(["state", "season_id", "player_id"], as_index=False, sort=False)\
        .agg({"player_id": "count", "full_name": "first", "position": "first"})\
        .rename(columns={"player_id": "count"})\
        .sort_values(["state", "season_id"])

    output_dict["per_state_counts"] = state_counts.to_dict(orient="records")

    with open("../output/basketball/basketball.json", "w") as file:
        json.dump(output_dict, file)

    print(f"took {time.perf_counter() - start_time}s")



    print(f"FINISHED, took {time.perf_counter() - start_time_all}s")


if __name__ == '__main__':
    main()
