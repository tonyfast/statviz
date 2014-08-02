



//micrograph images on the webpage
var img_src = ["https://farm6.staticflickr.com/5570/14585739749_9d6a346283_z.jpg",
"https://farm4.staticflickr.com/3843/14769216791_1e6f623dc3_z.jpg",
"https://farm4.staticflickr.com/3855/14585737359_9c3c7374a4_z.jpg",
"https://farm4.staticflickr.com/3852/14585744718_11e3e9ee11_z.jpg"];

var im_sz = [ 640, 478];
var oim_sz = [1392,1040];
var im_pad = 10;

//iamge display width in pixels
dispsz = 300;
scaleimages = d3.scale.linear().range([0,dispsz])
.domain([0,im_sz[1]*2+im_pad ])

imwidth = scaleimages(im_sz[0])


var canvas = d3.select("#punchcard").append("svg")
.attr("width",window.innerWidth )
.attr("height",scaleimages(im_sz[1])*2+im_pad )

gim = canvas.append("g")
.attr("id","imgblock")
.attr("width", scaleimages(im_sz[0]*2+im_pad) )

var pcaw = parseFloat(d3.select("#liquidvars1").text())

pcag = canvas.append("g")
.attr("width", 200)
.attr("height", 200).append("g")
.attr("transform","translate("+(imwidth * 2 + 10)+",10)")

var tooltip = d3.select("#punchcard").append("div")
.attr("class", "tooltip")
.style("opacity", 0);



// Add PCA plot
data_loc = d3.select("#liquidvars").text();



var colorlim = d3.scale.category10();
d3.json( data_loc, function(error, d){

  console.log( error )
  data = d;

  img_src = d["images"];

  images = d3.selectAll("#imgblock image")
  //ON MOUSE
  scaleimagesOM = d3.scale.linear().domain([0,oim_sz[1] ])
  .range([0,d3.select(images[0][0]).attr("height") ])

  img_src.forEach( function(d,i){
    gim.append("image")
    .attr( "xlink:href",d)
    .attr("x", scaleimages( ( (i % 2)  ) * ( im_sz[0] + im_pad ) ) )
    .attr("y", scaleimages( ( Math.floor(i / 2 )) * im_sz[1] + ( Math.floor(i / 2 ) > 0)*im_pad) )
    .attr("width",scaleimages( im_sz[0] ) )
    .attr("height",scaleimages( im_sz[1] ) )
  })


  xlim = d3.scale.linear()
  .domain([d3.min(d, function(d){return parseFloat(d["X"]);}) ,
  d3.max(d, function(d){return parseFloat(d["X"]);})])
  .range([0,200]);

  // Set Y-axis scale
  ylim = d3.scale.linear()
  .domain([d3.min(d, function(d){
    return parseFloat(d["Y"]);
  }) ,
  d3.max(d, function(d){
    return parseFloat(d["Y"]);
  })])
  .range([0,200])

  // Draw PCA X-axis
  pcag.append("g")
  .attr("class","x axis")
  .attr("transform", "translate(0," + ylim(0) + ")")
  .call( d3.svg.axis().scale(xlim).orient("bottom") )

  // Draw PCA Y-axis
  pcag.append("g")
  .attr("class","y axis")
  .attr("transform","translate("+200+",0)")
  .call( d3.svg.axis().scale(ylim).orient("right") )

  //Draw points
  pcag.selectAll(".dot")
  .data(d)
  .enter().append("circle")
  .attr("class", "dot")
  .attr("r", 6)
  .attr("cx", function(d,i){
    return xlim( d['X'] );
  })
  .attr("cy", function(d,i){
    return ylim(d['Y']);
  })
  .style("fill", function(d,i){
    return colorlim(d["ImId"]);
  })
  .style("opacity",.7)
  .on("mouseover", function(d) {
    tooltip.transition()
    .duration(200)
    .style("opacity", .9);
    tooltip.html(d['ImId'])
    .style("left", (d3.event.pageX + 5) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
    showrect( d["ImId"]-1,d["wX"], d["wY"], pcaw );
  })
  .on("mouseout", function(d) {
    tooltip.transition()
    .duration(500)
    .style("opacity", 0);
    remrect();
  });



  var showrect = function( i,x,y,w ){


    vshift = parseFloat(d3.select(images[0][i]).attr("x"))
    hshift = parseFloat(d3.select(images[0][i]).attr("y"))

    d3.select("#imgblock").append("rect")
    .attr( "x", vshift + parseFloat(scaleimagesOM(y) ))
    .attr( "y", hshift + parseFloat(scaleimagesOM(x) ))
    .attr("width", scaleimagesOM(w) )
    .attr("height",scaleimagesOM(w) )
    .style("fill", "none")
    .style("stroke", "black") }

    var remrect = function(){
      d3.select("#imgblock").select("rect")
      .remove()
    }




  })
