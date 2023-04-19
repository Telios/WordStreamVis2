function init_svg() {
    var width = 1400;
    var height = 800;
    var svg = d3.selectAll("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
}