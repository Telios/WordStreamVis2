function showRelationship() {
    var isRel = document.getElementById("rel").checked;
    console.log(isRel);
    if (isRel) {
        d3.selectAll(".connection").transition().duration(200).attr("opacity", 1);
    }
    else d3.selectAll(".connection").transition().duration(200).attr("opacity", 0);
}

function updateFillAndStrokeVars() {
    globalFill = document.getElementById("fillCheckbox").checked;
    globalStroke = document.getElementById("strokeCheckbox").checked;
}

function getCurrentFillAndStrokeStyle() {
    return {
        'fill-opacity': globalFill ? 0.1 : 0,
        'stroke-width': globalStroke ? 0.1 : 0,
    };
}

function updateFillAndStrokeDom() {
    d3.selectAll('.curve').attr(getCurrentFillAndStrokeStyle());
}

function updateFillAndStrokeVarsAndStyle() {
    updateFillAndStrokeVars();
    updateFillAndStrokeDom();
}

function submitInput(draw) {
    globalWidth = parseInt(document.getElementById("widthText").innerText);
    globalHeight = parseInt(document.getElementById("heightText").innerText);
    globalMinFont = parseInt(document.getElementById("fontMin").innerText);
    globalMaxFont = parseInt(document.getElementById("fontMax").innerText);
    globalTop = parseInt(document.getElementById("topRankText").innerText);
    // document.getElementById("rel").checked = false;
    var isFlow = document.getElementById("flow").checked;
    var isAv = document.getElementById("av").checked;
    if (isFlow && isAv) {
        globalFlag = "fa";
    }
    else if (isFlow && !isAv) {
        globalFlag = "f";
    }

    else if (!isFlow && isAv) {
        globalFlag = "a";
    }

    else if (!isFlow && !isAv) {
        globalFlag = "n";
    }

    updateFillAndStrokeVars();

    // top rank
    if (datasetsWithStates.includes(fileName)) {
        //totalDataMulti is object which contains multiple objects of Dataset (keys are state names)
        updateAndDraw(draw, globalTop);
    } else {
        //totalData contains data for (single) word stream as list
        var data = JSON.parse(JSON.stringify(totalData));
        globalData = getTop(data, categories, globalTop);
        draw(globalData);
    }

    
}
