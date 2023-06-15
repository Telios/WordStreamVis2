import pandas as pd
import numpy as np


def main():
    # NNDSS dataset contains states "New York (excluding New York City)" and "New York City"
    # merge those, add as "New York", remove both, output

    nndss_df = pd.read_csv("../datasets/nndss/nndss_2016_2020.txt", delimiter="\t",
                           dtype={"Year Code": np.int32, "Disease Code": np.int32, "Case Count": np.int32})

    new_york_metro = nndss_df[nndss_df["States"] == "New York (excluding New York City)"]
    new_york_city = nndss_df[nndss_df["States"] == "New York City"]

    joined = new_york_metro\
        .set_index(["Year", "Disease Code"])\
        .join(new_york_city.set_index(["Year", "Disease Code"]),
              how="outer", lsuffix="_Metro", rsuffix="_City")\
        .fillna(0)

    joined["Case Count"] = joined["Case Count_City"] + joined["Case Count_Metro"]
    mask = joined["States_Metro"] == 0
    joined["Disease_Metro"][mask] = joined["Disease_City"][mask]
    joined["Year Code_Metro"][mask] = joined["Year Code_City"][mask]
    joined["States Code_Metro"][mask] = joined["States Code_City"][mask]
    joined["States_Metro"][mask] = joined["States_City"][mask]
    joined = joined.reset_index()

    joined["States"] = "New York"
    joined["Notes"] = ""
    joined["Disease"] = joined["Disease_Metro"]
    joined["States Code"] = joined["States Code_Metro"]
    joined["Year Code"] = joined["Year Code_Metro"]

    joined_relevant_fields = joined[nndss_df.columns]

    new_nndss_df = pd.concat([nndss_df, joined_relevant_fields])
    new_nndss_df = new_nndss_df[(new_nndss_df["States"] != "New York (excluding New York City)")
                                & (new_nndss_df["States"] != "New York City")]
    new_nndss_df = new_nndss_df.astype({"Year": np.int32,
                                        "Year Code": np.int32,
                                        "Disease Code": np.int32,
                                        "Case Count": np.int32,
                                        "States Code": np.int32})

    new_nndss_df.to_csv("../output/nndss_2016_2020.txt", sep="\t", index=False)

    print(nndss_df)


if __name__ == '__main__':
    main()
