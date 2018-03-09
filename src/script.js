function populateStates() {
    let states = document.getElementById("states-list")

    d3.json("States_wise_data.json", function (error, stateData) {
        if (error) {
            throw error
        }
        for (let i = 0; i < stateData.data.length; i++) {
            var li = document.createElement("a")
            li.setAttribute("id", i)
            li.addEventListener("click", plotStateGraph)
            li.appendChild(document.createTextNode(stateData.data[i][0]))
            states.appendChild(li)
        }
    })
}

let plotStateGraph = function (state) {
    console.log(state.target.id)
    d3.json("States_wise_data.json", function (error, stateData) {
        if (error) {
            throw error
        }
        
        console.log(stateData.data[state.target.id])
        let svg = d3.select("svg")
        console.log(svg)
    })
}

function plotOverviewGraph() {
    let svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin
    
    let g = svg.append("g")
        .attr("transform", "translate(100, 100)")

    d3.csv("Total Tree Cover in India.csv", function (error, data) {
        if (error) {
            throw error
        }

        let xScale = d3.scaleBand().padding(0.5),
            yScale = d3.scaleLinear()

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
            .style("text-anchor", "middle")
            .text("Year")
      
        let yAxis_g = g.append("g")
        yAxis_g.call(d3.axisLeft(yScale).ticks(5))
        yAxis_g.append("text")
            .style("text-anchor", "middle")
            .text("% of Forest Cover")
            
        let bars = g.selectAll(".chart")
        
        bars.data(data)
            .enter().append("rect")
            .attr("class", "chart")
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
}

function populateOverview() {
    populateStates()
    plotOverviewGraph()
}

populateOverview()