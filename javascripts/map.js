function init_svg() {
    var width = 1400;
    var height = 800;
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    var path = d3.geoPath();

    var g = svg.append("g");

    var selectedStates = [];

    geoJsonUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json";
    d3.json(geoJsonUrl).then(us => {
        var states = g.append("g")
            .attr("fill", "#444")
            .attr("cursor", "pointer")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .join("path")
            .attr("d", path)
            .on("mouseover", mouseover)
            .on("click", click)
            .on("mouseout", mouseout);

        states.append("title").text(d => d.properties.name);

        g.append("path")
            .attr("fill", "none")
            .attr("stroke", "#fff")
            .attr("stroke-linejoin", "round")
            .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));

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

    function click(d, i) {
        if (d3.select(this).attr("fill") === "red") {
            d3.select(this).attr("fill", "#444")
            selectedStates = selectedStates.filter(state => state !== i.properties.name);
        } else {
            if (selectedStates.length === 4) {
                alert("You can't select more than 4 states");
                return;
            }
            d3.select(this)
                .attr("fill", "red")
            selectedStates.push(i.properties.name);
        }
        console.log(selectedStates);
    }

    var slider = d3.sliderHorizontal()
        .min(1980)
        .max(2020)
        .step(1)
        .width(1000)
        .displayValue(true)
        .on('onchange', val => {
            console.log(val);
        });

    d3.select("svg").append("g")
        .attr("width", 1400)
        .attr("height", 100)
        .attr("transform", "translate(50,700)")
        .call(slider);

}