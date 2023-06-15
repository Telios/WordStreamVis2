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
    var d3_colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];
    var colorscheme = [
        //{ label: 'miscellaneous', color: '#781c9b' }
    ];
    var min_year = 1999;
    var max_year = 2020;

    var slider = d3.sliderHorizontal()
        .min(min_year)
        .max(max_year)
        .step(1)
        .width(width * 0.8)
        .displayValue(true)
        .on('onchange', val => {
            updateMap(val);
        });

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

    var states_and_most_important_word_per_year = {};

    function getTopWordsPerState() {
        let dataset = readSelectedDatasetCookie();
        if (!dataset) {
            // TODO cookie missing, cannot show any words - what to do?
        }
    
        if (dataset === "Basketball") {
            
        } else if (dataset === "UCD") {
            d3.tsv("data/UCD_1999_2020.txt")
                .then((rawData) => {
                    const remappedRawData = rawData.map(entry => {
                        const code = entry["ICD-10 113 Cause List Code"];
                        return {
                            state: entry.State,
                            year: entry['Year Code'],
                            deaths: entry.Deaths,
                            text: REMAPPING_UCD[code].name,
                            category: REMAPPING_UCD[code].category,
                        };
                    });
    
                    const states = getUniqueValues(rawData.map(row => row.State));
                    const categories = getUniqueValues(Object.values(REMAPPING_UCD).map(entry => entry.category));

                    colorscheme = categories.map((entry, i) => {return {label: entry, color: d3_colors[i]}});
                    drawLegend();

                    const stateProcessedData = states.map(state => {
                        const stateRawData = remappedRawData.filter(row => row.state === state);
                        return processRawFrequencyItems(stateRawData, "year", "category", "deaths", "text");
                    });
    
                    stateProcessedData.forEach(data => processSudden(data));
                    let topWords = Object.fromEntries(
                        stateProcessedData.map((dataPerState, stateIndex) => [
                            states[stateIndex],
                            Object.fromEntries(dataPerState.map((dataPerStateAndYear, yearIndex) => {
                                const sortedWordsInYear = []
                                    .concat(...Object.values(dataPerStateAndYear.words))
                                    .sort((word1, word2) => word2.sudden - word1.sudden);
                                const topWord = sortedWordsInYear[0];

                                return [dataPerStateAndYear.date, [topWord.topic, topWord.text]];
                            }))
                        ]
                    ));
                    states_and_most_important_word_per_year = topWords;
                    min_year = Math.min(...Object.keys(...Object.values(states_and_most_important_word_per_year)));
                    max_year = Math.max(...Object.keys(...Object.values(states_and_most_important_word_per_year)));
                    // TODO whyyy
                    slider.min(min_year);
                    slider.max(max_year);
                    slider.value(min_year);
                    d3.select("#slider").call(slider);

                    //updateMap();

                });
                
        } else if (dataset === "NNDSS") {
    
        }

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
                y2: path.centroid(d)[1] + state_offsets[d.properties.name].yOffset - height * 0.05}
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
                y: path.centroid(d)[1] + state_offsets[d.properties.name].yOffset - height * 0.05
                } } else {
                return {
                x: path.centroid(d)[0],
                y: path.centroid(d)[1] - height * 0.05
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
        getTopWordsPerState();
    });


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

    // source: https://stackoverflow.com/a/24785497
    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.3, // ems
                x = text.attr("x"),
                y = text.attr("y"),
                dy = 0, //parseFloat(text.attr("dy")),
                tspan = text.text(null)
                    .append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text(word);
                }
            }
        });
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
                var length = state.properties.name.length;
                if (Object.keys(data_of_year_per_state).includes(state.properties.name)) {
                    return data_of_year_per_state[state.properties.name][1]; // [0] is the category of the word
                                                                             // [1] is the word itself
                } else {
                    return state.properties.name;
                }
            }).call(wrap, 20);
        g.selectAll(".state")
            .attr("fill", state => {
                if (Object.keys(data_of_year_per_state).includes(state.properties.name)) {
                    return colorscheme.find(color => color.label === data_of_year_per_state[state.properties.name][0]).color;
                } else {
                    return "#444";
                }
            });
    }

    function drawLegend() {
        const legend = d3.select("svg")
            .append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + width * 0.8 + "," + height * 0.7 + ")");

        legend.selectAll('rect')
            .data(colorscheme)
            .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', (d, i) => i * 20)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', d => d.color);

        legend.selectAll('text')
            .data(colorscheme)
            .enter()
            .append('text')
            .attr('x', 15)
            .attr('y', (d, i) => i * 20 + 10)
            .text(d => d.label);

        legend.style('font-size', '15px')
            .style('font-family', 'Arial')
            .style('fill', '#000000');
    }

    function startAnimation() {
        if (d3.select("rect[title='start_animation_button']").attr("played_button") === "true") return;
        d3.select("rect[title='start_animation_button']").attr("played_button", "true");
        var i = min_year;
        var interval = setInterval(function() {
            updateMap(i);
            slider.value(i);
            i++;
            if (i > max_year) {
                clearInterval(interval);
                d3.select("rect[title='start_animation_button']").attr("played_button", "false");
            }
        }, 200);
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



    d3.select("svg").append("g").attr("id", "slider")
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