/**
 * Created by shreyasingh on 9/27/15.
 */
$(document).ready(function () {

  alert("test");

  var arr = [];
  var arr1 = [];
  var obj1  = {id:"159",type:"compound",x:"912",y:"377",width:"50",height:"50"};
  arr.push(obj1);
  arr1.push(obj1);
  var obj2 =  {id:"162",type:"ortholog",x:"674",y:"669",width:"50",height:"50"};
  arr.push(obj2);
  arr1.push(obj2);
  var obj3 =  {id:"163",type:"ortholog",x:"618",y:"645",width:"50",height:"50"};
  arr.push(obj3);
  arr1.push(obj3);
  var obj4 =  {id:"165",type:"ortholog",x:"600",y:"600",width:"50",height:"50"};
  arr1.push(obj4);

  $.each(arr, function(index, val) {
    console.log(val);
  });

  var svg = d3.select("body").append("svg");

  var height = 1000;
  var width = 1000;
  svg.attr("width", width)
    .attr("height", height);
  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "none");

  var nodeGroup = svg.append("g");
  var test =  nodeGroup.selectAll("rect").data(arr1);

  test.enter().append("rect");

  test.attr("x", function (node) {
    return node.x - node.width / 2;
  })
    .attr("y", function (node) {

      return node.y - node.height / 2;
    })
    .attr("width", function (node) {

      return node.width;
    })
    .attr("height", function (node) {
      return node.height;
    })
    .attr("fill", "rgb(255,0,0)");

  test.exit().remove();


  var test =  nodeGroup.selectAll("rect").data(arr);

  test.enter().append("rect");

  test.attr("x", function (node) {
    return node.x - node.width / 2;
  })
    .attr("y", function (node) {

      return node.y - node.height / 2;
    })
    .attr("width", function (node) {

      return node.width;
    })
    .attr("height", function (node) {
      return node.height;
    })
    .attr("stroke","blue")
    .attr("fill","none");

  test.exit().remove();










});
