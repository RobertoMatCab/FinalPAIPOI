///////////////////////////////////
// AIRE //
//////////////////////////////////

// Dimensiones para los graficos
// =============================
var margin = { top: 10, right: 30, bottom: 60, left: 60 },
  width = 900 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;
  
// Añadir svg al div
// =================
var svg = d3.select("#aire")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
	"translate(" + margin.left + "," + margin.top + ")");  
	

// Lectura del dataset
// ===================  

d3.csv("CalidadAireSalamanca.csv", 
  // When reading the csv, I must format variables:
  function(d){
    return { date : (new Date(d3.timeParse("%d/%m/%Y")(d.Fecha))).getTime(), value : d["PM25 (ug/m3)"] }
  },



function (data){

  let fechas =[];

      // Eje Y
      // =====
      var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
        .range([height, 0])
      svg.append("g").call(d3.axisLeft(y))

      svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top)
        .text("Niveles partículas PM25 (ug/m3)")


      // Eje X
      // =====
      var x = d3.scaleTime()
      .range([0, width])
        .domain(d3.extent(data, function(d) { return  d.date}));

      svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.top + 20)
      .text("Tiempo");

      svg.append("g")
        .attr("class", "myXAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .attr("opacity", "0");

      
      svg.select(".myXAxis")
        .transition()
        .duration(2000)
        .attr("opacity", "1")
        .call(d3.axisBottom(x));

      // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x( d.date) })
        .y(function(d) {return y(d.value) })
        )	
});

