/**
 * Created by Christian on 11.12.2014.
 */
define(['jquery', 'd3', 'underscore'], function ($, d3, _) {
  'use strict';
  //$.ajax({
  //
  //  // The 'type' property sets the HTTP method.
  //  // A value of 'PUT' or 'DELETE' will trigger a preflight request.
  //  type: 'GET',
  //
  //  // The URL to make the request to.
  //  url: 'http://rest.kegg.jp/list/pathway/hsa/',
  //
  //  // The 'contentType' property sets the 'Content-Type' header.
  //  // The JQuery default for this property is
  //  // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
  //  // a preflight. If you set this value to anything other than
  //  // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
  //  // you will trigger a preflight request.
  //  contentType: 'text/plain',
  //
  //  xhrFields: {
  //    // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
  //    // This can be used to set the 'withCredentials' property.
  //    // Set the value to 'true' if you'd like to pass cookies to the server.
  //    // If this is enabled, your server must respond with the header
  //    // 'Access-Control-Allow-Credentials: true'.
  //    withCredentials: false
  //  },
  //
  //  headers: {
  //    // Set any custom headers here.
  //    // If you set any non-simple headers, your server must include these
  //    // headers in the 'Access-Control-Allow-Headers' response header.
  //  },
  //
  //  success: function(response) {
  //    d3.select("body").append("p").text(response);
  //    d3.select("body").append("img").attr("src", "http://rest.kegg.jp/get/hsa00052/image");
  //  },
  //
  //  error: function(response) {
  //    // Here's where you handle an error response.
  //    // Note that if the error was due to a CORS issue,
  //    // this function will still fire, but there won't be any additional
  //    // information about the error.
  //  }
  //});



  $(document).ready(function () {
    //$.get("/api/pathway", function (resp) {
    // $('<h1>'+resp+'</h1>').appendTo('body');
    //});



   $.get("/api/kegg_pathways/list", function (response) {

/*
    var menuLinkText = [{
       text: "Debug Mode",
       id: "debug_mode"
     }, {
      text: "Select Pathways",
      id: "select_pathways"
     }, {
      text: "EnRoute",
      id: "enroute"
     }];
*/


      if (typeof(response) === "string") {
        var entries = response.split("\n");

        var pwMapIDs = entries.map(function (entry) {
          return [entry.substring(5, 13), entry.substring(14)];
        });

        var selectPathway = $('<select>').appendTo('#selection')[0];
        pwMapIDs.forEach(function (d) {
          $(selectPathway).append($("<option value='" + d[0] + "'>" + d[1] + "</option>"));
        });

        $('</br>').appendTo('#selection');

        var svg = d3.select("#left").append("svg").attr('id','leftContainer');
        var image = svg.append("defs")
          .append('pattern')
          .append("image");


        svg.append("rect");

        var nodeGroup = svg.append("g");


        var RightSvg = d3.select("#right").append("svg").attr('id','rightContainer');



        RightSvg.append("rect");





        //image.on("load", function() {
        //  console.log("width: " + this.width + ", height: "+this.height);
        //});

     /*   var menuLinks = d3.select("#menuLinks");

        var textNodes = menuLinks.selectAll("text").data(menuLinkText);

        textNodes.enter().append("text")
          .attr("class", "label")
          .attr("href",'#')
          .attr("id",function(d){
            return d.id
          })
          .text(function (d) {
            return d.text
          });*/
          /*
         .style('float','left')
          .style('width','6em')
      .style('text-decoration','none')
      .style('color','black')
      .style('background-color','#030101')
      .style('padding','0.2em 0.6em')
      .style('border-right','1px solid white');*/


        //var menuLinks = d3.select('#menuLinks').selectAll("ul").data({id:pathways,name:pathways});
        //menuLinks.enter().append('ul');


       // menuLinks.on('click', makeSelection);


        $(selectPathway).on("change", function () {

          var imgUrl = "http://rest.kegg.jp/get/" + this.value + "/image";
          var xmlUrl = "/api/kegg_pathways/kgml/" + this.value;
          // var xmlUrl = "http://rest.kegg.jp/get//" + this.value+ "/kgml";

          var img = $("<img/>").attr("src", imgUrl).load(function () {
            var width = this.width;
            var height = this.height;

            svg.attr("width", width)
              .attr("height", height);




            svg.select("defs")
              .select('pattern')
              .attr('id', 'bg')
              .attr('patternUnits', 'userSpaceOnUse')
              .attr('width', width)
              .attr('height', height)
              .select("image")
              .attr("xlink:href", imgUrl)
              .attr('width', width)
              .attr('height', height);

            svg.select("rect")
              .attr("fill", "url(#bg)").attr('width', width)
              .attr('height', height);


            RightSvg.select("rect")
              .attr('x',width+10)
              .attr("height",height)

            $.get(xmlUrl, function (response) {
              render(nodeGroup, response);
            });

            console.log(selectedMenuLink);
          });
          //img.appendTo("body");


          //d3.select("body").append("img").attr("src", "http://rest.kegg.jp/get/" + this.value + "/image");
        });

        //d3.select("body").append("p").text(pwMapIDs[0][1]);
        //d3.select("body").append("img").attr("src", "http://rest.kegg.jp/get/" + pwMapIDs[0][0] + "/image");
      }
    }) .done(function() {
      //alert( "second success" );
    })
      .fail(function(xhr, err) {
       // alert("erroR");

      });


  });

  $( "#menu a" ).bind( "click", function() {
    //alert($(this.attr("id")));
    var id = $(this).attr("id");

    if($(this).attr("selected")) {
      $(this).attr("selected", false);
      $(this).attr("style","background-color: #030101;");
      if(id === "pathway"){

        var unselect = d3.select("body").selectAll("rect")

        unselect.attr("style","outline: none");

      }
    } else {
      $(this).attr("selected", "selected");
      $(this).attr("style","background-color: #3091ff;");

    }
  });



    function render(parent, data) {

    var nodes = [];
    var allNodes = [];
    var edges = [];
    var nodeMap = {};
    var reactionMap = {};
    var selectedNodes = [];
    var sourceNode = {};
    var targetNode = {};

    $(data).find('entry').each(function () {
      var entry = $(this);
      var id = entry.attr("id");
      var type = entry.attr("type");

      var allnode = {}

      allnode.id = id;
      allnode.type = type;

      var graphicsNode = entry.find('graphics');
      allnode.x = $(graphicsNode).attr('x');
      allnode.y = $(graphicsNode).attr('y');
      allnode.name = $(graphicsNode).attr('name');
      allnode.width = $(graphicsNode).attr('width');
      allnode.height = $(graphicsNode).attr('height');

      //nodeMap[id] = allnode;
      allNodes.push(allnode);

      //only consider genes and compounds for now
      if (type === "gene" || type === "compound") {

        var node = {};

        node.id = id;
        node.type = type;

        var graphics = entry.find('graphics');
        node.x = $(graphics).attr('x');
        node.y = $(graphics).attr('y');
        node.name = $(graphics).attr('name');
        node.width = $(graphics).attr('width');
        node.height = $(graphics).attr('height');

        nodeMap[id] = node;
        nodes.push(node);

        if (type === "gene") {
          var reaction = entry.attr("reaction");

          if (typeof reaction != "undefined" && reaction != null) {
            var r = reactionMap[reaction];
            if (typeof r === "undefined") {
              r = [];
            }
            r.push(node);
            reactionMap[reaction] = r;
          }
        }
      }
    });

    $(data).find('relation').each(function () {
        var relation = $(this);
        var relationType = relation.attr("type");

        var sourceNodeId = relation.attr("entry1");
        var targetNodeId = relation.attr("entry2");

        var subType = relation.find("subtype");
        var subTypeName = subType.attr("name");
        var subTypeValue = subType.attr("value");

        var sourceNode = nodeMap[sourceNodeId];
        var targetNode = nodeMap[targetNodeId];
        if (typeof sourceNode === "undefined" || typeof targetNode === "undefined") {
          return;
        }

        if (subTypeName === "compound") {
          var intermediateNode = nodeMap[subTypeValue];
          if (typeof intermediateNode != "undefined") {
            edges.push({
              source: intermediateNode,
              target: targetNode,
              edgeClass: "relation"
            });
            edges.push({
              source: sourceNode,
              target: intermediateNode,
              edgeClass: "relation"
            });
          }
        } else {
          edges.push({
            source: sourceNode,
            target: targetNode,
            edgeClass: "relation"
          });
        }
      });

    $(data).find('reaction').each(function () {
        var reaction = $(this);
        var reactionType = reaction.attr("type");

        var reactionName = reaction.attr("name");
        var genes = reactionMap[reactionName];

        if (typeof genes != "undefined") {
          reaction.find("substrate").each(function () {
            var substrate = $(this);
            var id = substrate.attr("id");
            var sourceNode = nodeMap[id];

            if (typeof sourceNode != "undefined") {
              genes.forEach(function (geneNode) {
                edges.push({
                  source: sourceNode,
                  target: geneNode,
                  edgeClass: "reaction"
                });

                if (reactionType == "reversible") {
                  edges.push({
                    source: geneNode,
                    target: sourceNode,
                    edgeClass: "reaction"
                  });
                }
              });
            }

          });

          reaction.find("product").each(function () {
            var product = $(this);
            var id = product.attr("id");
            var targetNode = nodeMap[id];

            if (typeof targetNode != "undefined") {
              genes.forEach(function (geneNode) {
                var edge = {};
                edge.source = geneNode;
                edge.target = targetNode;
                edges.push(edge);

                if (reactionType == "reversible") {
                  var e = {};
                  e.source = targetNode;
                  e.target = geneNode;
                  edges.push(e);
                }
              });
            }

          });
        }

      }
    );
      // Create Adjacency Matrix
      var matrix = createAdjacencyMatrix(nodes,edges);
      //console.log(matrix);


   //console.log(edges);
   /* console.log("This is test");

    $.each(allNodes, function(index, val) {
      console.log(val);
    }); */

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

   var check = parent.selectAll('rect').data(allNodes);

    check.enter()
        .append("rect");

    check.attr("x", function (node) {
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
      //.attr("stroke","red")
      .attr("fill","transparent")
      .attr("id",function(node){
        return node.id;
      })
      .on("mouseover",function(node){
        var color =  d3.select(this).attr( "style" );
        if(color == "outline: thick solid green;") {

        }else{
          d3.select(this)
            .attr("style", "outline: thick solid orange;")
        }
        div.transition()
          .duration(200)
          .style("opacity", .9);

        div.html(node.name)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");

    })
      .on("mouseout",function(){
        var color =  d3.select(this).attr( "style" );
        if(color == "outline: thick solid orange;") {
          d3.select(this)
            .attr("style", "outline: none;");

          div.transition()
            .duration(500)
            .style("opacity", 0);
        }else{
          //alert(color);
        }
      })

      .on("click",function(node){

       // console.log(node);

        if($( "#menu a#pathway" ).attr('selected')){

          if(jQuery.isEmptyObject(sourceNode)){
            //console.log("Source node");
            sourceNode = node;
            d3.select(this)
              .attr("style", "outline: thick solid green;");
            selectedNodes.push(node);

          }else{

            targetNode = node;
            //alert(this);
            var i;
            //CODE FOR SHORTEST PATH ALGORITHM //
            var path = shortestPathAlgo(matrix,nodes,sourceNode,targetNode);
            //console.log(nodes);
            console.log(path.length,'---',path);
            for (i = 0; i < path.length; i += 1) {

              var a = _.filter( nodes, function(item) {
                if (item.id == path[i]) {
                  return item;
                }
              })
              console.log("Object",i,"--",a);
              var id = a[0].id;
              alert(id);
              // FOR SELECTING AND DISPLAYING EXSISTING PATHS


            }


          // CODE FOR ORIGINAL NODE SELECTION ONE BY ONE //
          /* var a = _.filter( edges, function(item){
              if (item.source.id == sourceNode.id  && item.target.id == targetNode.id){
                return item;
              }
            })

            if(typeof a != "undefined" && a != null && a.length > 0){
              d3.select(this)
                .attr("style", "outline: thick solid green;");
              selectedNodes.push(node);
              sourceNode = targetNode;
            }else{

              var unselect = parent.selectAll("rect")

              unselect
                .attr("style","outline: none");

              //  unselect.exit().remove();
              sourceNode = null;
              targetNode = null;
              //alert("dont work!remove from selected!");
            }*/


          }
        }else{

          var unselect = parent.selectAll("rect")

          unselect
            .attr("style","outline: none");


          sourceNode = null;
          targetNode = null;
        }





      })

// Deselecting all selected nodes by double-clicking on any one of the selected nodes.
      .on("dblclick", function(){
      var color =  d3.select(this).attr( "style" );
              if(color == "outline: thick solid green;") {
                d3.selectAll("rect")
                  .attr("style", "outline: none;");
                //d3.event.stopPropagation();
              }})


// Removed all the red rect and blue lines --------------------
    rect.on("click", function() {
          console.log("rect");
          d3.event.stopPropagation();
        });
//---------------------------------------------------------
    check.exit().remove();



    var tt = parent.selectAll("rect").data(nodes);

    tt.enter()
      .append("rect")
      .append("svg:title")
     // .text(function(node) { return node.name;})


    tt.attr("x", function (node) {
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
      .attr("fill", "rgb(255,0,0)")
      //.attr("stroke","red")
      //.attr("fill","none")
      .on("mouseover",function(node){
        var color =  d3.select(this).attr( "style" );
        if(color == "outline: thick solid green;") {

        }else{
          d3.select(this)
            .attr("style", "outline: thick solid orange;")
        }
        div.transition()
          .duration(200)
          .style("opacity", .9);

        div.html(node.name)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");

      })
      .on("mouseout",function(){
        var color =  d3.select(this).attr( "style" );
        if(color == "outline: thick solid orange;") {
          d3.select(this)
            .attr("style", "outline: none;");

          div.transition()
            .duration(500)
            .style("opacity", 0);
        }else{

        }
      })


    // tt.exit().remove();

    var tt = parent.selectAll("line").data(edges);

    tt.enter()
      .append("line");

    tt.attr("x1", function (edge) {
      return edge.source.x;
    })
      .attr("y1", function (edge) {

        return edge.source.y;
      })
      .attr("x2", function (edge) {
        return edge.target.x;
      })
      .attr("y2", function (edge) {
        return edge.target.y;
      })
      .attr("stroke", function(edge) {
        return edge.edgeClass === "relation" ? "rgb(0,0,255)" : "rgb(0,255,0)";
      });
      //.attr("stroke-dasharray", function(edge) {
      //  return edge.edgeClass === "relation" ? "0,0" : "1,20";
      //});
    tt.exit().remove();



    //var entries = $(data).find('entry');
    //
    //var tt = parent.selectAll("rect").data(entries);
    //
    //tt.enter()
    //  .append("rect");
    //
    //tt.attr("x", function (entry) {
    //  var graphics = $(entry).find('graphics');
    //  var width = $(graphics).attr('width');
    //  return $(graphics).attr('x') - width / 2;
    //})
    //  .attr("y", function (entry) {
    //    var graphics = $(entry).find('graphics');
    //    var height = $(graphics).attr('height');
    //    return $(graphics).attr('y') - height / 2;
    //  })
    //  .attr("width", function (entry) {
    //    var graphics = $(entry).find('graphics');
    //    return $(graphics).attr('width');
    //  })
    //  .attr("height", function (entry) {
    //    var graphics = $(entry).find('graphics');
    //    return $(graphics).attr('height');
    //  })
    //  .attr("fill", "rgb(255,0,0)");
    //tt.exit().remove();

    //parent.append("rect")
    //  .attr("x", 146)
    //  .attr("y", 911)
    //  .attr("width", 10)
    //  .attr("height", 10)
    //  .attr("fill", "rgb(0,0,255)")

  }




  function createAdjacencyMatrix(nodes,edges) {

    var edgeHash = {};
    var MaxValue = 1000;
    for (var x in edges) {
      var id = edges[x].source.id + "-" + edges[x].target.id;
      edgeHash[id] = edges[x];
    }

    var matrix = [];
    //create all possible edges
    for (var a in nodes) {
      for (var b in nodes) {
        var grid = {id: nodes[a].id + "-" + nodes[b].id, source: nodes[a].id, target: nodes[b].id, weight: MaxValue};
        if (edgeHash[grid.id]) {
          grid.weight = 1;
        }
        matrix.push(grid);
      }
    }


    return matrix;
  }


  function shortestPathAlgo(matrix,nodes,sourceNode,targetNode){


    var distance = [];
    var previous = [];
    var Q=[] //LIST OF ALL VERTICES//
    var  i;

    //console.log(Q);
    console.log("SourceNode--->",sourceNode);
    console.log("TargetNode--->",targetNode);


    // INITIALIZATION STEP : ALL NODES AS INFINITY //
    for (i = 0; i < nodes.length; i += 1) {

      var dist = {}
      var prev = {}
      dist.id = nodes[i].id;
      dist.value = Infinity;
      //prev.id = nodes[i].id;
      //prev.value = null;
      distance.push(dist);
      previous[nodes[i].id] = undefined;
      //previous.push(prev);
      Q.push(nodes[i].id);

    }

     // INITIALIZATION STEP : SOURCE NODE AS 0 //
     _.filter( distance, function(item){
      if (item.id == sourceNode.id){
        item.value = 0;
      }
    })

//    console.log(previous);

    var S = []; // LIST OF VISITED VERTICES //

    //console.log("iterations",Q.length);
    while(!jQuery.isEmptyObject(Q)){


      var min = Infinity;

      var pos = 0;
      //console.log("distance Iterations",distance);
    //  console.log("previous Iterations",previous);
     // console.log("Q-->",Q,'length-->',Q.length);
      for (i = 0; i < Q.length; i += 1) {

        var minDist = distance.filter(function(a){ return a.id == Q[i] })[0];
        var weightValue = minDist.value;

        if(weightValue < min){
          min = weightValue;
          pos = Q[i];
        }
      }

    //  console.log(min,'--',pos);
      S.push(pos);
      Q.pop(pos);


     // NEIGHBOUR FINDING STEP //

     var v = _.filter( matrix, function(item){
      if (item.source == pos){
        return item.target;
        }
      })

      // TERMINATE IF TARGET NODE REACHED //
      var currentDist = distance.filter(function(a){ return a.id == pos })[0];
      if (currentDist.value == Infinity || pos == targetNode.id) {
          //console.log("stop!!");
          //previous[pos] = targetNode.id;
          break;
      }

    //console.log(v);

     for (i = 0; i < v.length; i += 1) {

      var neighbourId =  v[i].target;
      //console.log("NEXT NEIGHBOUR ID",neighbourId);
      var matrixId = pos+'-'+neighbourId;
      //console.log(matrixId);
      var current = _.filter( matrix, function(item){
        if (item.id == matrixId){
          return item;
        }
      })
     // console.log(current[0].weight);
     // console.log("next");
       var alt = currentDist.value+ current[0].weight;
       var neighbourDist = distance.filter(function(a){ return a.id == neighbourId })[0];

       //console.log(alt,'+',neighbourDist.value);
      if(alt < neighbourDist.value){

        _.filter( distance, function(item){
          if (item.id == neighbourId){
            item.value = alt;
          }
        })

      /*  _.filter( previous, function(item){
          if (item.id == neighbourId){
            item.value = alt;
          }
        })*/

        previous[neighbourId] = pos
      }

     }
   }

    //console.log("FINAL");
    previous = previous.filter(function(n){ return n != undefined });
    previous = _.uniq(previous);
    //console.log(previous);

    return previous;




  }
//var o = {
//  width: 500,
//  height: 100,
//  tickSize: 3,
//  barPadding: 2,
//  axisPadding: 30
//};
//var barPadding = o.barPadding;
//var padding = o.axisPadding;
//var plotWidth = o.width - padding;
//
//var svg = d3.select("body").append("svg")
//  .attr("width", o.width)
//  .attr("height", o.height);
//
//
//data.list().then(function (list) {
//  //for all inhomogeneous add them as extra columns, too
//  var vectors = [];
//
//  list.forEach(function (entry) {
//    if (entry.desc.type === "vector") {
//      vectors.push(entry);
//    }
//
//  });
//
//  var myVector = vectors[0];
//
//  var yScale = this.yScale = d3.scale.linear().domain(myVector.desc.value.range).range([o.height, 0]);
//
//  var axis = d3.svg.axis().
//    scale(yScale).
//    orient("right")
//    .ticks(o.tickSize);
//
//  var supergroup = svg.append("g");
//
//  supergroup.append("g")
//    .attr("class", "axis")
//    .attr("transform", "translate(" + plotWidth + ", 0)")
//    .call(axis);
//
//  var bars = supergroup.append("g")
//    .attr("class", "bar");
//  var labels = supergroup.append("g")
//    .attr("class", "label");
//  myVector.data().then(function (myData) {
//
//
//    //var onClick = utils.selectionUtil(this.data, bars, "rect");
//
//
//    bars.selectAll("rect")
//      .data(myData)
//      .enter()
//      .append("rect")
//      .attr("x", function (d, i) {
//        return i * (plotWidth / myData.length);
//      })
//      .attr("y", function (d) {
//        return yScale(d);
//      })
//      .attr("width", plotWidth / myData.length - barPadding)
//      .attr("height", function (d) {
//        return o.height - yScale(d);
//      })
//      .attr("fill", function (d) {
//        return "rgb(0,0," + (d * 10) + ")";
//      });
//    //.on('click', onClick);
//
//    var tt = labels.selectAll("text").data(myData);
//    tt.enter()
//      .append("text")
//      .attr("y", function (d) {
//        return 50;//(yScale(d)) + 15;
//      })
//      .attr("font-family", "sans-serif")
//      .attr("font-size", "11px")
//      .attr("fill", "red")
//      .attr("text-anchor", "middle");
//    tt.text(function (d) {
//      return d;
//    }).attr("x", function (d, i) {
//      return i * (plotWidth / myData.length) + (plotWidth / myData.length - barPadding) / 2;
//    });
//    tt.exit().remove();
//
//  });
//
//  //list = list.map(function (d) {
//  //  return {
//  //    key : d.desc.id,
//  //    value : d,
//  //    group : '_dataSets'
//  //  };
//  //});
//  //list.forEach(function (entry) {
//  //  if (entry.value.desc.type === 'table') {
//  //    list.push.apply(list, entry.value.cols().map(function (col) {
//  //      return {
//  //        group: entry.value.desc.name,
//  //        key: col.desc.name,
//  //        value: col
//  //      };
//  //    }));
//  //  }
//  //});
//  //list.unshift({group: '_dataSets'});
//  //var nest = d3.nest().key(function (d) {
//  //  return d.group;
//  //}).entries(list);
//  //var $options = $select.selectAll('optgroup').data(nest);
//  //$options.enter().append('optgroup').attr('label', function (d) {
//  //  return d.key;
//  //}).each(function (d) {
//  //  var $op = d3.select(this).selectAll('option').data(d.values);
//  //  $op.enter().append('option').text(function (d) {
//  //    return d.value ? d.value.desc.name : '';
//  //  });
//  //});
//  //$select.on('change', function () {
//  //  var n = $select.node();
//  //  var i = n.selectedIndex;
//  //  if (i < 0) {
//  //    return;
//  //  }
//  //  var op = n.options[i];
//  //  var d = d3.select(op).data()[0];
//  //  if (d && d.value) {
//  //    addIt(d.value);
//  //  }
//  //  n.selectedIndex = 0;
//  //});
//});


});
