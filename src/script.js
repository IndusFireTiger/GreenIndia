let states = document.getElementById("states-list")
d3.json("States_wise_data.json", function(error, stateData){
    if (error) {
        throw error;
    }
    for(let i = 0; i < stateData.data.length; i++){
        console.log("states:"+stateData.data[i][0])
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(stateData.data[i][0]));
        states.appendChild(li)
    }
    
})

let svg = d3.select("svg"),
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;

console.log(d3)
let xScale = d3.scaleBand().range([0, width]).padding(0.5),
    yScale = d3.scaleLinear().range([height, 0]);
console.log(xScale)
let g = svg.append("g")
    .attr("transform", "translate(100, 100)");

console.log(g)

d3.csv("./Total Tree Cover in India.csv", function (error, data) {
    if (error) {
        throw error;
    }
    console.log("data:" + data)
    console.log("max:"+(0.1+d3.max(data, function (d) { return d.share_TreeCover; })))
    xScale.domain(data.map(function (d) { return d.year; }));
    // yScale.domain([0, 1+3.04]);
    yScale.domain([0, 1 + parseInt(d3.max(data, function (d) { return d.share_TreeCover; }))]);

    // console.log(d3.axisBottom(xScale)) // returns a function which is then called with child g as a parameter
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    g.append("g")
        .call(d3.axisLeft(yScale).ticks(5))
        .append("text")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("value");

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.year); })
        .attr("y", function (d) { return yScale(d.share_TreeCover); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height - yScale(d.share_TreeCover); });
});