const Papa = require("./papaparse.min.js");
const fs = require('fs');
class Connection 
{
    constructor( node1, node2, weight ){
        this.weight = weight;
        this.node1 = node1;
        this.node2 = node2;
    }
}

class Node {
    constructor(){
        this.data = {}
        this.connections = Array();
        this.parent = null;
    }

    addConnection( connection ){
        if (connection.node1.data.uid == connection.node2.data.uid){
            return;
        }
        // Check to see if a connection exists to node2 already
        var result = this.connections.find(con => {
            return con.node2.data.uid == connection.node2.data.uid;
          })
          
        // If the result doesn't exist, then add the connection
        if (result == undefined)
        {
            this.connections.push(connection);
        }
    }

    removeConnection( node ){
        //Find the connection based on the node given, then remove the connection
     var index = this.connections.findIndex(connection => {
        return connection.node2.data.uid === node.data.uid;
      })

      // If the index is not undefined, then it is safe to remove at index
      if (index >= 0)
      {
        this.connections.splice(index, 1);
      }
      else{
        console.log("removeConnection: Connection does not exist to this node");
      }
    }
}

class WeightNode {
    constructor( node, weight ){
        this.node = node;
        this.weight = weight;
    }
}

class NodeGraph {
    constructor(){
        this.nodes = Array();
        this.nodesDict = {};
    }

    addNode( item ){
        item.data.uid = "C" + (this.nodes.length + 1);
        this.nodes.push(item);
        this.nodesDict[item.data.uid] = item;
    }

    
    removeNode( node ){
        var index = this.nodes.findIndex(n => n.data.name === node.data.name);

        if (index < 0){
            console.log("removeNode: Node does not exist");
            return;
        }

        let newconnections = Array()
        // Make connections between all connected nodes
        node.connections.forEach(function(connection)
        {
            //Add this connection to the connections array
            newconnections.push(connection);

            //Find and remove the connection at the other node
            connection.node2.removeConnection(node);
        }, this);

        // Go through the connections and make new connections with the nodes
        newconnections.forEach(function(con1){
            newconnections.forEach(function(con2){
                // Add a connection between the two connections, average the weight of the two connections to get the new weight
                con1.node2.addConnection(new Connection(con1.node2, con2.node2, Math.round(con1.weight / con2.weight)));
            })
        });

        // Finally, remove the node
        this.nodes.splice(index, 1);
    }

    addConnection( node1, node2, weight ){
        node1.addConnection(new Connection(node1, node2, weight));
        node2.addConnection(new Connection(node2, node1, weight));
    }

    removeConnectionByNodes( node1, node2 ){
          node1.removeConnection(node2);
          node2.removeConnection(node1);
    }

    getSortedList( startNode ){
        // Traversing from the start node, find the 
        // shortest paths to nodes and use that to generate a sorted list

        if(startNode == undefined){
            console.log("Can't process an undefined startNode");
            return;
        }

        let visitedNodes = Array();
        visitedNodes.push(startNode);
        let newVisitedNodes = Array();
        let visitedEdges = Array();
        let weightNodes = {};
        let depth = 1;
        let i = 0;

        weightNodes[startNode.data.uid] = 0;
        
        // Get the total number of edges in the graph
        var totalEdges = 0;
        this.nodes.forEach(function(node){
            totalEdges += node.connections.length;
        });

        totalEdges = Math.round(totalEdges / 2);

        while(visitedEdges <= totalEdges){
        //Iterate through each node
        visitedNodes.forEach(function(node){
            // Iterate through each node's connections
            node.connections.forEach(function(connection)
            {
                // Add this connection to the visited edges
                if(!(connection in visitedEdges)){
                    visitedEdges.push(connection);
                }

                // Add the connected node to the list of visited nodes
                newVisitedNodes.push(connection.node2);
                // Get the overall weight from the start node
                var nodeWeight = weightNodes[connection.node1.data.uid] + connection.weight;
                // Add the node into the sorted list
                // If the node already exists
                if(connection.node2.data.uid in weightNodes){
                    // The weight becomes the min of the old weight and new weight
                    var newWeight = Math.min(weightNodes[connection.node2.data.uid], nodeWeight);
                    weightNodes[connection.node2.data.uid] = newWeight;
                }
                else{
                    // Create a new entry for this node with the calculated node weight
                    weightNodes[connection.node2.data.uid] = nodeWeight;
                }
            })
        })
            // Copy the new visited nodes into the visitedNodes array for the next pass
            visitedNodes = newVisitedNodes.slice(0);
            // Clear out the newVisitedNodes for the next pass
            newVisitedNodes = Array();
            i = i + 1;
    }
    var items = Object.keys(weightNodes).map(function(key) {
        return [key, weightNodes[key]];
      });
      
      // Sort the array based on the second element
      items.sort(function(first, second) {
        return second[1] - first[1];
      });

      items = items.map(function(item) {
          return [this.nodesDict[item[0]], item[1]];
      }, this);

    return items;   
    }

}

function main(){
    // Construct the main graph
    var graph = new NodeGraph();

    //The following is valid data for classes:
    //Name, Subject, Teacher, courseNumber, and uid

    // Construct some test classes
    var class1 = new Node();
    class1.data.name = "Class1";
    graph.addNode(class1);

    var class2 = new Node();
    class2.data.name = "Class2";
    graph.addNode(class2);

    var class3 = new Node();
    class3.data.name = "Class3";
    graph.addNode(class3);

    var class4 = new Node();
    class4.data.name = "Class4";
    class4.data.uid = "C4";
    graph.addNode(class4);

    var class5 = new Node();
    class5.data.name = "Class5";
    graph.addNode(class5);

    var class6 = new Node();
    class6.data.name = "Class6";
    graph.addNode(class6);

    var class7 = new Node();
    class7.data.name = "Class7";
    graph.addNode(class7);

    var class8 = new Node();
    class8.data.name = "Class8";
    graph.addNode(class8);

    var class9 = new Node();
    class9.data.name = "Class9";
    graph.addNode(class9);

    var class10 = new Node();
    class10.data.name = "Class10";
    graph.addNode(class10);

    var class11 = new Node();
    class11.data.name = "Class11";
    graph.addNode(class11);

    // Make some connections
    graph.addConnection(class1, class11, 1);
    graph.addConnection(class2, class10, 1);
    graph.addConnection(class3, class9, 1);
    graph.addConnection(class4, class8, 1);
    graph.addConnection(class5, class7, 1);
    graph.addConnection(class6, class6, 1);
    graph.addConnection(class7, class5, 1);
    graph.addConnection(class8, class4, 1);
    graph.addConnection(class9, class3, 1);
    graph.addConnection(class10, class2, 1);
    graph.addConnection(class11, class8, 1);

    graph.addConnection(class1, class7, 1);
    graph.addConnection(class2, class5, 1);


    // Get a sorted list
    var weightList = graph.getSortedList(class1).reverse();

    console.log("Got weighted list: " + weightList);

    console.log("Removing Class 7");

    graph.removeNode(class7);

    var weightList = graph.getSortedList(class1).reverse();

    console.log("Got NEW weighted list: " + weightList);

    console.log("TEst: " + data);

}

function main2(){
 // Construct the main graph
 var graph = new NodeGraph();
 var nodes = Array();
 // Load in CSV

 loadData("./test.csv", onLoadData);
function onLoadData(result){

    var data = result.data;
    var header = data[0];

    var i = 1;
    while(i < data.length){

        var node = new Node();
        Object.keys(header).forEach(function(key){
            node.data[key] = data[i][key];
        });
        
        nodes.push(node);
        graph.addNode(node);
        i += 1;
    }

    makeConnections(nodes, graph);
    // Get a sorted list

    var startNode = nodes[12];

    try{
        var weightList = graph.getSortedList(startNode).reverse();

    }
    catch(err){
        console.log("ERR: " + err);

    }
    console.log("Got weighted list based on start class (" + startNode.data.CourseTitle + ")");
    var i = 0;
    weightList.forEach(function(node){
        console.log("Class " + i + " : " + node[0].data.CourseTitle + " (Weight: " + node[1] + ")");
        i ++;
    });
    
    }

   

}
 


main2();


function loadData(file, func){
    var data = Array();
    var nodes = Array();
    var f = fs.createReadStream(file);
    
    Papa.parse(f, {
        header: true,
        dynamicTyping: true,
        complete: func
    });
}

function makeConnections(nodes, graph){
    nodes.forEach(function(node1){
        // Make equal weight connections for all parameters that are the same between nodes
        nodes.forEach(function(node2){
            var i = 0;
            var weight = 6;
            while(i < Object.values(node1.data).length){
                if(Object.values(node1.data)[i] == Object.values(node2.data)[i]){
                    // Decrement the weight until it is 1
                    if(weight > 1){
                        weight --;
                    }
                }
                i++;
            }
            //Make no connection if the weight is greater than 5
            if(weight < 6){
                graph.addConnection(node1, node2, weight);
            }
        });
    });
}