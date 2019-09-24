var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
function makeResponsive() {
    d3.csv("assets/data/data.csv").then(data => {
      data.forEach(d => {
          d.poverty = +d.poverty;
          d.age = +d.age;
          d.income = +d.income;
          d.healthcare = +d.healthcare;
          d.obesity = +d.obesity;
          d.smokes = +d.smokes;
      });

      // scales for X and Y axes
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.age)-1, d3.max(data, d => d.age)+1])
        .range([0, width]);

      var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.smokes)-1, d3.max(data, d => d.smokes)+1])
        .range([height, 0]);
        
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      chartGroup.append("g")
        .call(leftAxis);
        
      var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "9")
        .attr("fill", "lightblue")
        .attr("opacity", "1");
      
      circlesGroup.select("text")
        .data(data)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d.age))
        .attr("y", d => yLinearScale(d.smokes))
        .attr("fill", "black")
        .attr("font-size", "8")
        .attr("text-anchor", "middle")
        .text(d => d.abbr);
      
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .attr("class", "axisText")
        .text("Age (Median)");

      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smokes (%)");
    });
};

makeResponsive();