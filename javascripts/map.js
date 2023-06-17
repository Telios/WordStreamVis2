function init_svg() {
    var width = 1200;
    var svg_width = width;
    var height = 800;
    var svg = d3.select("body")
        .append("div")
        .attr("class", "map")
        .style("text-align", "center")
        .style("display", "flex")
        .style("justify-content", "center")
        .append("svg")
        .attr("width", width)
        .attr("style", "background-color:#a8a8a8")
        .attr("height", height)
        .style("flex-shrink", 0);
    var path = d3.geoPath();


    var g = svg.append("g");
    var d3_colors = ['#3968b6', '#af8537', '#1c7e1c', '#c44041', '#9467bd'];
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
        "Vermont": {xOffset: -width * 0.0, yOffset: -height * 0.14},
        "New Hampshire": {xOffset: width * 0.09, yOffset: -height * 0.05},
        "Massachusetts": {xOffset: width * 0.08, yOffset: -height * 0.03},
        "Rhode Island": {xOffset: width * 0.07, yOffset: height * 0.02},
        "Connecticut": {xOffset: width * 0.085, yOffset: height * 0.07},
        "New Jersey": {xOffset: width * 0.1, yOffset: height * 0.07},
        "Delaware": {xOffset: width * 0.1, yOffset: height * 0.09},
        "Maryland": {xOffset: width * 0.115, yOffset: height * 0.14},
        "District of Columbia": {xOffset: width * 0.12, yOffset: height * 0.2},
        "Hawaii": {xOffset: width * 0.01, yOffset: height * 0.08},
    }


    var states_and_most_important_word_per_year = {};

    function getTopWordsPerState() {
        let datasetName = readSelectedDatasetCookie();
        if (!datasetName) {
            // TODO dataset cookie missing, cannot show any words - what to do?
            throw new Error("dataset cookie missing - no dataset selected, cannot show words");
        }
        
        function getTopWordsObject(rawData, datasetGen, stateAccessor) {
            const states = getUniqueValues(rawData.map(stateAccessor));
            const datasetsPerState = loadDatasetsForStates(rawData, states, datasetGen, stateAccessor);
            return Object.fromEntries(Object.entries(datasetsPerState)
                .map(stateEntry => [
                    stateEntry[0],
                    Object.fromEntries(
                        Object.entries(stateEntry[1].getTopWordPerTimestep(compareSuddenAttentionMeasure))
                            .map(timestepEntry => [timestepEntry[0],
                                [timestepEntry[1].topic, timestepEntry[1].text]])
                    )
                ]));
        }

        function handleDataArrived(rawData) {
            const datasetGen = getDatasetGenerator(datasetName);
            let stateAccessor = getStateAccessor(datasetName);
            const topWords = getTopWordsObject(rawData, datasetGen, stateAccessor);

            const categories = getUniqueValues(rawData.map(datasetGen.categoryAccessor));

            colorscheme = categories.map((entry, i) => {return {label: entry, color: d3_colors[i]}});
            drawLegend();

            states_and_most_important_word_per_year = topWords;
            min_year = Math.min(...Object.keys(...Object.values(states_and_most_important_word_per_year)));
            max_year = Math.max(...Object.keys(...Object.values(states_and_most_important_word_per_year)));
            // TODO whyyy
            slider.min(min_year);
            slider.max(max_year);
            slider.value(min_year);
            d3.select("#slider").call(slider);

            //updateMap();
        }

        if (datasetName === "Basketball") {
            d3.json("data/basketball.json").then(data => handleDataArrived(data["per_state_counts"]));
        } else if (datasetName === "UCD") {
            d3.tsv("data/UCD_1999_2020.txt").then(data => handleDataArrived(data));
        } else if (datasetName === "NNDSS") {
            d3.tsv("data/nndss_2016_2020_clean.txt").then(data => handleDataArrived(data));
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
            .filter(function(d) { return Object.keys(state_offsets).includes(d.properties.name);})
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attrs(function(d) {
                return {
                x1: path.centroid(d)[0],
                y1: path.centroid(d)[1],
                x2: path.centroid(d)[0] + state_offsets[d.properties.name].xOffset - width * 0.005,
                y2: path.centroid(d)[1] + state_offsets[d.properties.name].yOffset}
                }
            );

        g.append("g")
            .selectAll("text")
            .data(topojson.feature(us, us.objects.states).features)
            .join("text")
            .attrs(function(d) {
                if (Object.keys(state_offsets).includes(d.properties.name)) {
                return {
                x: path.centroid(d)[0] + state_offsets[d.properties.name].xOffset,
                y: path.centroid(d)[1] + state_offsets[d.properties.name].yOffset
                } } else {
                return {
                x: path.centroid(d)[0],
                y: path.centroid(d)[1]
                }}
            })
            .attr("dy", ".2em")
            .attr("text-anchor", function(d) {
                return Object.keys(state_offsets).includes(d.properties.name) ? "left": "middle";
            })
            .attr("fill", "#ffffff")
            .attr("pointer-events", "none")
            .text(d => d.properties.name)
            .style("font-size", function(d) {
                let scale = Math.sqrt(path.area(d)) / 5;
                let width = path.bounds(d)[1][0] - path.bounds(d)[0][0];
                if (Object.keys(state_offsets).includes(d.properties.name)) {
                    return 15 + "px";
                }
                return scale + "px";
            })


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

    // source: https://stackoverflow.com/a/24785497 with minor modifications
    function wrap(text) {
        text.each(function () {
            var state = d3.select(this).data()[0];
            var width = (path.bounds(state)[1][0] - path.bounds(state)[0][0]) * 0.9;

            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                first_word = true,
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.3, // ems
                x = text.attr("x"),
                y = text.attr("y"),
                font_size = text.style("font-size").substring(0, text.style("font-size").length - 2);
                dy = 0; //parseFloat(text.attr("dy")),
                tspan = text.text(null)
                    .append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", dy + "em");
            if (Object.keys(state_offsets).includes(state.properties.name)) {
                width = svg_width - text.attr("x");
            }
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width && !first_word) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text(word);
                }
                first_word = false;
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
            }).call(wrap);
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
            .style('fill', '#ffffff');
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