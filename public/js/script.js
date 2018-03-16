function plotIndiaMap() {
    var w = 600
    var h = 600
    var proj = d3.geo.mercator()
    var path = d3.geo.path().projection(proj)
    var t = proj.translate()
    var s = proj.scale()

    var map = d3.select("#chart").append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .call(initialize)

    var india = map.append("svg:g")
        .attr("id", "india")
    var svg = d3.select("svg")

    var tooltip = d3.select("#chart").append("div").attr("class", "tooltip hidden")
    var offsetL = document.getElementById('chart').offsetLeft + 10
    var offsetT = document.getElementById('chart').offsetTop + -30

    fetch('states.json')
        .then(function (response) {
            //to do
            console.log('fetched map.json')
            console.log(response.json())
            // response.json()
        })
        .catch(function (error) {
            console.log('could not fetch states.json')
        })
    d3.json("states.json", function (json) {
        states = json.features
        india.selectAll("path")
            .data(states)
            .enter().append("path")
            .attr("d", path)
            .attr("title", function (d, i) {
                return d.id
            })
            .on("mousemove", function (d, i) {
                d3.select(this).attr('class', 'highlight_state')
                var mouse = d3.mouse(svg.node()).map(function (d) {
                    return parseInt(d)
                })
                tooltip.classed("hidden", false)
                    .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
                    .html(d.id)
            })
            .on("mouseout", function (d, i) {
                d3.select(this).attr('class', '')
                tooltip.classed("hidden", true)
            })
            .on("click", function (d, i) {
                console.log(d.id + " was clicked")
                // invoke func to plot state graph
                plotStateGraph(d.id)
            })
    })

    function initialize() {
        proj.scale(6700)
        proj.translate([-1240, 720])
    }

}

let selectOverviewData = (data) => {
    let labels = {
        x: data.fields[0].label,
        y: data.fields[3].label
    }
    let myData = data.data
    let dataForGraph = []
    myData.forEach(ele => {
        let obj = {}
        obj.label = ele[0]
        obj.value = ele[3]
        dataForGraph.push(obj)
    })
    return [labels, dataForGraph]
}

let selectStateData = (stateData, state) => {
    let currState;
    for (let i = 0; i < stateData.data.length; i++) {
        if (stateData.data[i][0] === state) {
            currState = stateData.data[i]
            break
        }
    }
    let labels = {
        x: 'Forest Types',
        y: 'Area'
    }
    let dataForGraph = []
    for (let i = 2; i < 5; i++) {
        let obj = {}
        obj.label = stateData.fields[i].label
        obj.value = currState[i].replace(',', '')
        dataForGraph.push(obj)
    }
    return [labels, dataForGraph]
}

const graphType = {
    'overview': selectOverviewData,
    'state': selectStateData
}

function plotGraph(type, svg_element, file, state) {
    let svg = d3.select(svg_element),
        g = svg.append("g").attr("transform", "translate(100, 100)"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin,
        xScale = d3.scaleBand().padding(0.5),
        yScale = d3.scaleLinear()

    d3.json(file, function (error, data) {
        if (error) {
            throw error
        }

        let selecteData = graphType[type](data, state)
        let labels = selecteData[0],
            dataForGraph = selecteData[1]
        console.log(dataForGraph)
        initializeScale(dataForGraph, labels)
        plotBars(g, dataForGraph)
    })

    function initializeScale(data, axisLabels) {
        console.log("initializeScale")
        xScale
            .range([0, width])
            .domain(data.map(function (d) {
                return d.label
            }))

        yScale
            .range([height, 0])
            .domain([0, 1 + (d3.max(data, function (d) {
                return parseInt(d.value)
            }))])

        let xAxis_g = g.append("g").attr("transform", "translate(0," + height + ")")
        xAxis_g.call(d3.axisBottom(xScale))
        append_xAxis_label(xAxis_g, axisLabels.x)

        let yAxis_g = g.append("g")
        yAxis_g.call(d3.axisLeft(yScale).ticks(5))
        append_yAxis_label(yAxis_g, axisLabels.y)
    }

    function plotBars(grp, data) {
        let bars = grp.selectAll(".bar")
        bars.data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .on("mouseover", onMouseOver)
            .on("mouseout", onMouseOut)
            .attr("x", function (d) {
                return xScale(d.label)
            })
            .attr("y", function (d) {
                return yScale(d.value)
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) {
                return height - yScale(d.value)
            })
    }

    function append_yAxis_label(axis, label) {
        axis.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-4em")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .style("font-size", "16px")
            .text(label)
    }

    function append_xAxis_label(axis, label) {
        axis.append("text")
            .attr("y", height - 250)
            .attr("x", width - 100)
            .attr("dx", "5em")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .style("font-size", "16px")
            .text(label)
    }

    function onMouseOver(d, i) {
        d3.select(this).attr('class', 'highlight_bar')
        d3.select(this)
            .transition()
            .duration(400)
            .attr('width', xScale.bandwidth() + 5)
            .attr("y", function (d) {
                return yScale(d.value) - 10
            })
            .attr("height", function (d) {
                return height - yScale(d.value) + 10
            })

        g.append("text")
            .attr('class', 'val')
            .attr('x', function () {
                return xScale(d.label)
            })
            .attr('y', function () {
                return yScale(d.value) - 15
            })
            .text(function () {
                return [d.value]
            })
    }

    function onMouseOut(d, i) {
        d3.select(this).attr('class', 'bar')
        d3.select(this)
            .transition()
            .duration(400)
            .attr('width', xScale.bandwidth())
            .attr("y", function (d) {
                return yScale(d.value)
            })
            .attr("height", function (d) {
                return height - yScale(d.value)
            })

        d3.selectAll('.val')
            .remove()
    }
}

function plotOverviewGraph() {
    plotGraph('overview', 'svg', "India_Overview.json")
}

function clearGraph() {
    let svg = d3.selectAll('svg')
    let gs = svg.selectAll('g g')
    let bars = svg.selectAll("rect.bar")

    gs.data([]).exit().remove()
    bars.data([]).exit().remove()
}

let plotStateGraph = function (state) {
    clearGraph()
    console.log(state)
    plotGraph('state', 'svg#svg-graph', "States_wise_data.json", state)
}

function populateOverview() {
    // populateStates()
    plotOverviewGraph()
    plotIndiaMap()
}

populateOverview()

function tabAction(event, where) {
    // console.log(event + " occured on " + where)
    // console.log("url:" + document.URL)
    // var i, tabcontent, tablinks
    // tabcontent = document.getElementsByClassName("content")
    // for (i = 0; i < tabcontent.length; i++) {
    //     tabcontent[i].style.display = "none"
    // }
    // tablinks = document.getElementsByClassName("tabLinks")
    // for (i = 0; i < tablinks.length; i++) {
    //     tablinks[i].className = tablinks[i].className.replace(" active", "")
    // }
    // document.getElementById(where).style.display = "block"
    // evt.currentTarget.className += " active"
}