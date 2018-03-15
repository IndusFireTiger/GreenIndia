function clearGraph() {
    let svg = d3.selectAll('svg')
    let gs = svg.selectAll('g').selectAll('g')
    let bars = svg.selectAll("rect.bar")

    gs.data([]).exit().remove()
    bars.data([]).exit().remove()
}
let plotStateGraph = function (state) {
    console.log(state)
    d3.json("States_wise_data.json", function (error, stateData) {
        if (error) {
            throw error
        }
        console.log(state + " to find")
        clearGraph()
        // document.getElementById('svg-graph').style.display ='none'
        let currState;
        for (let i = 0; i < stateData.data.length; i++) {
            console.log(stateData.data[i][0])
            if (stateData.data[i][0] === state) {
                console.log("found")
                console.log("Data: " + stateData.data[i])
                currState = stateData.data[i]
                break
            }
        }
        // draw a pie chart
        let data = []
        let count = 0
        for (let i = 2; i < 5; i++) {
            let obj = {}
            obj.label = stateData.fields[i].label
            obj.value = currState[i].replace(',', '')
            console.log("obj: " + obj.label + " " + currState[i] + " " + currState[i].replace(',', ''))
            data[count] = obj
            count++
        }
        console.log("state data" + data[0])

        console.log("Labels:" + stateData.fields[0].label)
        let svg = d3.select("svg#svg-graph"),
            margin = 200,
            width = svg.attr("width") - margin,
            height = svg.attr("height") - margin
        let xScale = d3.scaleBand().padding(0.5),
            yScale = d3.scaleLinear()
        let g = svg.append("g")
            .attr("transform", "translate(100, 100)")

        xScale.range([0, width]).domain(data.map(function (d) {
            console.log('d:' + d.label)
            return d.label
        }))

        yScale.range([height, 0]).domain([0, (d3.max(data, function (d) {
            return parseInt(d.value)
        }))])

        let xAxis_g = g.append("g")
            .attr("transform", "translate(0," + height + ")")
        xAxis_g.call(d3.axisBottom(xScale))
        xAxis_g.append("text")
            .attr("y", height - 250)
            .attr("x", width - 100)
            .attr("dx", "5em")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .style("font-size","16px")
            .text("Forest Type")

        let yAxis_g = g.append("g")
        yAxis_g.call(d3.axisLeft(yScale).ticks(5))
        yAxis_g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-4em")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .style("font-size","16px")
            .text("Geographical Area")

        let bars = g.selectAll(".bar")

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
    })
}

function plotOverviewGraph() {
    let svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin
    let xScale = d3.scaleBand().padding(0.5),
        yScale = d3.scaleLinear()
    let g = svg.append("g")
        .attr("transform", "translate(100, 100)")

    d3.csv("Total Tree Cover in India.csv", function (error, data) {
        if (error) {
            throw error
        }

        xScale.range([0, width]).domain(data.map(function (d) {
            return d.year
        }))

        yScale.range([height, 0]).domain([0, 1 + parseInt(d3.max(data, function (d) {
            return d.share_TreeCover
        }))])

        let xAxis_g = g.append("g")
            .attr("transform", "translate(0," + height + ")")
        xAxis_g.call(d3.axisBottom(xScale))
        xAxis_g.append("text")
            .attr("y", height - 250)
            .attr("x", width - 100)
            .attr("dx", "5em")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .style("font-size","16px")
            .text("Year")

        let yAxis_g = g.append("g")
        yAxis_g.call(d3.axisLeft(yScale).ticks(5))
        yAxis_g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-4em")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .style("font-size","16px")
            .text("Forest Cover in %")

        let bars = g.selectAll(".bar")

        bars.data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .on("mouseover", onMouseOver)
            .on("mouseout", onMouseOut)
            .attr("x", function (d) {
                return xScale(d.year)
            })
            .attr("y", function (d) {
                return yScale(d.share_TreeCover)
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) {
                return height - yScale(d.share_TreeCover)
            })
    })

    function onMouseOver(d, i) {
        d3.select(this).attr('class', 'highlight_bar')
        d3.select(this)
            .transition()
            .duration(400)
            .attr('width', xScale.bandwidth() + 5)
            .attr("y", function (d) {
                return yScale(d.share_TreeCover) - 10
            })
            .attr("height", function (d) {
                return height - yScale(d.share_TreeCover) + 10
            })

        g.append("text")
            .attr('class', 'val')
            .attr('x', function () {
                return xScale(d.year)
            })
            .attr('y', function () {
                return yScale(d.share_TreeCover) - 15
            })
            .text(function () {
                return [d.share_TreeCover + " %"]
            })
    }

    function onMouseOut(d, i) {
        d3.select(this).attr('class', 'bar')
        d3.select(this)
            .transition()
            .duration(400)
            .attr('width', xScale.bandwidth())
            .attr("y", function (d) {
                return yScale(d.share_TreeCover)
            })
            .attr("height", function (d) {
                return height - yScale(d.share_TreeCover)
            })

        d3.selectAll('.val')
            .remove()
    }
}

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
    // for (i = 0 i < tabcontent.length; i++) {
    //     tabcontent[i].style.display = "none"
    // }
    // tablinks = document.getElementsByClassName("tabLinks")
    // for (i = 0; i < tablinks.length; i++) {
    //     tablinks[i].className = tablinks[i].className.replace(" active", "")
    // }
    // document.getElementById(where).style.display = "block"
    // evt.currentTarget.className += " active"
}