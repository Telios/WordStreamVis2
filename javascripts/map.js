function init_svg() {
    var width = 1200;
    var height = 800;
    var svg = d3.select("body")
        .append("div")
        .attr("class", "map")
        .style("text-align", "center")
        .style("display", "flex")
        .style("justify-content", "center")
        .append("svg")
        .attr("width", width)
        .attr("style", "background-color:lightgrey")
        .attr("height", height)
        .style("flex-shrink", 0);
        var path = d3.geoPath();

    var g = svg.append("g");

    const colorscheme = [
        { label: 'person', color: '#8c2c2c' },
        { label: 'location', color: '#166416' },
        { label: 'organization', color: '#26267a' },
        { label: 'miscellaneous', color: '#781c9b' }
    ];

    const state_offsets = {
        "New Jersey": {xOffset: width * 0.1, yOffset: height * 0.05},
        "Delaware": {xOffset: width * 0.1, yOffset: height * 0.05},
        "Maryland": {xOffset: width * 0.1, yOffset: height * 0.075},
        "District of Columbia": {xOffset: width * 0.1, yOffset: height * 0.1},
        "New Hampshire": {xOffset: width * 0.1, yOffset: 0 },
        "Massachusetts": {xOffset: width * 0.1, yOffset: 0 },
        "Connecticut": {xOffset: width * 0.1, yOffset: height * 0.05 },
        "Rhode Island": {xOffset: width * 0.1, yOffset: height * 0.02 },
        "Vermont": {xOffset: width * 0.1, yOffset: -height * 0.03 },
    }

    var states_and_most_important_word_per_year = {
        "New Jersey": {
            "1980": ["person", "Reagan"],
            "1981": ["location", "New York"],
            "1982": ["organization", "Apple"],
            "1983": ["person", "Reagan"],
            "1984": ["miscellaneous", "1984"],
            "1985": ["person", "Reagan"],
            "1986": ["person", "Reagan"],
            "1987": ["person", "Reagan"],
            "1988": ["person", "Reagan"],
            "1989": ["person", "Reagan"],
            "1990": ["person", "Bush"],
            "1991": ["person", "Bush"],
            "1992": ["person", "Bush"],
            "1993": ["person", "Clinton"],
            "1994": ["person", "Clinton"],
            "1995": ["person", "Clinton"],
            "1996": ["person", "Clinton"],
            "1997": ["person", "Clinton"],
            "1998": ["person", "Clinton"],
            "1999": ["person", "Clinton"],
            "2000": ["person", "Bush"],
            "2001": ["person", "Bush"],
            "2002": ["person", "Bush"],
            "2003": ["person", "Bush"],
            "2004": ["person", "Bush"],
            "2005": ["person", "Bush"],
            "2006": ["person", "Bush"],
            "2007": ["person", "Bush"],
            "2008": ["person", "Bush"],
            "2009": ["person", "Obama"],
            "2010": ["person", "Obama"],
            "2011": ["person", "Obama"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Obama"],
            "2014": ["person", "Obama"],
            "2015": ["person", "Obama"],
            "2016": ["person", "Obama"],
            "2017": ["person", "Trump"],
            "2018": ["person", "Trump"],
            "2019": ["person", "Trump"],
            "2020": ["person", "Trump"]
        },
        "Alabama": {
            "1980": ["person", "Reagan"],
            "1981": ["location", "New York"],
            "1982": ["organization", "Apple"],
            "1983": ["person", "Reagan"],
            "1984": ["miscellaneous", "1984"],
            "1985": ["person", "Reagan"],
            "1986": ["person", "Reagan"],
            "1987": ["person", "Reagan"],
            "1988": ["person", "Reagan"],
            "1989": ["person", "Reagan"],
            "1990": ["person", "Bush"],
            "1991": ["person", "Bush"],
            "1992": ["person", "Bush"],
            "1993": ["person", "Clinton"],
            "1994": ["person", "Clinton"],
            "1995": ["person", "Clinton"],
            "1996": ["person", "Clinton"],
            "1997": ["person", "Clinton"],
            "1998": ["person", "Clinton"],
            "1999": ["person", "Clinton"],
            "2000": ["person", "Bush"],
            "2001": ["person", "Bush"],
            "2002": ["person", "Bush"],
            "2003": ["person", "Bush"],
            "2004": ["person", "Bush"],
            "2005": ["person", "Bush"],
            "2006": ["person", "Bush"],
            "2007": ["person", "Bush"],
            "2008": ["person", "Bush"],
            "2009": ["person", "Obama"],
            "2010": ["person", "Obama"],
            "2011": ["person", "Obama"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Obama"],
            "2014": ["person", "Obama"],
            "2015": ["person", "Obama"],
            "2016": ["person", "Obama"],
            "2017": ["person", "Trump"],
            "2018": ["person", "Trump"],
            "2019": ["person", "Trump"],
            "2020": ["person", "Trump"]
        },
        "Alaska": {
            "1980": ["person", "Reagan"],
            "1981": ["location", "New York"],
            "1982": ["organization", "Apple"],
            "1983": ["person", "Reagan"],
            "1984": ["miscellaneous", "1984"],
            "1985": ["person", "Reagan"],
            "1986": ["person", "Reagan"],
            "1987": ["person", "Reagan"],
            "1988": ["person", "Reagan"],
            "1989": ["person", "Reagan"],
            "1990": ["person", "Bush"],
            "1991": ["person", "Bush"],
            "1992": ["person", "Bush"],
            "1993": ["person", "Clinton"],
            "1994": ["person", "Clinton"],
            "1995": ["person", "Clinton"],
            "1996": ["person", "Clinton"],
            "1997": ["person", "Clinton"],
            "1998": ["person", "Clinton"],
            "1999": ["person", "Clinton"],
            "2000": ["person", "Bush"],
            "2001": ["person", "Bush"],
            "2002": ["person", "Bush"],
            "2003": ["person", "Bush"],
            "2004": ["person", "Bush"],
            "2005": ["person", "Bush"],
            "2006": ["person", "Bush"],
            "2007": ["person", "Bush"],
            "2008": ["person", "Bush"],
            "2009": ["person", "Obama"],
            "2010": ["person", "Obama"],
            "2011": ["person", "Obama"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Obama"],
            "2014": ["person", "Obama"],
            "2015": ["person", "Obama"],
            "2016": ["person", "Obama"],
            "2017": ["person", "Trump"],
            "2018": ["person", "Trump"],
            "2019": ["person", "Trump"],
            "2020": ["person", "Trump"]
        },
        "Arizona": {
            "1980": ["person", "Reagan"],
            "1981": ["location", "New York"],
            "1982": ["organization", "Apple"],
            "1983": ["person", "Reagan"],
            "1984": ["miscellaneous", "1984"],
            "1985": ["person", "Reagan"],
            "1986": ["person", "Reagan"],
            "1987": ["person", "Reagan"],
            "1988": ["person", "Reagan"],
            "1989": ["person", "Reagan"],
            "1990": ["person", "Bush"],
            "1991": ["person", "Bush"],
            "1992": ["person", "Bush"],
            "1993": ["person", "Clinton"],
            "1994": ["person", "Clinton"],
            "1995": ["person", "Clinton"],
            "1996": ["person", "Clinton"],
            "1997": ["person", "Clinton"],
            "1998": ["person", "Clinton"],
            "1999": ["person", "Clinton"],
            "2000": ["person", "Bush"],
            "2001": ["person", "Bush"],
            "2002": ["person", "Bush"],
            "2003": ["person", "Bush"],
            "2004": ["person", "Bush"],
            "2005": ["person", "Bush"],
            "2006": ["person", "Bush"],
            "2007": ["person", "Bush"],
            "2008": ["person", "Bush"],
            "2009": ["person", "Obama"],
            "2010": ["person", "Obama"],
            "2011": ["person", "Obama"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Obama"],
            "2014": ["person", "Obama"],
            "2015": ["person", "Obama"],
            "2016": ["person", "Obama"],
            "2017": ["person", "Trump"],
            "2018": ["person", "Trump"],
            "2019": ["person", "Trump"],
            "2020": ["person", "Trump"]
        },
        "Arkansas": {
            "1980": ["person", "Reagan"],
            "1981": ["location", "New York"],
            "1982": ["organization", "Apple"],
            "1983": ["person", "Reagan"],
            "1984": ["miscellaneous", "1984"],
            "1985": ["person", "Reagan"],
            "1986": ["person", "Reagan"],
            "1987": ["person", "Reagan"],
            "1988": ["person", "Reagan"],
            "1989": ["person", "Reagan"],
            "1990": ["person", "Bush"],
            "1991": ["person", "Bush"],
            "1992": ["person", "Bush"],
            "1993": ["person", "Clinton"],
            "1994": ["person", "Clinton"],
            "1995": ["person", "Clinton"],
            "1996": ["person", "Clinton"],
            "1997": ["person", "Clinton"],
            "1998": ["person", "Clinton"],
            "1999": ["person", "Clinton"],
            "2000": ["person", "Bush"],
            "2001": ["person", "Bush"],
            "2002": ["person", "Bush"],
            "2003": ["person", "Bush"],
            "2004": ["person", "Bush"],
            "2005": ["person", "Bush"],
            "2006": ["person", "Bush"],
            "2007": ["person", "Bush"],
            "2008": ["person", "Bush"],
            "2009": ["person", "Obama"],
            "2010": ["person", "Obama"],
            "2011": ["person", "Obama"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Obama"],
            "2014": ["person", "Obama"],
            "2015": ["person", "Obama"],
            "2016": ["person", "Obama"],
            "2017": ["person", "Trump"],
            "2018": ["person", "Trump"],
            "2019": ["person", "Trump"],
            "2020": ["person", "Trump"]
        },
        "California": {
            "1980": ["person", "Reagan"],
            "1981": ["location", "New York"],
            "1982": ["organization", "Apple"],
            "1983": ["person", "Reagan"],
            "1984": ["miscellaneous", "1984"],
            "1985": ["person", "Reagan"],
            "1986": ["person", "Reagan"],
            "1987": ["person", "Reagan"],
            "1988": ["person", "Reagan"],
            "1989": ["person", "Reagan"],
            "1990": ["person", "Bush"],
            "1991": ["person", "Bush"],
            "1992": ["person", "Bush"],
            "1993": ["person", "Clinton"],
            "1994": ["person", "Clinton"],
            "1995": ["person", "Clinton"],
            "1996": ["person", "Clinton"],
            "1997": ["person", "Clinton"],
            "1998": ["person", "Clinton"],
            "1999": ["person", "Clinton"],
            "2000": ["person", "Bush"],
            "2001": ["person", "Bush"],
            "2002": ["person", "Bush"],
            "2003": ["person", "Bush"],
            "2004": ["person", "Bush"],
            "2005": ["person", "Bush"],
            "2006": ["person", "Bush"],
            "2007": ["person", "Bush"],
            "2008": ["person", "Bush"],
            "2009": ["person", "Obama"],
            "2010": ["person", "Obama"],
            "2011": ["person", "Obama"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Obama"],
            "2014": ["person", "Obama"],
            "2015": ["person", "Obama"],
            "2016": ["person", "Obama"],
            "2017": ["person", "Trump"],
            "2018": ["person", "Trump"],
            "2019": ["person", "Trump"],
            "2020": ["person", "Trump"]
        },
        "Colorado": {
            "1980": ["person", "Reagan"],
            "1981": ["location", "New York"],
            "1982": ["organization", "Apple"],
            "1983": ["person", "Reagan"],
            "1984": ["miscellaneous", "1984"],
            "1985": ["person", "Reagan"],
            "1986": ["person", "Reagan"],
            "1987": ["person", "Reagan"],
            "1988": ["person", "Reagan"],
            "1989": ["person", "Reagan"],
            "1990": ["person", "Bush"],
            "1991": ["person", "Bush"],
            "1992": ["person", "Bush"],
            "1993": ["person", "Clinton"],
            "1994": ["person", "Clinton"],
            "1995": ["person", "Clinton"],
            "1996": ["person", "Clinton"],
            "1997": ["person", "Clinton"],
            "1998": ["person", "Clinton"],
            "1999": ["person", "Clinton"],
            "2000": ["person", "Bush"],
            "2001": ["person", "Bush"],
            "2002": ["person", "Bush"],
            "2003": ["person", "Bush"],
            "2004": ["person", "Bush"],
            "2005": ["person", "Bush"],
            "2006": ["person", "Bush"],
            "2007": ["person", "Bush"],
            "2008": ["person", "Bush"],
            "2009": ["person", "Obama"],
            "2010": ["person", "Obama"],
            "2011": ["person", "Obama"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Obama"],
            "2014": ["person", "Obama"],
            "2015": ["person", "Obama"],
            "2016": ["person", "Obama"],
            "2017": ["person", "Trump"],
            "2018": ["person", "Trump"],
            "2019": ["person", "Trump"],
            "2020": ["person", "Trump"]
        },
        "Connecticut": {
            "1980": ["person", "Mohammad Ali"],
            "1981": ["location", "London"],
            "1982": ["organization", "Microsoft"],
            "1983": ["person", "Mohammad Ali"],
            "1984": ["miscellaneous", "1984"],
            "1985": ["person", "Mohammad Ali"],
            "1986": ["person", "Mohammad Ali"],
            "1987": ["organization", "Apple"],
            "1988": ["person", "Mohammad Ali"],
            "1989": ["person", "Mohammad Ali"],
            "1990": ["person", "Mohammad Ali"],
            "1991": ["miscellaneous", "Dogs"],
            "1992": ["person", "Mohammad Ali"],
            "1993": ["person", "Mohammad Ali"],
            "1994": ["person", "Mohammad Ali"],
            "1995": ["person", "Mohammad Ali"],
            "1996": ["location", "Tokio"],
            "1997": ["person", "Mohammad Ali"],
            "1998": ["person", "Mohammad Ali"],
            "1999": ["organization", "Google"],
            "2000": ["person", "Mohammad Ali"],
            "2001": ["person", "Mohammad Ali"],
            "2002": ["person", "Mohammad Ali"],
            "2003": ["person", "Mohammad Ali"],
            "2004": ["person", "Mohammad Ali"],
            "2005": ["person", "Mohammad Ali"],
            "2006": ["person", "Mohammad Ali"],
            "2007": ["person", "Mohammad Ali"],
            "2008": ["person", "Mohammad Ali"],
            "2009": ["person", "Mohammad Ali"],
            "2010": ["person", "Mohammad Ali"],
            "2011": ["person", "Mohammad Ali"],
            "2012": ["person", "Mohammad Ali"],
            "2013": ["person", "Mohammad Ali"],
            "2014": ["person", "Mohammad Ali"],
            "2015": ["person", "Mohammad Ali"],
            "2016": ["person", "Mohammad Ali"],
            "2017": ["person", "Mohammad Ali"],
            "2018": ["person", "Mohammad Ali"],
            "2019": ["person", "Mohammad Ali"],
            "2020": ["person", "Mohammad Ali"]
        },
        "Delaware": {
            "1980": ["organization", "DuPont"],
            "1981": ["location", "Wilmington"],
            "1982": ["person", "Joe Biden"],
            "1983": ["miscellaneous", "Delaware River"],
            "1984": ["person", "Henry Heimlich"],
            "1985": ["location", "Bethany Beach"],
            "1986": ["organization", "AstraZeneca"],
            "1987": ["person", "Duke Kahanamoku"],
            "1988": ["location", "Rehoboth Beach"],
            "1989": ["organization", "DuPont"],
            "1990": ["person", "Joe Biden"],
            "1991": ["miscellaneous", "Dover International Speedway"],
            "1992": ["organization", "W. L. Gore & Associates"],
            "1993": ["person", "Kathleen Battle"],
            "1994": ["organization", "DuPont"],
            "1995": ["person", "E. I. du Pont"],
            "1996": ["location", "Delaware Water Gap"],
            "1997": ["organization", "Agilent Technologies"],
            "1998": ["person", "Valerie Bertinelli"],
            "1999": ["miscellaneous", "Dogfish Head Brewery"],
            "2000": ["person", "Joe Biden"],
            "2001": ["organization", "DuPont"],
            "2002": ["person", "Aubrey Plaza"],
            "2003": ["location", "Dewey Beach"],
            "2004": ["miscellaneous", "Delaware State Fair"],
            "2005": ["person", "Eddie Alvarez"],
            "2006": ["organization", "W. L. Gore & Associates"],
            "2007": ["person", "Tara Reid"],
            "2008": ["location", "Lewes Beach"],
            "2009": ["organization", "DuPont"],
            "2010": ["person", "Elena Delle Donne"],
            "2011": ["miscellaneous", "Firefly Music Festival"],
            "2012": ["person", "Joe Flacco"],
            "2013": ["organization", "W. L. Gore & Associates"],
            "2014": ["location", "Rehoboth Beach"],
            "2015": ["miscellaneous", "Punkin Chunkin"],
            "2016": ["person", "Joe Biden"],
            "2017": ["organization", "Ashland Global Holdings"],
            "2018": ["person", "Elena Delle Donne"],
            "2019": ["miscellaneous", "Delaware Beer Wine & Spirits Festival"],
            "2020": ["organization", "W. L. Gore & Associates"]
        },
        "Florida": {
            "1980": ["person", "Reagan"],
            "1981": ["location", "Miami"],
            "1982": ["organization", "NASA"],
            "1983": ["person", "Jackson"],
            "1984": ["miscellaneous", "Orlando"],
            "1985": ["person", "Cruise"],
            "1986": ["person", "Jordan"],
            "1987": ["organization", "Disney"],
            "1988": ["location", "Tampa"],
            "1989": ["person", "Bush"],
            "1990": ["person", "Jordan"],
            "1991": ["person", "Jordan"],
            "1992": ["person", "Clinton"],
            "1993": ["organization", "NBA"],
            "1994": ["person", "Jackson"],
            "1995": ["person", "Jackson"],
            "1996": ["person", "Dole"],
            "1997": ["person", "DiCaprio"],
            "1998": ["person", "Clinton"],
            "1999": ["organization", "UNF"],
            "2000": ["person", "Bush"],
            "2001": ["organization", "CIA"],
            "2002": ["location", "Miami"],
            "2003": ["person", "Jordan"],
            "2004": ["person", "Bush"],
            "2005": ["location", "Orlando"],
            "2006": ["person", "James"],
            "2007": ["person", "Obama"],
            "2008": ["person", "Obama"],
            "2009": ["organization", "NBA"],
            "2010": ["person", "LeBron"],
            "2011": ["person", "Casey"],
            "2012": ["organization", "NASA"],
            "2013": ["person", "Jordan"],
            "2014": ["person", "Bieber"],
            "2015": ["person", "Trump"],
            "2016": ["person", "Trump"],
            "2017": ["organization", "Disney"],
            "2018": ["person", "Trump"],
            "2019": ["location", "Tallahassee"],
            "2020": ["person", "Biden"]
        },
        "Georgia": {
            "1980": ["person", "Carter"],
            "1981": ["location", "Atlanta"],
            "1982": ["organization", "Coca-Cola"],
            "1983": ["person", "Reagan"],
            "1984": ["person", "Jackson"],
            "1985": ["organization", "Delta"],
            "1986": ["location", "Savannah"],
            "1987": ["person", "Tyson"],
            "1988": ["person", "Dukakis"],
            "1989": ["person", "Bush"],
            "1990": ["location", "Augusta"],
            "1991": ["person", "Jordan"],
            "1992": ["person", "Clinton"],
            "1993": ["person", "Jordan"],
            "1994": ["person", "Jackson"],
            "1995": ["person", "O'Neal"],
            "1996": ["person", "Atlanta"],
            "1997": ["organization", "CNN"],
            "1998": ["person", "Jordan"],
            "1999": ["location", "Savannah"],
            "2000": ["person", "Bush"],
            "2001": ["person", "Bin Laden"],
            "2002": ["person", "Vick"],
            "2003": ["person", "Bush"],
            "2004": ["person", "Bush"],
            "2005": ["person", "Irvin"],
            "2006": ["person", "Jones"],
            "2007": ["organization", "Coca-Cola"],
            "2008": ["person", "Obama"],
            "2009": ["person", "Peterson"],
            "2010": ["person", "James"],
            "2011": ["organization", "UPS"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Zimmerman"],
            "2014": ["person", "Ebola"],
            "2015": ["person", "Trump"],
            "2016": ["person", "Trump"],
            "2017": ["person", "Pruitt"],
            "2018": ["person", "Abrams"],
            "2019": ["organization", "CDC"],
            "2020": ["person", "Biden"]
        },
        "Hawaii": {
            "1980": ["location", "Honolulu"],
            "1981": ["person", "Inouye"],
            "1982": ["person", "Aiona"],
            "1983": ["organization", "Hawaiian Airlines"],
            "1984": ["person", "Fong"],
            "1985": ["miscellaneous", "Aloha"],
            "1986": ["person", "Waihee"],
            "1987": ["location", "Maui"],
            "1988": ["person", "Akaka"],
            "1989": ["organization", "Maui Land and Pineapple Company"],
            "1990": ["person", "Waihee"],
            "1991": ["location", "Kauai"],
            "1992": ["person", "Inouye"],
            "1993": ["organization", "Hawaiian Electric"],
            "1994": ["person", "Cayetano"],
            "1995": ["person", "Fasi"],
            "1996": ["organization", "Aloha Airlines"],
            "1997": ["location", "Pearl Harbor"],
            "1998": ["person", "Lingle"],
            "1999": ["organization", "Hawaiian Telcom"],
            "2000": ["person", "Akaka"],
            "2001": ["person", "Fong"],
            "2002": ["person", "Hirono"],
            "2003": ["person", "Lingle"],
            "2004": ["person", "Obama"],
            "2005": ["person", "Lingle"],
            "2006": ["person", "Inouye"],
            "2007": ["organization", "Matson"],
            "2008": ["person", "Obama"],
            "2009": ["person", "Lingle"],
            "2010": ["person", "Aiona"],
            "2011": ["person", "Inouye"],
            "2012": ["organization", "Hawaiian Airlines"],
            "2013": ["person", "Abercrombie"],
            "2014": ["person", "Schatz"],
            "2015": ["person", "Ige"],
            "2016": ["person", "Sanders"],
            "2017": ["person", "Gabbard"],
            "2018": ["person", "Ige"],
            "2019": ["organization", "Hawaiian Electric"],
            "2020": ["person", "Biden"]
        },
        "Idaho": {
            "1980": ["person", "Andrus"],
            "1981": ["location", "Boise"],
            "1982": ["person", "Reagan"],
            "1983": ["organization", "Micron"],
            "1984": ["person", "Andrus"],
            "1985": ["person", "Andrus"],
            "1986": ["miscellaneous", "Potato"],
            "1987": ["person", "Andrus"],
            "1988": ["person", "Bush"],
            "1989": ["person", "Bush"],
            "1990": ["person", "Andrus"],
            "1991": ["person", "Andrus"],
            "1992": ["person", "Bush"],
            "1993": ["person", "Clinton"],
            "1994": ["person", "Clinton"],
            "1995": ["person", "Clinton"],
            "1996": ["person", "Clinton"],
            "1997": ["person", "Clinton"],
            "1998": ["person", "Clinton"],
            "1999": ["person", "Clinton"],
            "2000": ["person", "Bush"],
            "2001": ["person", "Bush"],
            "2002": ["person", "Bush"],
            "2003": ["organization", "Micron"],
            "2004": ["person", "Bush"],
            "2005": ["person", "Bush"],
            "2006": ["organization", "Micron"],
            "2007": ["person", "Bush"],
            "2008": ["person", "Obama"],
            "2009": ["person", "Obama"],
            "2010": ["person", "Obama"],
            "2011": ["person", "Obama"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Obama"],
            "2014": ["person", "Obama"],
            "2015": ["person", "Obama"],
            "2016": ["person", "Trump"],
            "2017": ["person", "Trump"],
            "2018": ["person", "Trump"],
            "2019": ["person", "Trump"],
            "2020": ["person", "Trump"]
        },
        "Illinois": {
            "1980": ["person", "Daley"],
            "1981": ["location", "Chicago"],
            "1982": ["person", "Daley"],
            "1983": ["organization", "Sears"],
            "1984": ["person", "Daley"],
            "1985": ["person", "Daley"],
            "1986": ["miscellaneous", "Chicago"],
            "1987": ["person", "Daley"],
            "1988": ["person", "Daley"],
            "1989": ["person", "Daley"],
            "1990": ["person", "Daley"],
            "1991": ["person", "Daley"],
            "1992": ["person", "Daley"],
            "1993": ["person", "Daley"],
            "1994": ["person", "Daley"],
            "1995": ["person", "Daley"],
            "1996": ["person", "Daley"],
            "1997": ["person", "Daley"],
            "1998": ["person", "Daley"],
            "1999": ["person", "Daley"],
            "2000": ["person", "Daley"],
            "2001": ["person", "Daley"],
            "2002": ["person", "Daley"],
            "2003": ["organization", "Boeing"],
            "2004": ["person", "Daley"],
            "2005": ["person", "Daley"],
            "2006": ["organization", "Boeing"],
            "2007": ["person", "Daley"],
            "2008": ["person", "Obama"],
            "2009": ["person", "Obama"],
            "2010": ["person", "Obama"],
            "2011": ["person", "Obama"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Obama"],
            "2014": ["person", "Obama"],
            "2015": ["person", "Obama"],
            "2016": ["person", "Obama"],
            "2017": ["person", "Trump"],
            "2018": ["person", "Trump"],
            "2019": ["person", "Trump"],
            "2020": ["person", "Trump"]
        },
        "Indiana": {
            "1980": ["person", "Orr"],
            "1981": ["location", "Indianapolis"],
            "1982": ["person", "Orr"],
            "1983": ["organization", "Eli Lilly"],
            "1984": ["person", "Orr"],
            "1985": ["person", "Orr"],
            "1986": ["miscellaneous", "Indianapolis"],
            "1987": ["person", "Orr"],
            "1988": ["person", "Orr"],
            "1989": ["person", "Orr"],
            "1990": ["person", "Orr"],
            "1991": ["person", "Orr"],
            "1992": ["person", "Orr"],
            "1993": ["person", "Orr"],
            "1994": ["person", "Orr"],
            "1995": ["person", "Orr"],
            "1996": ["person", "Orr"],
            "1997": ["person", "Orr"],
            "1998": ["person", "Orr"],
            "1999": ["person", "Orr"],
            "2000": ["person", "Orr"],
            "2001": ["person", "Orr"],
            "2002": ["person", "Orr"],
            "2003": ["organization", "Eli Lilly"],
            "2004": ["person", "Orr"],
            "2005": ["person", "Orr"],
            "2006": ["organization", "Eli Lilly"],
            "2007": ["person", "Orr"],
            "2008": ["person", "Obama"],
            "2009": ["person", "Obama"],
            "2010": ["person", "Obama"],
            "2011": ["person", "Obama"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Obama"],
            "2014": ["person", "Obama"],
            "2015": ["person", "Obama"],
            "2016": ["person", "Trump"],
            "2017": ["person", "Pence"],
            "2018": ["person", "Pence"],
            "2019": ["person", "Pence"],
            "2020": ["person", "Pence"]
        },
        "Iowa": {
            "1980": ["person", "Branstad"],
            "1981": ["location", "Des Moines"],
            "1982": ["person", "Branstad"],
            "1983": ["organization", "John Deere"],
            "1984": ["person", "Branstad"],
            "1985": ["person", "Branstad"],
            "1986": ["miscellaneous", "Des Moines"],
            "1987": ["person", "Branstad"],
            "1988": ["person", "Branstad"],
            "1989": ["person", "Branstad"],
            "1990": ["person", "Branstad"],
            "1991": ["person", "Branstad"],
            "1992": ["person", "Branstad"],
            "1993": ["person", "Branstad"],
            "1994": ["person", "Branstad"],
            "1995": ["person", "Branstad"],
            "1996": ["person", "Branstad"],
            "1997": ["person", "Branstad"],
            "1998": ["person", "Branstad"],
            "1999": ["person", "Branstad"],
            "2000": ["person", "Branstad"],
            "2001": ["person", "Branstad"],
            "2002": ["person", "Branstad"],
            "2003": ["organization", "John Deere"],
            "2004": ["person", "Branstad"],
            "2005": ["person", "Branstad"],
            "2006": ["organization", "John Deere"],
            "2007": ["person", "Branstad"],
            "2008": ["person", "Obama"],
            "2009": ["person", "Obama"],
            "2010": ["person", "Obama"],
            "2011": ["person", "Obama"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Obama"],
            "2014": ["person", "Obama"],
            "2015": ["person", "Obama"],
            "2016": ["person", "Trump"],
            "2017": ["person", "Trump"],
            "2018": ["person", "Trump"],
            "2019": ["person", "Trump"],
            "2020": ["person", "Trump"]
        },
        "Kansas": {
            "1980": ["person", "Carlin"],
            "1981": ["location", "Topeka"],
            "1982": ["person", "Carlin"],
            "1983": ["organization", "Boeing"],
            "1984": ["person", "Carlin"],
            "1985": ["person", "Carlin"],
            "1986": ["miscellaneous", "Topeka"],
            "1987": ["person", "Carlin"],
            "1988": ["person", "Carlin"],
            "1989": ["person", "Carlin"],
            "1990": ["person", "Carlin"],
            "1991": ["person", "Carlin"],
            "1992": ["person", "Carlin"],
            "1993": ["person", "Carlin"],
            "1994": ["person", "Carlin"],
            "1995": ["person", "Carlin"],
            "1996": ["person", "Carlin"],
            "1997": ["person", "Carlin"],
            "1998": ["person", "Carlin"],
            "1999": ["person", "Carlin"],
            "2000": ["person", "Carlin"],
            "2001": ["person", "Carlin"],
            "2002": ["person", "Carlin"],
            "2003": ["organization", "Boeing"],
            "2004": ["person", "Carlin"],
            "2005": ["person", "Carlin"],
            "2006": ["organization", "Boeing"],
            "2007": ["person", "Carlin"],
            "2008": ["person", "Obama"],
            "2009": ["person", "Obama"],
            "2010": ["person", "Obama"],
            "2011": ["person", "Obama"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Obama"],
            "2014": ["person", "Obama"],
            "2015": ["person", "Obama"],
            "2016": ["person", "Trump"],
            "2017": ["person", "Trump"],
            "2018": ["person", "Trump"],
            "2019": ["person", "Trump"],
            "2020": ["person", "Trump"]
        },
        "Kentucky": {
            "1980": ["person", "Brown"],
            "1981": ["location", "Frankfort"],
            "1982": ["person", "Brown"],
            "1983": ["organization", "Ford"],
            "1984": ["person", "Brown"],
            "1985": ["person", "Brown"],
            "1986": ["miscellaneous", "Frankfort"],
            "1987": ["person", "Brown"],
            "1988": ["person", "Brown"],
            "1989": ["person", "Brown"],
            "1990": ["person", "Brown"],
            "1991": ["person", "Brown"],
            "1992": ["person", "Brown"],
            "1993": ["person", "Brown"],
            "1994": ["person", "Brown"],
            "1995": ["person", "Brown"],
            "1996": ["person", "Brown"],
            "1997": ["person", "Brown"],
            "1998": ["person", "Brown"],
            "1999": ["person", "Brown"],
            "2000": ["person", "Brown"],
            "2001": ["person", "Brown"],
            "2002": ["person", "Brown"],
            "2003": ["organization", "Ford"],
            "2004": ["person", "Brown"],
            "2005": ["person", "Brown"],
            "2006": ["organization", "Ford"],
            "2007": ["person", "Brown"],
            "2008": ["person", "Obama"],
            "2009": ["person", "Obama"],
            "2010": ["person", "Obama"],
            "2011": ["person", "Obama"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Obama"],
            "2014": ["person", "Obama"],
            "2015": ["person", "Obama"],
            "2016": ["person", "Trump"],
            "2017": ["person", "Trump"],
            "2018": ["person", "Trump"],
            "2019": ["person", "Trump"],
            "2020": ["person", "Trump"]
        },
        "Louisiana": {
            "1980": ["person", "Treen"],
            "1981": ["location", "Baton Rouge"],
            "1982": ["person", "Treen"],
            "1983": ["organization", "Texaco"],
            "1984": ["person", "Treen"],
            "1985": ["person", "Treen"],
            "1986": ["miscellaneous", "Baton Rouge"],
            "1987": ["person", "Treen"],
            "1988": ["person", "Treen"],
            "1989": ["person", "Treen"],
            "1990": ["person", "Treen"],
            "1991": ["person", "Treen"],
            "1992": ["person", "Treen"],
            "1993": ["person", "Treen"],
            "1994": ["person", "Treen"],
            "1995": ["person", "Treen"],
            "1996": ["person", "Treen"],
            "1997": ["person", "Treen"],
            "1998": ["person", "Treen"],
            "1999": ["person", "Treen"],
            "2000": ["person", "Treen"],
            "2001": ["person", "Treen"],
            "2002": ["person", "Treen"],
            "2003": ["organization", "Texaco"],
            "2004": ["person", "Treen"],
            "2005": ["person", "Treen"],
            "2006": ["organization", "Texaco"],
            "2007": ["person", "Treen"],
            "2008": ["person", "Obama"],
            "2009": ["person", "Obama"],
            "2010": ["person", "Obama"],
            "2011": ["person", "Obama"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Obama"],
            "2014": ["person", "Obama"],
            "2015": ["person", "Obama"],
            "2016": ["person", "Trump"],
            "2017": ["person", "Trump"],
            "2018": ["person", "Trump"],
            "2019": ["person", "Trump"],
            "2020": ["person", "Trump"]
        },
        "Maine": {
            "1980": ["person", "Longley"],
            "1981": ["location", "Augusta"],
            "1982": ["person", "Longley"],
            "1983": ["organization", "Ford"],
            "1984": ["person", "Longley"],
            "1985": ["person", "Longley"],
            "1986": ["miscellaneous", "Augusta"],
            "1987": ["person", "Longley"],
            "1988": ["person", "Longley"],
            "1989": ["person", "Longley"],
            "1990": ["person", "Longley"],
            "1991": ["person", "Longley"],
            "1992": ["person", "Longley"],
            "1993": ["person", "Longley"],
            "1994": ["person", "Longley"],
            "1995": ["person", "Longley"],
            "1996": ["person", "Longley"],
            "1997": ["person", "Longley"],
            "1998": ["person", "Longley"],
            "1999": ["person", "Longley"],
            "2000": ["person", "Longley"],
            "2001": ["person", "Longley"],
            "2002": ["person", "Longley"],
            "2003": ["organization", "Ford"],
            "2004": ["person", "Longley"],
            "2005": ["person", "Longley"],
            "2006": ["organization", "Ford"],
            "2007": ["person", "Longley"],
            "2008": ["person", "Obama"],
            "2009": ["person", "Obama"],
            "2010": ["person", "Obama"],
            "2011": ["person", "Obama"],
            "2012": ["person", "Obama"],
            "2013": ["person", "Obama"],
            "2014": ["person", "Obama"],
            "2015": ["person", "Obama"],
            "2016": ["person", "Clinton"],
            "2017": ["person", "Clinton"],
            "2018": ["person", "Clinton"],
            "2019": ["person", "Clinton"],
            "2020": ["person", "Clinton"]
        },

    }

    var selectedStates = [];

    function loadSelectedStatesFromCookie() {
        let selectedStatesFromCookie = readSelectedStateCookie();
        
        selectedStatesFromCookie.forEach(selectedState => {
            let selection = d3.selectAll("#" + selectedState.replace(" ", ""));
            click.call(selection.node(), undefined, selection.data()[0]);
        });
    }

    geoJsonUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json";

    d3.json(geoJsonUrl).then(us => {
        var states = g.append("g")
            .attr("fill", "#444")
            .attr("cursor", "pointer")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .join("path")
            .attr("d", path)
            .attr("id", d => d.properties.name.replace(" ", ""))
            .attr("class", "state")
            .on("mouseover", mouseover)
            .on("click", click)
            .on("mouseout", mouseout);

        states.append("title").text(d => d.properties.name);

        svg.append("g")
            .selectAll("line")
            .data(topojson.feature(us, us.objects.states).features)
            .join("line")
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attrs(function(d) {
                if (Object.keys(state_offsets).includes(d.properties.name)) {
                return {
                x1: path.centroid(d)[0],
                y1: path.centroid(d)[1],
                x2: path.centroid(d)[0] + state_offsets[d.properties.name].xOffset - width * 0.005,
                y2: path.centroid(d)[1] + state_offsets[d.properties.name].yOffset};
                }}
            );

        g.append("g")
            .selectAll("text")
            .data(topojson.feature(us, us.objects.states).features)
            .join("text")
            .attrs(function(d) {
                if (Object.keys(state_offsets).includes(d.properties.name)) {
                return {
                x: path.centroid(d)[0] + state_offsets[d.properties.name].xOffset,
                y: path.centroid(d)[1] + state_offsets[d.properties.name].yOffset,
                } } else {
                return {
                x: path.centroid(d)[0],
                y: path.centroid(d)[1],
                }}
            })
            .attr("dy", ".2em")
            .attr("text-anchor", function(d) {
                return Object.keys(state_offsets).includes(d.properties.name) ? "left": "middle";
            })
            .attr("fill", "#ffffff")
            .attr("pointer-events", "none")
            .text(d => d.properties.name);

        g.append("path")
            .attr("fill", "none")
            .attr("stroke", "#fff")
            .attr("stroke-linejoin", "round")
            .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));
        loadSelectedStatesFromCookie();
    });



// Create an SVG group element for the legend
    const legend = d3.select("svg")
        .append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + width * 0.8 + "," + height * 0.7 + ")");

// Add rectangles for each category
    legend.selectAll('rect')
        .data(colorscheme)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * 20)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', d => d.color);

// Add text labels for each category
    legend.selectAll('text')
        .data(colorscheme)
        .enter()
        .append('text')
        .attr('x', 15)
        .attr('y', (d, i) => i * 20 + 10)
        .text(d => d.label);

// Style the legend
    legend.style('font-size', '15px')
        .style('font-family', 'Arial')
        .style('fill', '#000000');

    function mouseover(d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("opacity", ".85");
    }

    function mouseout(d) {
        d3.select(this)
            .transition()
            .duration(50)
            .attr("opacity", "1");
    }

    function click(d, i) {
        if (d3.select(this).attr("stroke") === "#10efd5") {
            d3.select(this).attr("stroke", "#fff")
                .attr("stroke-width", "1px");
            selectedStates = selectedStates.filter(state => state !== i.properties.name);
        } else {
            if (selectedStates.length === 4) {
                alert("You can't select more than 4 states");
                return;
            }
            d3.select(this)
                .attr("stroke", "#10efd5")
                .attr("stroke-width", "4px")
                .attr("stroke-linejoin", "round");
            selectedStates.push(i.properties.name);
        }
        console.log(selectedStates);
        document.cookie = "selected_states=" + JSON.stringify(selectedStates);


        d3.selectAll(".selected-states-list").selectAll("div")
            .data(selectedStates)
            .join("div")
            .text(d => d)
            .style("color", "#fff")
            .style("background-color", "rgb(68, 68, 68)")
            .style("padding", "10px 5px 10px 5px")
            .style("margin", "2px")
            .style("border-radius", "5px")
            .style("opacity", 0.85)

        d3.select(".selected-states-panel")
            .style("visibility", selectedStates.length === 0 ? "hidden" : "visible");
    }

    function updateMap(year) {
        var data_of_year_per_state = {};
        Object.entries(states_and_most_important_word_per_year).forEach(state => {
            const stateName = state[0];
            const stateData = state[1];
            data_of_year_per_state[stateName] = stateData[year];
        });

        g.selectAll("text")
            .text(state => {
                if (Object.keys(data_of_year_per_state).includes(state.properties.name)) {
                    return data_of_year_per_state[state.properties.name][1]; // [0] is the category of the word
                                                                             // [1] is the word itself
                } else {
                    return state.properties.name;
                }
            });
        g.selectAll(".state")
            .attr("fill", state => {
                if (Object.keys(data_of_year_per_state).includes(state.properties.name)) {
                    return colorscheme.find(color => color.label === data_of_year_per_state[state.properties.name][0]).color;
                } else {
                    return "#444";
                }
            });
    }

    var slider = d3.sliderHorizontal()
        .min(1980)
        .max(2020)
        .step(1)
        .width(width * 0.8)
        .displayValue(true)
        .on('onchange', val => {
            updateMap(val);
        });


    function startAnimation() {
        if (d3.select("rect[title='start_animation_button']").attr("played_button") === "true") return;
        d3.select("rect[title='start_animation_button']").attr("played_button", "true");
        var i = 1980;
        var interval = setInterval(function() {
            updateMap(i);
            slider.value(i);
            i++;
            if (i > 2020) {
                clearInterval(interval);
                d3.select("rect[title='start_animation_button']").attr("played_button", "false");
            }
        }, 100);
    }

    d3.select("svg").append("g").attr("type", "button")
        .append("rect")
        .attrs({
            rx: 6,
            ry: 6,
            x: width * 0.9,
            y: height * 0.87,
            width: width * 0.057,
            height: height * 0.05,
            fill: "#fff",
            title: "start_animation_button",
            played_button: "false",
            })
        .on("click", startAnimation);

    svg.select("g[type='button']")
        .append("text")
        .attrs({
            x: width * 0.9 + width * 0.0045,
            y: height * 0.87 + height * 0.03,
            font: `${height * 0.03}px sans-serif`,
            "pointer-events": "none"})
        .text("Animate");



    d3.select("svg").append("g")
        .attr("width", width)
        .attr("height", height * 0.1)
        .attr("transform", _ => `translate(${width * 0.05},${height * 0.9})`)
        .call(slider);

    let selectedStatesPanel = d3.select(".map")
        .append("div")
        .attr("class", "selected-states-panel")
        .style("text-align", "center")
        .style("margin", "5px")
        .style("width", "200px")
        .style("visibility", readSelectedStateCookie().length === 0 ? "hidden" : "visible");
    selectedStatesPanel
        .append("div")
        .text("Selected states")
    selectedStatesPanel
        .append("div")
        .attr("class", "selected-states-list")
        .append("div")
        .style("opacity", 0.85)
        .text("None")
    selectedStatesPanel
        .append("a")
        .text("Compare")
        .attr("href", "index.html")
        .attr("class", "button still")
        .style("float", "unset");

}
