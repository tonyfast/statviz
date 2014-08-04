



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
d3.json( data_loc, function(error, data){

  img_src = data["src"]["images"];


img_src.forEach( function(data,i){
  gim.append("image")
  .attr( "xlink:href",data)
  .attr("x", scaleimages( ( (i % 2)  ) * ( im_sz[0] + im_pad ) ) )
  .attr("y", scaleimages( ( Math.floor(i / 2 )) * im_sz[1] + ( Math.floor(i / 2 ) > 0)*im_pad) )
  .attr("width",scaleimages( im_sz[0] ) )
  .attr("height",scaleimages( im_sz[1] ) )
})



  images = d3.selectAll("#imgblock image")
  //ON MOUSE
  scaleimagesOM = d3.scale.linear().domain([0,oim_sz[1] ])
  .range([0,d3.select(images[0][0]).attr("height") ])

  xlim = d3.scale.linear()
  .domain([d3.min(data["src"]["data"]["X"], function(d){return parseFloat(d);}) ,
    d3.max(data["src"]["data"]["X"], function(d){return parseFloat(d);}) ])
  .range([0,200])

  // Set Y-axis scale
  ylim = d3.scale.linear()
  .domain([d3.min(data["src"]["data"]["Y"], function(d){return parseFloat(d);}) ,
    d3.max(data["src"]["data"]["Y"], function(d){return parseFloat(d);}) ])
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

  // Create tooltip function
  function WriteTooltip( d, i ){
      tooltip.transition()
      .duration(200)
      .style("opacity", .9);

      tooltip.html(d["src"]["data"]['ImId'][i])
      .style("left", (d3.event.pageX + 5) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
      showrect( i,d["src"]["data"]["wX"][i], d["src"]["data"]["wY"][i], pcaw );
  }

/*
v = pcag.data( data["src"]["data"]["X"],
               function( d,i ) {
                  console.log( data["src"]["data"]["X"][i] )} ).enter()
*/


pcag.selectAll(".dot").data(data["src"]["data"]["X"])
  .enter().append("circle")
  .attr("class", "dot")
  .attr("r", 6)
  .attr("cx", function(c,i){
    console.log( c )
    console.log( i )
    return xlim( data["src"]["data"]['X'][i] );
  })
  .attr("cy", function(c,i){
    return ylim(data["src"]["data"]['Y'][i]);
  })
  .style("fill", function(c,i){
    return colorlim(data["src"]["data"]["ImId"][i] );
  })
  .style("opacity",.7)
  .on("mouseover", function(d,i) {
    tooltip.transition()
    .duration(200)
    .style("opacity", .9);
    tooltip.html(data["src"]["data"]['ImId'][i])
    .style("left", (d3.event.pageX + 5) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
    showrect( data["src"]["data"]["ImId"][i]-1,
              data["src"]["data"]["wX"][i],
              data["src"]["data"]["wY"][i], pcaw );
  })
  .on("mouseout", function(d) {
    tooltip.transition()
    .duration(500)
    .style("opacity", 0);
    remrect();
  });
/*
  pcag.selectAll(".dot")
  .data(d, )

  //Draw points
  pcag
  .call( function(selection){

    for ( i=0; i < d["src"]["data"]["X"].length; i++){


    selection
    .append("circle")
    .attr("class", "dot")
    .attr("r", 6)
    .attr("cx", xlim( d["src"]["data"]['X'][i] ))
    .attr("cy", ylim( d["src"]["data"]['Y'][i] ))
    .style("fill",colorlim(d["src"]["data"]["ImId"][i]) )
    .style("opacity",.7)
    .on("mouseover", function() {
        WriteTooltip( d,i )
    })
    .on("mouseout", function() {
      tooltip.transition()
      .duration(500)
      .style("opacity", 0);
      remrect();
    });
  }
  })






/*

*/


  var showrect = function( i,x,y,w ){
console.log( i)
console.log( x)
console.log( y)
console.log( w)

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
