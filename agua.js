///////////////////////////////////
// AGUA //
//Agua apta
//Agua apta con no conformidad 
//Agua no apta
//////////////////////////////////

// append the svg object to the body of the page
var svg2 = d3.select("#agua")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")"); 

svg2.append("circle").attr("cx",200).attr("cy",130).attr("r", 6).style("fill", "#22BAB1")
svg2.append("circle").attr("cx",200).attr("cy",160).attr("r", 6).style("fill", "#2385B9")
svg2.append("circle").attr("cx",200).attr("cy",190).attr("r", 6).style("fill", "#CE6E30")
svg2.append("text").attr("x", 220).attr("y", 130).text("Agua apta").style("font-size", "15px").attr("alignment-baseline","middle")
svg2.append("text").attr("x", 220).attr("y", 160).text("Agua no apta").style("font-size", "15px").attr("alignment-baseline","middle")
svg2.append("text").attr("x", 220).attr("y", 190).text("Agua con no conformidad").style("font-size", "15px").attr("alignment-baseline","middle")


//Parse the data
d3.csv("CalidadAguaSalamanca.csv", function(data) {

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d["Fecha"])}).keys()  
  
  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));
    svg2.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.top + 20)
      .text("Año");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 200])
    .range([ height, 0 ]);
  svg2.append("g")
    .call(d3.axisLeft(y));

    svg2.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -margin.top)
    .text("Número de captaciones")
    

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(d3.schemeSet2);

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)

   // ----------------
  // Highlight a specific subgroup when hovered
  // ----------------

  // What happens when user hover a bar
  var mouseover = function(d) {
    // what subgroup are we hovering?
    var subgroupName = d3.select(this.parentNode).datum().key; // This was the tricky part
    var subgroupValue = d.data[subgroupName];
    // Reduce opacity of all rect to 0.2
    d3.selectAll(".myRect").style("opacity", 0.2)
    // Highlight all rects of this subgroup with opacity 0.8. It is possible to select them since they have a specific class = their name.

    if(subgroupName == "AguaApta"){
      d3.select(".myRect.AguaApta").style("opacity", 1)
    }
    if(subgroupName == "AguaNoApta"){
      d3.select(".myRect.AguaNoApta").style("opacity", 1)
    }
    if(subgroupName == "AguaNoConformidad"){
      d3.select(".myRect.AguaNoConformidad").style("opacity", 1)
    }

    }

  // When user do not hover anymore
  var mouseleave = function(d) {
    // Back to normal opacity: 0.8
    d3.selectAll(".myRect")
      .style("opacity",0.8)
    }

  // Show the bars
  svg2.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .attr("class", function(d){ return "myRect " + d.key }) // Add a class to each subgroup: their name
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.Fecha); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())
        .attr("stroke", "grey")
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)

});
