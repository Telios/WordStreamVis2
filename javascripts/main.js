// var fileList = ["WikiNews","Huffington","CrooksAndLiars","EmptyWheel","Esquire","FactCheck"
//                 ,"VIS_papers","IMDB","PopCha","Cards_PC","Cards_Fries"]
var svg = d3.select("body").append('svg')
    .attr({
        id: "mainsvg"
    });

var selectedDatasets = ["Esquire", "EmptyWheel"];

var fileList = ["WikiNews", "Huffington", "CrooksAndLiars", "EmptyWheel", "Esquire", "FactCheck",
    "VIS_papers", "IMDB", "PopCha", "Cards_PC", "Cards_Fries", "QuantumComputing",
    "Basketball", "UCD", "NNDSS"]
var datasetsWithStates = ["Basketball", "UCD", "NNDSS"];

var initialDataset = getInitialDataset();
var categories = ["person", "location", "organization", "miscellaneous"];

var fileName;

//var opacity, layerPath, maxFreq;
var opacity, maxFreq;


var axisGroup = svg.append('g').attr("id", "axisGroup");
var xGridlinesGroup = svg.append('g').attr("id", "xGridlinesGroup");
var mainGroup = svg.append('g').attr("id", "main");
var legendGroup = svg.append('g').attr("id", "legend");



addDatasetsOptions();

function getInitialDataset() {
    let datasetCookie = readSelectedDatasetCookie();
    return datasetCookie ? datasetCookie : "EmptyWheel";
}

function addDatasetsOptions() {
    var select = document.getElementById("datasetsSelect");
    for (var i = 0; i < fileList.length; i++) {
        var opt = fileList[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        el["data-image"] = "images2/datasetThumnails/" + fileList[i] + ".png";
        select.appendChild(el);
    }
    document.getElementById('datasetsSelect').value = initialDataset;  //************************************************
    fileName = document.getElementById("datasetsSelect").value;
    
    loadData();
}

var spinner;

function loadData() {

    // START: loader spinner settings ****************************
    var opts = {
        lines: 25, // The number of lines to draw
        length: 15, // The length of each line
        width: 5, // The line thickness
        radius: 25, // The radius of the inner circle
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 2, // Rounds per second
        trail: 50, // Afterglow percentage
        className: 'spinner', // The CSS class to assign to the spinner
    };
    var target = document.getElementById('loadingSpinner');
    spinner = new Spinner(opts).spin(target);
    // END: loader spinner settings ****************************

    document.cookie = "selected_dataset=" + fileName;
    if (datasetsWithStates.includes(fileName)) {
        let selectedCountries = readSelectedStateCookie();

        if (selectedCountries.length === 0) {
            selectedCountries.push("_overall");
        }

        if (fileName === "Basketball") {
            //console.log("selected basketball dataset, brace yourselves");
            loadBasketballDataset(draw, initTop, selectedCountries);
        } else if (fileName === "UCD") {
            //console.log("selected UCD dataset, brace yourselves");
            loadUnderlyingCausesOfDeathDataset(draw, initTop, selectedCountries);
        } else if (fileName === "NNDSS") {
            //console.log("selected NNDSS dataset, brace yourselves");
            loadDiseasesDataset(draw, initTop, selectedCountries);
        }
        return;
    }

    fileName = "data/" + fileName + ".tsv"; // Add data folder path
    if (fileName.indexOf("Cards_Fries") >= 0) {
        categories = ["increases_activity", "decreases_activity"];
        loadAuthorData(draw, initTop);
    }
    else if (fileName.indexOf("Cards_PC") >= 0) {
        categories = ["adds_modification", "removes_modification", "increases", "decreases", "binds", "translocation"];
        loadAuthorData(draw, initTop);
    }
    else if (fileName.indexOf("PopCha") >= 0) {
        categories = ["Comedy", "Drama", "Action", "Fantasy", "Horror"];
        loadAuthorData(draw, initTop);
    }
    else if (fileName.indexOf("IMDB") >= 0) {
        categories = ["Comedy", "Drama", "Action", "Family"];
        loadAuthorData(draw, initTop);
    }
    else if (fileName.indexOf("VIS") >= 0) {
        categories = ["Vis", "VAST", "InfoVis", "SciVis"];
        loadAuthorData(draw, initTop);
    }
    else if (fileName.indexOf("QuantumComputing") >= 0) {
        fileName = "data/" + fileName + ".tsv"; // Add data folder path
        categories = ["Unknown citation", "Have citation", "Affiliations", "Author"];
        initTop = 15;
        loadQuantumComputing(draw, initTop);
    }
    else if (fileName.indexOf("Huffington") >= 0) {
        categories = ["person", "location", "organization", "miscellaneous"];
        loadBlogPostData(draw, initTop);
        document.getElementById("rel").checked = true;
    }
    else {
        categories = ["person", "location", "organization", "miscellaneous"];
        loadBlogPostData(draw, initTop);
    }
}

function loadNewData(event) {
    legendGroup.selectAll("*").remove();
    axisGroup.selectAll("*").remove();
    xGridlinesGroup.selectAll("*").remove();
    mainGroup.selectAll("*").remove();

    fileName = this.options[this.selectedIndex].text;
    document.getElementById("rel").checked = false;
    loadData();
}



class WordStream {

    container = null;
    maxFreq = null;
    wordStreamG = null;
    font = null;
    area = null;
    interpolation = "cardinal";
    wordStream = null;

    constructor(container, font) {
        this.container = container;
        this.wordStreamG = this.container.append('g');
        this.font = font;
    }

    draw(data, width, height) {
        // wordstream has side effects on the passed data (e.g. adds word positions and sizes)
        let clonedDataObject = structuredClone(data);
        this.wordStream = d3.layout.wordStream()
            .size([width, height])
            .fontScale(d3.scale.linear())
            .minFontSize(globalMinFont)
            .maxFontSize(globalMaxFont)
            .data(clonedDataObject)
            .flag(globalFlag);

        this.drawSingleWordStream(this.wordStream)
    }

    drawSingleWordStream(ws) {

        let boxes = ws.boxes();
        let minSud = ws.minSud();
        let maxSud = ws.maxSud();
        this.maxFreq = ws.maxFreq(); //TODO per (single!) stream
    
        this.area = d3.svg.area()
            .interpolate(this.interpolation)
            .x(d => d.x)
            .y0(d => d.y0)
            .y1(d => d.y0 + d.y);
    
        //Main group
        //mainGroup.attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');
        //var wordStreamG = mainGroup.append('g').attr("id", "wordStreamG");
    
    // =============== Get BOUNDARY and LAYERPATH ===============
        const lineCardinal = d3.svg.line()
            .x(d => d.x)
            .y(d => d.y)
            .interpolate("cardinal");
    
        let boundary = [];
        for (let i = 0; i < boxes.layers[0].length; i++) {
            let tempPoint = Object.assign({}, boxes.layers[0][i]);
            tempPoint.y = tempPoint.y0;
            boundary.push(tempPoint);
        }
    
        for (let i = boxes.layers[boxes.layers.length - 1].length - 1; i >= 0; i--) {
            let tempPoint2 = Object.assign({}, boxes.layers[boxes.layers.length - 1][i]);
            tempPoint2.y = tempPoint2.y + tempPoint2.y0;
            boundary.push(tempPoint2);
        }       // Add next (8) elements
    
        let lenb = boundary.length;
    
        // Get the string for path
    
        let combined = lineCardinal(boundary.slice(0, lenb / 2))
            + "L"
            + lineCardinal(boundary.slice(lenb / 2, lenb))
                .substring(1, lineCardinal(boundary.slice(lenb / 2, lenb)).length)
            + "Z";
        // ============= Get LAYER PATH ==============
    
        let layerPath = this.container.append("path")
            .attr("d", combined)
            .attr("visibility", "hidden")
            .attr("class", "layerpath")
            .attr({
                'fill-opacity': 1,
                'stroke-opacity': 0,
            });
        // draw curves
        var topics = boxes.topics;

    
        var curve = this.container.selectAll('.curve').data(boxes.layers);
    
        curve.exit().remove();

        //TODO change here if we want background and stroke

        curve.enter()
            .append('path')
            .attr('d', this.area)
            .style('fill', (d, i) => color(i))
            .attr({
                "class": "curve",
                stroke: 'black',
                topic: (d, i) => topics[i],
                ...getCurrentFillAndStrokeStyle()
            });
    
        curve.attr("d", this.area)
            .style('fill', (d, i) => color(i))
            .attr({
                'fill-opacity': 0,
                stroke: 'black',
                'stroke-width': 0,
                topic: (d, i) => topics[i],
                ...getCurrentFillAndStrokeStyle()
            });
    
    
        var allWords = [];
        d3.map(boxes.data, function (row) {
            boxes.topics.forEach(topic => {
                allWords = allWords.concat(row.words[topic]);
            });
        });
    
        allW = JSON.parse(JSON.stringify(allWords));
    
        opacity = d3.scale.log()
            .domain([minSud, maxSud])
            .range([0.4, 1]);
    
        var lineScale;
        if (fileName.indexOf("Huffington") >= 0) {
            d3.json("data/linksHuff2012.json", function (error, rawLinks) {
                const threshold = 5;
                const links = rawLinks.filter(d => d.weight > threshold);
                var isRel = document.getElementById("rel").checked;
    
                links.forEach(d => {
                    d.sourceID = d.sourceID.split(".").join("_").split(" ").join("_");
                    d.targetID = d.targetID.split(".").join("_").split(" ").join("_");
                });
                let visibleLinks = [];
    
                // select only links with: word place = true and have same id
                links.forEach(d => {
                    let s = allWords.find(w => (w.id === d.sourceID) && (w.placed === true));
                    let t = allWords.find(w => (w.id === d.targetID) && (w.placed === true));
                    if ((s !== undefined) && (t !== undefined)) {
                        visibleLinks.push({
                            sourceX: s.x,
                            sourceY: s.y,
                            targetX: t.x,
                            targetY: t.y,
                            weight: d.weight,
                            sourceID: d.sourceID,
                            targetID: d.targetID,
                            id: d.sourceID + "_" + d.targetID
                        });
                    }
                });
    
                lineScale = d3.scale.linear()
                    .domain(d3.extent(visibleLinks, d => d.weight))
                    .range([0.5, 3]);
    
                opacScale = d3.scale.linear()
                    .domain(d3.extent(visibleLinks, d => d.weight))
                    .range([0.5, 1]);
    
                var connection = this.container.selectAll(".connection").data(visibleLinks, d => d.id);
                connection.exit().remove();
    
                connection.enter()
                    .append("line")
                    .attr("class", "connection");
    
                connection.transition()
                    .duration(800)
                    .attr("opacity", isRel ? 1 : 0)
                    .attr({
                        "x1": d => d.sourceX,
                        "y1": d => d.sourceY,
                        "x2": d => d.targetX,
                        "y2": d => d.targetY,
                        "stroke": "#444444",
                        "stroke-opacity": d => opacScale(d.weight),
                        "stroke-width": d => lineScale(d.weight)
                    });
                this.drawWords(allWords, topics);
            });
        } else this.drawWords(allWords, topics);
        
    }

    drawWords(allWords, topics) {
        var prevColor;

        var texts = this.container.selectAll('.word').data(allWords, d => d.id); //sets __data__ property

        texts.exit().remove();

        var textEnter = texts.enter().append('g')
            .attr("transform", (d) => 'translate(' + d.x + ', ' + d.y + ')rotate(' + d.rotate + ')')
            .attr("class", "word")
            .append('text');

        textEnter
            .text((d) => d.text)
            .attr({
                "id": d => d.id,
                "class": "textData",
                'font-family': this.font,//TODO
                'font-size': (d) => d.fontSize,
                "fill": (d) => color(topics.indexOf(d.topic)),
                "fill-opacity": (d) => opacity(d.sudden),
                'text-anchor': 'middle',
                'alignment-baseline': 'middle',
                topic: (d) => d.topic,
                visibility: (d) => d.placed ? "visible" : "hidden",
            });

        texts.transition().duration(800)
            .attr("transform", (d) => 'translate(' + d.x + ', ' + d.y + ') rotate(' + d.rotate + ')')
            .select("text")
            .attr({
                "font-size": (d) => d.fontSize,
                visibility: (d) => d.placed ? "visible" : "hidden"
            });

        // texts.style("text-decoration", "underline");

        this.container.selectAll(".connection").on("mouseover", function () {
            var thisLink = d3.select(this);
            thisLink.style('cursor', 'crosshair');
            // in order to select by byid, the id must not have space
            var sourceText = this.container.select("#" + thisLink[0][0].__data__.sourceID);
            var prevSourceColor = sourceText.attr("fill");
            var targetText = this.container.select("#" + thisLink[0][0].__data__.targetID);
            var prevTargetColor = targetText.attr("fill");

            thisLink.attr("stroke-width", 4);

            sourceText.attr({
                stroke: prevSourceColor,
                fill: prevSourceColor,
                'stroke-width': 1.5
            });

            targetText.attr({
                stroke: prevTargetColor,
                fill: prevTargetColor,
                'stroke-width': 1.5
            });
        });

        this.container.selectAll(".connection").on("mouseout", function () {
            var thisLink = d3.select(this);
            thisLink.style('cursor', 'crosshair');
            var sourceText = this.container.select("#" + thisLink[0][0].__data__.sourceID);
            var targetText = this.container.select("#" + thisLink[0][0].__data__.targetID);

            thisLink.attr("stroke-width", lineScale(thisLink[0][0].__data__.weight));

            sourceText.attr({
                stroke: 'none',
                'stroke-width': 0
            });

            targetText.attr({
                stroke: 'none',
                'stroke-width': 0
            });
        });

        //Highlight
        this.container.selectAll('.textData').on('mouseenter', () => {
            var thisText = d3.select(d3.event.target); //d3 4.13 does not get passed the event, d3.event has to be used
            thisText.style('cursor', 'pointer');
            prevColor = thisText.attr('fill');
            var text = thisText.text();
            var topic = thisText.attr('topic');
            var allTexts = this.container.selectAll('.textData').filter(t => {
                return t && t.text === text && t.topic === topic;
            });
            allTexts.attr({
                stroke: prevColor,
                'stroke-width': 1
            });
        });
        this.container.selectAll('.textData').on('mouseout', () => {
            var thisText = d3.select(d3.event.target); //d3 4.13 does not get passed the event, d3.event has to be used
            thisText.style('cursor', 'default');
            var text = thisText.text();
            var topic = thisText.attr('topic');
            var allTexts = this.container.selectAll('.textData').filter(t => {
                return t && !t.cloned && t.text === text && t.topic === topic;
            });
            allTexts.attr({
                stroke: 'none',
                'stroke-width': '0'
            });
        });
        //Click
        this.container.selectAll('.textData').on('click', () => {
            var thisText = d3.select(d3.event.target); //d3 4.13 does not get passed the event, d3.event has to be used
            var text = thisText.text();
            var topic = thisText.attr('topic');
            var allTexts = this.container.selectAll('.textData').filter(t => {
                return t && t.text === text && t.topic === topic;
            });
            //Select the data for the stream layers
            var streamLayer = this.container.selectAll("path[topic='" + topic + "']")[0][0].__data__; //TODO
            //Initialize points
            var points = streamLayer.map((elem) => { return {x: elem.x, y0: elem.y0 + elem.y, y: 0}});

            allTexts[0].forEach(t => {
                var data = t.__data__;
                var fontSize = data.fontSize;
                //The point
                var thePoint = points[data.timeStep + 1];
                ;//+1 since we added 1 to the first point and 1 to the last point.
                thePoint.y = -data.streamHeight;
                //Set it to visible.
                //Clone the nodes.
                var clonedNode = t.cloneNode(true);
                d3.select(clonedNode).attr({
                    visibility: "visible",
                    stroke: 'black',
                    'stroke-size': 0,
                });
                var clonedParentNode = t.parentNode.cloneNode(false);
                clonedParentNode.appendChild(clonedNode);

                t.parentNode.parentNode.appendChild(clonedParentNode);
                d3.select(clonedParentNode).attr({
                    cloned: true,
                    topic: topic
                }).transition().duration(300).attr({
                    transform: (d, i) => 'translate(' + thePoint.x + ',' + (thePoint.y0 + thePoint.y - fontSize / 2) + ')',
                });
            });
            //Add the first and the last points
            points[0].y = points[1].y;//First point
            points[points.length - 1].y = points[points.length - 2].y;//Last point
            //Append stream
            this.wordStreamG.append('path')
                .datum(points)
                .attr('d', this.area)
                .style('fill', prevColor)
                .attr({
                    'fill-opacity': prevColor,
                    stroke: 'black',
                    'stroke-width': 0.3,
                    topic: topic,
                    wordStream: true
                });
            //Hide all other texts
            var allOtherTexts = this.container.selectAll('.textData').filter(t => {
                return t && !t.cloned && t.topic === topic;
            });
            allOtherTexts.attr('visibility', 'hidden');
        });
        topics.forEach(topic => {
            //d3.select("path[topic='" + topic + "']").on('click', function () {
            this.container.selectAll("path[topic='" + topic + "']").on('click', () => {
                this.container.selectAll('.textData')
                    .filter(t => t && !t.cloned && t.placed && t.topic === topic)
                    .attr("visibility", 'visible');
                //Remove the cloned element
                this.container.selectAll("g[cloned='true'][topic='" + topic + "']").remove()
                //Remove the added path for it
                this.container.selectAll("path[wordStream='true'][topic='" + topic + "']").remove()
            });

        });
    }

}


class MultiWordStream {

    //Layout data
    font = "Arial";
    interpolation = "cardinal";
    axisPadding = 10;
    legendFontSize = 12;
    legendOffset = 10;
    legendHeight = categories.length * this.legendFontSize;
    margins = {left: 10, top: 20, right: 10, bottom: 30};
    yAxisLabelWidth = 30;
    wordStreamSpacing = 10;

    wordStreams = null;

    drawLegend(topics, xPos, yPos) {
        //Build the legends
        legendGroup.attr('transform', 'translate(' + xPos + ',' + yPos + ')'); //TODO
        var legendNodes = legendGroup.selectAll('g').data(topics).enter().append('g')
            .attr('transform', (d, i) => 'translate(' + (this.margins.left + this.yAxisLabelWidth) + ',' + (i * this.legendFontSize) + ')');
        legendNodes.append('circle')
            .attr({
                r: 5,
                fill: (d, i) => color(i),
                'fill-opacity': 1,
                stroke: 'black',
                'stroke-width': .5,
            });
        legendNodes.append('text')
            .text((d) => d)
            .attr({
            'font-size': this.legendFontSize,
            'alignment-baseline': 'middle',
            dx: 8
        });
    }

    drawGridAndAxis(dates, width, height) {
        var xAxisScale = d3.scale.ordinal().domain(dates).rangeBands([0, width]);
        var xAxis = d3.svg.axis().orient('bottom').scale(xAxisScale);
    
        axisGroup.attr('transform', 'translate(' + (this.margins.left + this.yAxisLabelWidth) + ',' + (height + this.margins.top + this.axisPadding + this.legendHeight) + ')');
        var axisNodes = axisGroup.call(xAxis);
        MultiWordStream.styleAxis(axisNodes);
    
        //Display the vertical gridline
        var xGridlineScale = d3.scale.ordinal().domain(d3.range(0, dates.length + 1)).rangeBands([0, width + width / dates.length]);
        var xGridlinesAxis = d3.svg.axis().orient('bottom').scale(xGridlineScale);
    
        xGridlinesGroup.attr('transform', 'translate(' + (this.margins.left + this.yAxisLabelWidth - width / dates.length / 2) + ',' + (height + this.margins.top + this.axisPadding + this.legendHeight + this.margins.bottom) + ')');
        var gridlineNodes = xGridlinesGroup.call(xGridlinesAxis.tickSize(-height - this.axisPadding - this.legendHeight - this.margins.bottom, 0, 0).tickFormat(''));
        MultiWordStream.styleGridlineNodes(gridlineNodes);
    }

    static styleAxis(axisNodes) {
        axisNodes.selectAll('.domain').attr({
            fill: 'none'
        });
        axisNodes.selectAll('.tick line').attr({
            fill: 'none',
        });
        axisNodes.selectAll('.tick text').attr({
            'font-family': 'serif',
            'font-size': 15
        });
    }
    
    static styleGridlineNodes(gridlineNodes) {
        gridlineNodes.selectAll('.domain').attr({
            fill: 'none',
            stroke: 'none'
        });
        gridlineNodes.selectAll('.tick line').attr({
            fill: 'none',
            'stroke-width': 0.7,
            stroke: 'lightgray'
        });
    }

    drawVerticalAxisLabels(groupLabels, singleWordStreamHeight) {
        const yAxisLabelGroupId = "yAxisLabelGroup";
        d3.select("#" + yAxisLabelGroupId).remove();

        let yLabelGroup = d3.select("#mainsvg")
            .append("g")
            .attr({
                id: yAxisLabelGroupId,
                transform: "translate(" + this.margins.left + ", " + this.margins.top + ")"
            });
        
        let textSelection = yLabelGroup.selectAll("text")
            .data(groupLabels);

        // TODO looks good? could also do only stroke on the right side
        textSelection.enter()
            .append("rect")
            .attr({
                fill: "lavender",
                x: 0,
                y: (_, index) => index * (singleWordStreamHeight + this.wordStreamSpacing),
                width: this.yAxisLabelWidth,
                height: singleWordStreamHeight,
            });

        const fontSize = 15;
        textSelection.enter().append("text")
            .text(d => d)
            .attr({
                "text-anchor": "middle",
                fill: "black",
                font: "bold " + fontSize + "px",
                transform:
                    (_, index) => "translate(" + (this.yAxisLabelWidth / 2 + fontSize / 2) + ", "
                        + (index * (singleWordStreamHeight + this.wordStreamSpacing) + singleWordStreamHeight / 2) + ")"
                        + " rotate (-90)"
            });

        textSelection.exit()
            .remove();
    }

    // uses public variables:
    //  categories (for calculating legend height)
    //  globalWidth, globalHeight for calculating width/height of wordstream
    //  globalMinFont, globalMaxFont, globalFlag
    draw(dataByGroup) {
        
        let groups = Object.keys(dataByGroup);

        var width = globalWidth - (this.margins.left + this.margins.right + this.yAxisLabelWidth); //TODO why top?
        var singleWordStreamHeight = (globalHeight - (+this.margins.top + this.margins.bottom + this.axisPadding + this.legendHeight + this.wordStreamSpacing * (groups.length - 1))) / groups.length;

        // d3 version used does not have functionality for update: no merge, no join
        // - need duplicate code for update/enter
        // TODO consider updating d3 to a newer version
        let wordStreamContainers = d3.select("g#main")
            .selectAll("g.word-stream-class")
            .data(groups)
            .attr("id", (groupLabel, index) => "word-stream-" + groupLabel.replace(" ", ""))
            .attr("transform", (_, index) => "translate("
                + (this.margins.left + this.yAxisLabelWidth) + ","
                + (this.margins.top + index * (singleWordStreamHeight + this.wordStreamSpacing))
                + ")");

        wordStreamContainers.exit()
            .remove();

        wordStreamContainers.enter()
            .append("g")
            .attr("class", "word-stream-class")
            .attr("id", (groupLabel, index) => "word-stream-" + groupLabel.replace(" ", ""))
            .attr("transform", (_, index) => "translate("
                + (this.margins.left + this.yAxisLabelWidth) + ","
                + (this.margins.top + index * (singleWordStreamHeight + this.wordStreamSpacing))
                + ")");

        this.wordStreams = groups.map((groupLabel) => {
            let wordStreamContainer = d3.select("#word-stream-" + groupLabel.replace(" ", ""));
            let wordStream = new WordStream(wordStreamContainer, this.font);
            wordStream.draw(dataByGroup[groupLabel], width, singleWordStreamHeight);
            return wordStream;
        });
        
        let dates = dataByGroup[groups[0]].map(row => row.date); //for x axis
        let topics = Object.keys(dataByGroup[groups[0]][0].words); //for legend

        let gridHeight = globalHeight - (this.margins.top + this.margins.bottom + this.axisPadding + this.legendHeight); //for vertical lines
        let legendY = globalHeight - (this.margins.top + this.legendHeight + this.legendOffset);

        this.drawGridAndAxis(dates, width, gridHeight);
        this.drawLegend(topics, this.margins.left, legendY);

        this.drawVerticalAxisLabels(groups, singleWordStreamHeight);

        spinner.stop();
    }
}

function draw(data, multiple = false) {

    let dataByGroup = {};

    if (multiple) {
        console.log("drawing multiple WordStreams");
        // data is an object with labels as keys, values are lists of word-lists
        // e.g. {"Georgia": data1, "Alabama": data2, "Virginia": data2};
        dataByGroup = data;
    } else {
        console.log("drawing single WordStream");
        // data is list of word-lists
        dataByGroup["_overall"] = data;
    }

    //set svg data.
    svg
        .transition()
        .duration(300)
        .attr({
            width: globalWidth,
            height: globalHeight,
        });

    let multiWordStream = new MultiWordStream();
    multiWordStream.draw(dataByGroup);

    spinner.stop();

}