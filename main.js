/**
 * Created by Christian on 11.12.2014.
 */
define(['jquery', 'd3', 'underscore', '../caleydo_core/ajax', '../pathfinder_ccle/ccle'], function ($, d3, _, ajax, ccle) {
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



  var a,c,e,m,s;
  var b = 50;
  var d = 50;
  var f = 70;
  var l = 50;
  var p = 10;
  var q = 10;
  var temp = b;
  var tempF = 70;
  var array = [];
  var count = 0;
  var id = 100;
  var idText = 1000;
  var geneId = 150;
  var geneTextId = 1500;
  var valueList =[];
  var enrouteNodeName = [];
  var enrouteNodeId = [];
  var enrouteNodeX = [];
  var enrouteNodeY = [];
  var geneIdArray = [];
  var geneTextIdArray = [];
  var menuChosen;
  var nodeGroup;
  var nodeInfo = [];
  var nodeNames = [];
  var allDatasets = {};
  var groupFlag = false;
  var groupList = [];
  var stdDevList = [];
  var barId = 2000;
  var barIdArray = [];
  $(document).ready(function () {
    //$.get("/api/pathway", function (resp) {
    // $('<h1>'+resp+'</h1>').appendTo('body');
    //});


    //
    //var nodeInfo = [];
    //var nodeNames = [];
    //var allDatasets = {};

    var NewPath;
    var rightNodeGroup;
   $.get("/api/kegg_pathways/list", function (response) {


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

        var svg = d3.select("#left").append("svg").attr('id', 'leftContainer');
        var image = svg.append("defs")
          .append('pattern')
          .append("image");


        svg.append("rect");
        svg.append("text");
        nodeGroup = svg.append("g");


        $(selectPathway).on("change", function () {

          var imgUrl = "http://rest.kegg.jp/get/" + this.value + "/image";
          var xmlUrl = "/api/kegg_pathways/kgml/" + this.value;
          // var xmlUrl = "http://rest.kegg.jp/get//" + this.value+ "/kgml";

          var img = $("<img/>").attr("src", imgUrl).load(function () {
            var width = this.width;
            var height = this.height;
            a = width;
            c = width;
            e = width;
            m = width + 250;
            s = m;
            svg.attr("width", width+400)
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


            $.get(xmlUrl, function (response) {
              render(nodeGroup, response);
              nodeNames = getNodeNames(response);
              nodeInfo = getNodeInfo(response);
              //console.log(nodeInfo);
              allDatasets = getInfoDatasets(nodeNames);


            });

            //  console.log(selectedMenuLink);
          });
          //img.appendTo("body");


          //d3.select("body").append("img").attr("src", "http://rest.kegg.jp/get/" + this.value + "/image");
        });

        //d3.select("body").append("p").text(pwMapIDs[0][1]);
        //d3.select("body").append("img").attr("src", "http://rest.kegg.jp/get/" + pwMapIDs[0][0] + "/image");
      }
    }).done(function () {
        //alert( "second success" );
      })
      .fail(function (xhr, err) {
        // alert("erroR");

      });

    $('#menu').on("click", "li a", function() {
      //alert($(this.attr("id")));
      var id = $(this).attr("id");

      // alert(id);


      if ($(this).attr("selected")) {
        $(this).attr("selected", false);
        $(this).attr("style", "background-color: #030101;");
        if (id === "pathway") {

          var unselect = d3.select("body").selectAll("rect");

          unselect.attr("style", "outline: none");

        }

        if(id === "enroute"){
                var unselect = d3.select("body").selectAll("rect")
                unselect.attr("style","outline:none");
                }

      } else {
        $(this).attr("selected", "selected");
        $(this).attr("style", "background-color: #3091ff;");


      }
      //idText.length != 0 && menuChosen != 'enroute'
      if(id === 'enroute')
      {
          if(menuChosen === 'mrnaexpression' || menuChosen === 'copynumbervariation')
          {
            drawmappings(menuChosen);
          }
      }


      if (id === 'mrnaexpression' || id === 'copynumbervariation') {

       // alert("here>");

        // To check if the dataset is ready or not.If not no mapping is done
        if(jQuery.isEmptyObject(allDatasets)){

          alert("DataSet is loading, please wait!");

          $(this).removeAttr('selected');
          $(this).attr("style", "background-color: none;");

          return;

        }


        //console.log("test??");
        if ($(this).attr("selected")) {



          if(!groupFlag){

            $('#menu ul li:last').after('<li><a href="#" id="group"> Grouping </a></li>');
            groupFlag = true;

          }
          menuChosen = id;
          drawmappings(id,'all');
        }else{


          $('#menu ul li a#group').remove();
          $("#showGrouping").empty();
          groupFlag = false;
          unmap();
        }



      }

      if(id === "group"){
     //   alert("test this!");
        if ($(this).attr("selected")) {

          $('#showGrouping').append('<input type="checkbox" id="none">none<br />');
          var group = Object.keys(allDatasets[menuChosen]);
          group.forEach(function (d) {
            $('#showGrouping').append('<input type="checkbox" / id="'+d+'"> ' + d + '<br />');
          });
        }else{
          $("#showGrouping").empty();
        }


      }

      $('input[type="checkbox"]').change(function() {
        var checkboxId = this.id;
        if($(this).is(":checked")) {
          groupList.push(checkboxId);
        }
        else{
          var newgroupList = _.reject(groupList, function(d){
            return d === checkboxId;
          });
          if(newgroupList.length!=0){
            groupList.length = 0;
            groupList = newgroupList;
          }else{
            checkboxId = "none";
          }
        }

        drawmappings(menuChosen,checkboxId);

      });

    });


    function unmap(){

      groupList.length = 0;
      stdDevList.length = 0;
      var rectBar = d3.select("#leftContainer");
      rectBar.selectAll('rect.mapN').remove();
      rectBar.selectAll('rect.barN').remove();
      rectBar.selectAll('text.textN').remove();

      nodeInfo.forEach(function(d,i){
        var selectRectId = "rect[id='" + nodeInfo[i].id + "']";
        d3.select(selectRectId)
          .attr("fill", "transparent");
      })




    }

    function drawmappings(id,groupID){

      if(groupID == 'none'){

        $('input:checkbox').removeAttr('checked');
        $("input[id^='none']").prop("checked","checked");
        unmap();
        return;
      }
      var dataset = Object.keys(allDatasets);
      var color;
      var datasetName;

      if (id === 'mrnaexpression') {
        color = "purple"
        datasetName = "mRNA Expression";
      }
      if (id === 'copynumbervariation') {
        color = "green";
        datasetName = "Copy Number Expression";
      }

      $('#dataset').html(datasetName);

      ccle.rows(id).then(function (data) {
        $('#genes').html(data.length);
      });

      ccle.cols(id).then(function (data) {
        $('#celLines').html(data.length);
      });

      ccle.stats(id).then(function (data) {
        $('#mean').html(data.mean);
        $('#std').html(data.std);
        $('#max').html(data.max);
        $('#min').html(data.min);
      });


      var group = Object.keys(allDatasets[id]);

      var color = d3.scale.linear()
        .domain([-10, 0, 10])
        .range(["blue", "white", "red"]);


      var rectBar = d3.select("#leftContainer");
      rectBar.selectAll('rect.barN').remove();

      var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      var nodeInData = allDatasets[id][group[0]];

      var nodeSet = Object.keys(nodeInData);


      nodeNames.forEach(function (d, i) {


        var stdN = {};
        var node = nodeNames[i];
        var nodeId = nodeInfo[i].id;
        var nodeX = nodeInfo[i].x;
        var nodeY = nodeInfo[i].y;
        var nodeH = nodeInfo[i].height;
        var nodeW = nodeInfo[i].width;
        var nodeAvg = 0;
        var varianceAvg = 0;


        // To check if the this node exsists in the data from dataset
        var k = $.inArray(node, nodeSet);
        //   console.log(k);

        if (k != -1) {

          if(groupID == 'all'){

            group.forEach(function (d, i) {


              var valueList = allDatasets[id][group[i]][node].data;

              var statsList = allDatasets[id][group[i]][node].stats;

              //console.log(node,'-->',group[i],"---",statsList.std);
              // console.log(node,'-->',group[i],'std:--',statsList.std,'var:--',Math.pow(statsList.std, 2));
              for (var i = 0; i <= valueList.length - 1; i++) {
                nodeAvg += valueList[i];

              }

              //  varianceAvg += Math.pow(statsList.std, 2);
              varianceAvg += statsList.std;
              // varianceAvg /= statsList.numElements;
              nodeAvg /= statsList.numElements;
              // console.log(valueList);

            });
          }else{

            // console.log("when only one group id selected",groupID);
            // console.log(groupList);

            // console.log(groupList.length);
            for(var g=0;g<groupList.length;g++){

              var valueList = allDatasets[id][groupList[g]][node].data;

              var statsList = allDatasets[id][groupList[g]][node].stats;

//              console.log(node,'-->',groupList[g],"---",statsList.std);
              // console.log(node,'-->',group[i],'std:--',statsList.std,'var:--',Math.pow(statsList.std, 2));
              for (var i = 0; i <= valueList.length - 1; i++) {
                nodeAvg += valueList[i];

              }
              //  varianceAvg += Math.pow(statsList.std, 2);
              varianceAvg += statsList.std;
              // varianceAvg /= statsList.numElements;
              nodeAvg /= statsList.numElements;
            }






          }



          stdN.name = node;
          stdN.std = varianceAvg.toFixed(2);

          stdDevList.push(stdN);

//          console.log(node, '---', nodeAvg, '---', color(nodeAvg), '--->', varianceAvg);

          var selectRectId = "rect[id='" + nodeId + "']";
          d3.select(selectRectId)
            .attr("fill", color(nodeAvg));


          rectBar.append("svg:rect")
            .attr("x", nodeX - nodeW / 2)
            .attr("y", nodeY - nodeH / 2 - 5)
            .attr("class","mapN")
            .attr("height", 5)
            .attr("width", nodeW)
            .attr("style", "stroke:black;stroke-width:1")
            .attr("fill", "none");


          rectBar.append("svg:rect")
            .attr("x", nodeX - nodeW / 2)
            .attr("y", nodeY - nodeH / 2 - 5)
            .attr("class","barN")
            .attr("height", 5)
            .attr("width", varianceAvg)
            .attr("fill", "green");


          rectBar.append("text")
            .attr("x",nodeX - nodeW / 2 + 7)
            .attr("y", nodeY - nodeH / 2 + 15)
            .text(node)
            .attr("class","textN")
            .attr('fill','black')
            .attr("font-family", "Times New Roman")
            .attr("font-size", "13px")
            .on("mouseover", function () {



              div.transition()
                .duration(200)
                .style("opacity", .9);


              div.html(stdN.std)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style("background","#333")
                .style("background","rgba(0,0,0,.8);")
                .style("border-radius","5px")
                .style("color","#fff")
                .style("bottom","26px;")
                .style("padding","5px 15px;")
                .style("left","20%;");

            })
            .on("mouseout", function () {


              div.transition()
                .duration(500)
                .style("opacity", 0);

            });


// CREATING BAR CHART AND ENROUTE REACTION TO MRNA AND COPY NUMBER-------------------------------------------------------------------

          for( var i = 1; i<enrouteNodeName.length; i++)
          {
            // drawBarChart(i,id,node,rectBar,valueList,nodeAvg,varianceAvg);

            l = enrouteNodeY[i] + 10;
            if(node == enrouteNodeName[i])
            {
              var filler = "rect[id='" + enrouteNodeId[i] + "']";
              console.log(valueList);
              for(var i=0; i<valueList.length; i++){

                rectBar.append("svg:rect")
                  .attr("x", enrouteNodeX[i])
                  .attr("y", enrouteNodeY[i]-6)
                  .attr("height", 5)
                  .attr("width", 70)
                  .attr('id',barId)
                  .attr("style", "stroke:black;stroke-width:1")
                  .attr("fill", "none");
                barIdArray.push(barId);
                barId = barId + 1;

                rectBar.append("svg:rect")
                  .attr("x", enrouteNodeX[i])
                  .attr("y", enrouteNodeY[i]-6)
                  .attr('id', barId)
                  .attr("height", 5)
                  .attr("width", varianceAvg * 100)
                  .attr("fill", "green");
                barIdArray.push(barId);
                barId = barId + 1;
//                    d3.select('g').append('line').attr('id',barId).attr('x1',s).attr('y1',enrouteNodeY[i]+10)
//                                  .attr('x2',s+170).attr('y2',enrouteNodeY[i]+10).attr('stroke','black');
                d3.select("g").append('line').attr('id',barId).attr('x1', function(){
                    m = m + 7;
                    return m;
                  })
                  .attr('y1', l)
                  .attr('x2', m)
                  .attr('y2', function(){
                    if (id === 'mrnaexpression'){
                      var y2 = l-(valueList[i]);
                      return y2;
                    }
                    else{
                      var y2 = l-(valueList[i]*30);
                      return y2;
                    }

                  })

                  .attr('stroke',function(){

                    if(valueList[i] > 0)
                    {
                      return 'red';
                    }
                    else if (valueList[i] < 0)
                    {
                      return 'blue';
                    }
                    else
                    {
                      return 'white';
                    }
                  })
                  .attr('stroke-weight', 50);

              }
              m = s;
              barIdArray.push(barId);
              barId = barId + 1;
              d3.select(filler)
                .attr("fill", color(nodeAvg));


            }
          }
        }



      });

    }

  });


  function getInfoDatasets(nodeNames) {

    //console.log("Path Nodes: " + nodeNames);

    var allDatasets = {};

    nodeNames.forEach(function (nodeName, i) {
      ccle.boxplot_of(nodeName, function (res) {
        if (typeof res !== "undefined") {


          Object.keys(res).forEach(function (dataset) {
            Object.keys(res[dataset]).forEach(function (group) {
              allDatasets[dataset] = allDatasets[dataset] || {};
              allDatasets[dataset][group] = allDatasets[dataset][group] || {};
              allDatasets[dataset][group][nodeName] = allDatasets[dataset][group][nodeName] || {};
              allDatasets[dataset][group][nodeName].stats = res[dataset][group].stats;
              allDatasets[dataset][group][nodeName].data = res[dataset][group].data;
            })
          });
        }

        if (i === nodeNames.length - 1) {
          dataReady();
        }

      });
    });

    function dataReady() {
      console.log(allDatasets);
     // logData(dataset,group,node);
    }

    //
    //function logData(dataset, group, node) {
    //  console.log("Dataset: " + dataset + ", Group: " + group + ", Node: " + node + "\nData:" + allDatasets[dataset][group][node].data);
    //}

    return allDatasets;

  }

  function getNodeNames(data) {

    var nodeNames = [];

    $(data).find('entry').each(function () {
      var entry = $(this);
      var type = entry.attr("type");
      if (type === "gene" || type === "compound") {

        var graphics = entry.find('graphics');
        var name = getNodeName($(graphics).attr('name'));
        nodeNames.push(name);
      }
    });

    return nodeNames;

  }

  function getNodeInfo(data) {

    var nodes = [];
    var allNodes = [];
    var nodeIdList = [];

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

        nodeIdList.push(node.id);
        var graphics = entry.find('graphics');
        node.x = $(graphics).attr('x');
        node.y = $(graphics).attr('y');
        node.name = $(graphics).attr('name');
        node.width = $(graphics).attr('width');
        node.height = $(graphics).attr('height');

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

    return nodes;

  }


  function render(parent, data) {

    var nodes = [];
    var allNodes = [];
    var edges = [];
    var nodeMap = {};
    var reactionMap = {};
    var selectedNodes = [];
    var sourceNode = {};
    var targetNode = {};
    // var nodeNames = [];

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

        // var nodeName = getNodeName(node.name);
        //   nodeNames.push(getNodeName(node.name));
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


//   console.log(nodes);
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
      .append("rect").text(function(node){
      var text = node.name;
      var name = String(text);
      var nodeName = name.split(",");
      return nodeName[0]; });

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
      .attr("fill", "transparent")
      .attr("name",function(node){
     /* var text = node.name;
       var name = String(text);
       var nodeName = name.split(",");
       return nodeName[0];
       */
       return node.name;})
      .attr("id", function (node) {
        return node.id;
      })
      .on("mouseover", function (node) {
        var color = d3.select(this).attr("style");
        if (color == "outline: thick solid green;" || color == "outline: thick solid yellow;" || color == "outline: thick solid red;") {

        } else {
          d3.select(this)
            .attr("style", "outline: thick solid orange;")
        }
        div.transition()
          .duration(200)
          .style("opacity", .9);

        var name = node.name;
        // console.log(node.name);
        if(stdDevList.length!=0){

          stdDevList.forEach(function(d){
            if (getNodeName(node.name) === d.name){
              name = d.std;
            }
          });
        }
        div.html(name)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .style("background","#333")
          .style("background","rgba(0,0,0,.8);")
          .style("border-radius","5px")
          .style("color","#fff")
          .style("bottom","26px;")
          .style("padding","5px 15px;")
          .style("left","20%;");
      })
      .on("mouseout", function () {
        var color = d3.select(this).attr("style");
        if (color == "outline: thick solid orange;") {
          d3.select(this)
            .attr("style", "outline: none;");

          div.transition()
            .duration(500)
            .style("opacity", 0);
        } else {
          //alert(color);
        }
      })
      .on("click",function(node){

        if($( "#menu a#pathway" ).attr('selected')|| $("#menu a#enroute").attr('selected')){
          // Create Adjacency Matrix
          var matrix = createAdjacencyMatrix(nodes, edges);
          //console.log(matrix);

          //console.log(NewPath);
          var color = d3.select(this).attr("style");
          if (color == "outline: thick solid yellow;") {
            //alert("SourceNode clicked");
            unselectNodes(parent, '');
            sourceNode = null;
            targetNode = null;
            return;

          }

          if (jQuery.isEmptyObject(sourceNode)) {
            sourceNode = node;
            var SourceNodeTrack = this;
            unselectNodes(parent, this);

          } else {

            targetNode = node;

            var rectSourceId = "rect[id='" + sourceNode.id + "']";
            unselectNodes(parent, rectSourceId);





            //console.log(edges);




          // allPaths(edges,nodes,Queue,visited,paths,sourceNode,targetNode);

          //  AllPaths(edges,nodes,sourceNode,targetNode);
           // var allPaths = AllPaths(matrix, nodes, sourceNode, targetNode);




            var i;
            //CODE FOR SHORTEST PATH ALGORITHM //
            var path = shortestPathAlgo(matrix, nodes, sourceNode, targetNode);
            if (path.length > 2) {

              var edgePoints = [];
              for (i = 0; i < path.length; i += 1) {

                var selectRectId = "rect[id='" + path[i] + "']";

                // console.log(selectRectId);
                if (path[i] != sourceNode.id && path[i] != targetNode.id) {
                  highlightNodes(selectRectId, 'pathNode');
                }
                if (path[i] == targetNode.id) {
                  highlightNodes(selectRectId, 'targetNode');
                }
                if (i != (path.length - 1)) {

                  var edgesCheck = _.filter(edges, function (item) {
                    if (item.source.id == path[i] && item.target.id == path[i + 1]) {
                      return item;
                    }
                  })
                  edgesCheck[0].width = d3.select(selectRectId).attr("width");
                  edgePoints.push(edgesCheck[0]);
                }


              }
              if (!jQuery.isEmptyObject(edgePoints)) {

                drawConnectingLines(parent, edgePoints);

              }
            } else if (path.length == 2) {

              //console.log("only source and target");

              //console.log(path);
              var edgePoints = [];
              var edgesCheck = _.filter(edges, function (item) {
                if (item.source.id == path[0] && item.target.id == path[1]) {
                  return item;
                }
              })


              //console.log(edgesCheck);

              if (!jQuery.isEmptyObject(edgesCheck)) {

                for (i = 0; i < path.length; i += 1) {

                  var selectRectId = "rect[id='" + path[i] + "']";
                  edgesCheck[0].width = d3.select(selectRectId).attr("width");
                  edgePoints.push(edgesCheck[0]);
                }

                if (!jQuery.isEmptyObject(edgePoints)) {
                  drawConnectingLines(parent, edgePoints);
                }
                // console.log(path);
                var selectRectId = "rect[id='" + path[1] + "']";
                highlightNodes(selectRectId, 'targetNode');

              } else {

                // If no path is found, deselect source and target
                for (i = 0; i < path.length; i += 1) {

                  var selectRectId = "rect[id='" + path[i] + "']";
                  highlightNodes(selectRectId, 'none');

                }
                sourceNode = null;
                targetNode = null;

              }
            }
            else {
              if (path[0] == sourceNode.id) {
                unselectNodes(parent, '');
              }
            }

            //sourceNode = node;
            targetNode = null;


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
        } else {
          unselectNodes(parent, '');
          sourceNode = null;
          targetNode = null;
        }


      })

      // Deselecting all selected nodes by double-clicking on any one of the selected nodes.
      .on("dblclick", function () {
        var color = d3.select(this).attr("style");
        if (color == "outline: thick solid green;") {
          d3.selectAll("rect")
            .attr("style", "outline: none;");
          //d3.event.stopPropagation();
        }
      })


// Removed all the red rect and blue lines --------------------
    /*removeRed()
     {
     rect.on("click", function() {
     console.log("rect");
     d3.event.stopPropagation();
     });
     }*/
//---------------------------------------------------------
    check.exit().remove();

// Debug_Mode toggle to show and hide red boxes representing connected nodes:

    $("#menuB a").bind("click", function () {
      //alert($(this.attr("id")));
      var id = $(this).attr("id");

      if ($(this).attr("selected")) {
        $(this).attr("selected", false);
        $(this).attr("style", "background-color: #030101;");

        if (id === "debug_mode") { //If already in debug mode, hide the boxes on click
          var tt = parent.selectAll("rect").data(nodes);
          tt.enter()
            .append("rect")
            .append("svg:title")


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

            .attr("fill", "none")


            .on("mouseover", function (node) {
              var color = d3.select(this).attr("style");
              if (color == "outline: thick solid green;") {

              } else {
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
            .on("mouseout", function () {
              var color = d3.select(this).attr("style");
              if (color == "outline: thick solid orange;") {
                d3.select(this)
                  .attr("style", "outline: none;");

                div.transition()
                  .duration(500)
                  .style("opacity", 0);
              }
            })

          // Removing blue lines that denote the available edges:

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
            .attr("stroke", "none"
            );


        }


      } else { // If not in debug mode, go into the mode by showing the boxes
        $(this).attr("selected", "selected");
        $(this).attr("style", "background-color: #3091ff;");

        //alert("hiMenu")
        var tt = parent.selectAll("rect").data(nodes);
        //var menuId = "debug_mode"
        tt.enter()
          .append("rect")
          .append("svg:title")

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

          .attr("fill", "rgb(255,0,0")


          .on("mouseover", function (node) {
            var color = d3.select(this).attr("style");
            if (color == "outline: thick solid green;") {

            } else {
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
          .on("mouseout", function () {
            var color = d3.select(this).attr("style");
            if (color == "outline: thick solid orange;") {
              d3.select(this)
                .attr("style", "outline: none;");

              div.transition()
                .duration(500)
                .style("opacity", 0);
            } else {

            }
          })
        // In debug mode, the lines show:
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
          .attr("stroke", function (edge) {
            return edge.edgeClass === "relation" ? "rgb(0,0,255)" : "rgb(0,255,0)";
          });
        //.attr("stroke-dasharray", function(edge) {
        //  return edge.edgeClass === "relation" ? "0,0" : "1,20";
        //});
        tt.exit().remove();

      }


    });


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


  // Function to get the First name in a string of gene names
  function getNodeName(name) {
    return name.split(",")[0];
  }


  function createAdjacencyMatrix(nodes, edges) {

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


  function AllPaths(edges,nodes,sourceNode,targetNode){

    var visited = [];

   // bool *visited = new bool[V]
    var path = [];

    var path_index = 0;
    // Initialize all vertices as not visited
    for (var i = 0; i < nodes.length; i++){
      var visit = {};
      visit.id = nodes[i].id;
      visit.visited = false;
      visited.push(visit);
    }

    //console.log(visited);

    getAllPaths(edges,sourceNode, targetNode, visited, path, path_index);
  }

  function  getAllPaths(edges,sourceNode, targetNode, visited, path, path_index){

    // Mark the current node and store it in path[]

   // visited[u] = true;


    visited.forEach(function(d,i){
      if(d.id == sourceNode.id){
        d.visited = true;
      }
    })

    //console.log(visited);
    path[path_index] = sourceNode.id;
    path_index++;

    console.log(path);
    // If current vertex is same as destination, then print
    // current path[]
    if (sourceNode.id == targetNode.id)
    {
      for (var i = 0; i < path_index; i++){
       console.log(path[i])
      }
    }
    else // If current vertex is not destination
    {
      // console.log("here??");
      // Recur for all the vertices adjacent to current vertex
      var v = _.filter(edges, function (item) {
        if (item.source.id == sourceNode.id) {
          return item.target;
        }
      });

      v.forEach(function(val) {

       // console.log(val);

       visited.forEach(function (d) {

          //console.log(d.id,'----',val.target.id);
          if (d.id == val.target.id) {

            //console.log(d.id);
            if (!d.value) {
              getAllPaths(edges, val.target, targetNode, visited, path, path_index);
            }

          }
        })

      });

      // Remove current vertex from path[] and mark it as unvisited
      path_index--;

      visited.forEach(function(d,i){
        if(d.id == sourceNode.id){
          d.visited = false;
        }
      })



    }






  }

  function shortestPathAlgo(matrix, nodes, sourceNode, targetNode) {


    var distance = [];
    var previous = [];
    var Q = [] //LIST OF ALL VERTICES//
    var i;

    //console.log(Q);
    console.log("SourceNode--->", sourceNode);
    console.log("TargetNode--->", targetNode);


    // INITIALIZATION STEP : ALL NODES AS INFINITY //
    for (i = 0; i < nodes.length; i += 1) {

      var dist = {}
      var prev = {}
      dist.id = nodes[i].id;
      dist.value = Infinity;
      prev.id = nodes[i].id;
      prev.value = null;
      distance.push(dist);
      // previous[nodes[i].id] = undefined;
      previous.push(prev);
      Q.push(nodes[i].id);

    }

    // INITIALIZATION STEP : SOURCE NODE AS 0 //
    _.filter(distance, function (item) {
      if (item.id == sourceNode.id) {
        item.value = 0;
      }
    })

//    console.log(previous);

    var S = []; // LIST OF VISITED VERTICES //

    //console.log("iterations",Q.length);
    while (!jQuery.isEmptyObject(Q)) {


      var min = Infinity;

      var pos = 0;
      //console.log("distance Iterations",distance);
      // console.log("previous Iterations",previous);
      //console.log("Q-->",Q,'length-->',Q.length);
      //console.log("S-->",S);
      for (i = 0; i < Q.length; i += 1) {

        var minDist = distance.filter(function (a) {
          return a.id == Q[i]
        })[0];
        var weightValue = minDist.value;

        if (weightValue < min) {
          min = weightValue;
          pos = Q[i];
        }
      }

      // console.log(min,'--',pos);
      var index = $.inArray(pos, Q);

      Q.splice(index, 1);
      S.push(pos);

      // NEIGHBOUR FINDING STEP //

      var v = _.filter(matrix, function (item) {
        if (item.source == pos) {
          return item.target;
        }
      })

      // TERMINATE IF TARGET NODE REACHED //
      var currentDist = distance.filter(function (a) {
        return a.id == pos
      })[0];
      if (currentDist.value == Infinity || pos == targetNode.id) {
        //console.log("stop!!");
        // previous.push(targetNode.id);
        break;
      }

      //console.log(v);

      for (i = 0; i < v.length; i += 1) {

        var neighbourId = v[i].target;
        //console.log("NEXT NEIGHBOUR ID",neighbourId);
        var matrixId = pos + '-' + neighbourId;
        //console.log(matrixId);
        var current = _.filter(matrix, function (item) {
          if (item.id == matrixId) {
            return item;
          }
        })
        // console.log(current[0].weight);
        // console.log("next");
        var alt = currentDist.value + current[0].weight;
        var neighbourDist = distance.filter(function (a) {
          return a.id == neighbourId
        })[0];

        //console.log(alt,'+',neighbourDist.value);
        if (alt < neighbourDist.value) {

          _.filter(distance, function (item) {
            if (item.id == neighbourId) {
              item.value = alt;
            }
          })

          _.filter(previous, function (item) {
            if (item.id == neighbourId) {
              item.value = pos;
            }
          })

          // previous[neighbourId] = pos
        }

      }
    }


    var path = [];
    pos = targetNode.id;
    //
    //console.log("CHERE??");
    // console.log(previous);

    path.push(pos);
    while (pos != sourceNode.id) {

      // console.log("pos",pos);
      var prevNode = _.filter(previous, function (item) {
        if (item.id == pos) {
          return item;
        }
      });

      pos = prevNode[0].value;
      path.push(pos);
    }

    // console.log(path);


    return path.reverse();


  }

  function unselectNodes(parent, selectedNode) {

    var id = selectedNode.id;
    var nodeClickedName = $("rect[id='"+id+"']").attr("name");
    var nodeClickedX = $("rect[id='"+id+"']").attr("x");
    var nodeClickedY = $("rect[id='"+id+"']").attr("y");

    var unselectRect = parent.selectAll("rect");

    var unselectLines = parent.selectAll("line");

    unselectRect.attr("style", "outline: none");

    unselectLines.attr("stroke", "transparent");

    //unselectLines.attr("stroke-width","0");




    if(!jQuery.isEmptyObject(selectedNode)){
     if($( "#menu a#enroute" ).attr('selected'))
     {
           highlightNodes(selectedNode,'sourceNode');

     }
      else
      {
       highlightNodes(selectedNode,'sourceNode');

      }

     }


  }

  function drawConnectingLines(parent, edgePoints) {

    //console.log("entering here???");
    var tt = parent.selectAll("line").data(edgePoints);

    tt.enter()
      .append("line");

    tt.attr("x1", function (edge) {
        return parseInt(edge.source.x) + parseInt(edge.width / 2);
      })
      .attr("y1", function (edge) {

        return edge.source.y;
      })
      .attr("x2", function (edge) {
        return parseInt(edge.target.x) - parseInt(edge.width / 2);
      })
      .attr("y2", function (edge) {
        return edge.target.y;
      })
      .attr("stroke", "green")
      .attr("stroke-width", "5");

  }


  function highlightNodes(nodeH, nodeType) {

    var color = 'none';
    if (nodeType == 'sourceNode') {
      color = 'yellow';
    } else if (nodeType == 'pathNode') {
      color = 'green';
    } else if (nodeType == 'targetNode') {
      color = 'red';
    }
    if($( "#menu a#enroute" ).attr('selected'))
        {
          resetAll(nodeH,nodeType);
          var prop = "outline: thick solid "+color+";";
                    d3.select(nodeH)
                      .attr("style",prop);
        }
        else
        {
             var prop = "outline: thick solid "+color+";";
                 d3.select(nodeH)
                   .attr("style",prop);

        }

  }


// DELETING ENROUTE WHEN A NEW PATH IS SELECTED-------------------------------------------------------

function resetAll(nodeH,nodeType){

console.log('nodeH =',nodeH);
    var nodeClickedName = $(nodeH).attr("name");
    var nodeClickedX = $(nodeH).attr("x");
    var nodeClickedY = $(nodeH).attr("y");




          count++;
          if(nodeType == 'sourceNode')
          {
          b = temp;
          d = temp;
          f = tempF;
          p = 10;
          q = 10;


          for(var i = 0; i<enrouteNodeId.length;i++)
              {
                    var removeId = "rect[id='" + enrouteNodeId[i] + "']";
                    d3.select(removeId).remove();
              }
          for(var i = 0; i<array.length;i++)
                        {
                              var removeId = "text[id='" + array[i] + "']";
                              d3.select(removeId).remove();
                        }
          for(var i = 0; i<geneIdArray.length;i++)
                        {
                              var removeId = "rect[id='" + geneIdArray[i] + "']";
                              d3.select(removeId).remove();
                        }
          for(var i = 0; i<geneTextIdArray.length;i++)
              {
                    var removeId = "text[id='" + geneTextIdArray[i] + "']";
                    d3.select(removeId).remove();
              }

          removeBarChart();

          d3.selectAll('circle').remove();

          }

          drawRectEnroute(nodeClickedName,nodeClickedX,nodeClickedY);
          putTextEnroute(nodeClickedName);
          if(nodeType != 'targetNode')
          {
            drawPathLinesEnroute();
          }



}


function removeBarChart()
{
  for(var i = 0; i<barIdArray.length;i++)
  {
        var removeId = "rect[id='" + barIdArray[i] + "']";
        d3.select(removeId).remove();
  }

}


// RECREATING ENROUTE WHEN NEW PATH IS SELECTED-------------------------------------------------------------------------

function drawRectEnroute(nodeClickedName,nodeClickedX,nodeClickedY)
{
  //alert(id);
  var datasetBar = [1,2,3];
  var firstName = nodeClickedName.split(",");
  d3.select("g").append('rect').transition().attr("fill","none").attr('stroke','black').attr("stroke-width","2.5").attr('id',id)
    .attr("x", a+40).attr("y",b).attr("width",70).attr("height", 20).attr("name",firstName[0]);

    enrouteNodeName.push(firstName[0]);
    enrouteNodeId.push(id);
    enrouteNodeX.push(a+40);
    enrouteNodeY.push(b);

  id = id + 1;
//  if ($( "#menu a#mrnaexpression" ).attr('selected') || $( "#menu a#copynumbervariation" ).attr('selected')) {
//                alert(menuChosen);
//               //menuChosen = id;
//               drawMappings(menuChosen);
//
//        }
   if (firstName.length < 4){
    var len = firstName.length;
   }
   else{
    var len = 4;
   }
  for(var i = 1; i<len; i++)
  { console.log('x1',nodeClickedX,'y1',nodeClickedY,'x2',a+155,'y2',p+10);
    d3.select("g").append('rect').transition().attr("fill","orange").attr('stroke','black').attr("stroke-width","2.5")
        .attr('id',geneId).attr("x", a+155).attr("y",p).attr("width",70).attr("height", 20).attr("name",firstName[i]);
    d3.select("g").append('line').attr('x1', a+110).attr('y1',b+10)
            .attr('x2', a+155).attr('y2',p+10)
            .attr("stroke","#ff884d").attr("stroke-width","0.5");

    p = p + 30;
    geneIdArray.push(geneId);
    geneId = geneId + 1;


  }

  b = b + 80;

}

function putTextEnroute(nodeClickedName)
{
    var firstName = nodeClickedName.split(",");
    d3.select("g").append('text').text(firstName[0]).attr('x',c+49).attr('id',idText)
      .attr('y', d+14).attr('fill','black')
      .attr("font-family", "Times New Roman")
      .attr("font-size", "13px");
    d = d + 80;
    array.push(idText);
    idText = idText + 1;
    if (firstName.length < 4){
        var len = firstName.length;
       }
       else{
        var len = 4;
       }
    for(var i = 1; i<len; i++)
      {
        d3.select("g").append('text').text(firstName[i]).attr('x',a+160)
              .attr('y', q+14).attr('fill','black').attr('id',geneTextId)
              .attr("font-family", "Times New Roman")
              .attr("font-size", "13px");
        geneTextIdArray.push(geneTextId);
        geneTextId = geneTextId + 1;
        q = q + 30;

      }

}

function drawPathLinesEnroute()
{

  for(var i = 0; i < 2; i++){
  d3.select("g").append('line').attr('x1', e+75).attr('y1',f)
    .attr('x2', e+75).attr('y2',f+60)
    .attr("stroke","#ff884d").attr("stroke-width","2.5");
   }
  d3.select('g').append('circle').attr('cx',e+75).attr('cy',f+60).attr('r',3).attr('fill','black');
  f = f +80;
}

// ONLY COMMENTS AFTER THIS POINT ------------------------------- IGNORE FOR NOW ---------------------------------------------------------------

//function displayText(parent,allNodes)
//{
////alert(nodeA.name);
///*d3.select("body").selectAll("text")
//    .data(nodeA)
//    .enter()
//    .append("text")
//    .text(function(nodeA){
//                        var text = nodeA.name;
//                        var name = String(text);
//                        var nodeName = name.split(",");
//                        return nodeName[0];
//                        }).attr('x',a+45)
//                                   .attr('y', b+13)
//                                   .attr('fill','black')
//                                   .attr("font-family", "sans-serif")
//                                   .attr("font-size", "13px");*/
//var checktext = parent.selectAll('rect').data(allNodes);
//   checktext.enter().append('text')
//            .text(function(node){
//              var text = node.name;
//              //alert(text);
//              var name = String(text);
//              var nodeName = name.split(",");
//              return nodeName[0];
//              });
//   checktext.attr("x", function (node) {
//         var x = node.x - node.width / 2;
//         x = x + 7;
//         return x;
//       } )
//         .attr("y", function (node) {
//            var y = node.y - node.height / 2;
//            y = y+13;
//           return y;
//         });
//
//         /*checktext.attr('x',a+45)
//         .attr('y', b+13)*/
//         checktext.attr('fill','transparent')
//         .attr("font-family", "sans-serif")
//         .attr("font-size", "13px");
//}

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
// ----------------------------COMMENTS END HERE-------------------------------

});
