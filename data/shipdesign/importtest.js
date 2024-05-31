'use strict';

const db = require('@arangodb').db;
const databaseName = 'shipdesign';
const user = 'ship';
const passwd = 'ship1234';

// Create a new database (remove if the previous exists)
if (db._databases().includes(databaseName)) {
    console.log("Drop " + databaseName + " database");
    db._dropDatabase(databaseName);
}

db._createDatabase(
    databaseName, 
    {},
    [{ 
        username: user, 
        passwd: passwd,
        active: true
    }]);
db._useDatabase(databaseName);

// Create all node collections used in Shakespeare example
// Each collection represents a node type
db._create("MonthDue");
db._create("ShipLC");
db._create("Systems");
db._create("Description");
db._create("Team");
db._create("NameResponsible");
db._create("BasedAt");

// Create all edge collections used in Shakespeare example
// Each collection represents a edge relation between different node types
db._createEdgeCollection("WITHINLCPHASE");
db._createEdgeCollection("DUEBYMONTH");
db._createEdgeCollection("PARTOF");
db._createEdgeCollection("ASSIGNEDTO");
db._createEdgeCollection("MEMBEROF");
db._createEdgeCollection("BASEDAT");

// Nodes
const nodes = require(__dirname + "/nodesshipdesign.json");
db.MonthDue.save(nodes["MonthDue"]);
db.ShipLC.save(nodes["ShipLC"]);
db.Systems.save(nodes["Systems"]);
db.Description.save(nodes["Description"]);
db.Team.save(nodes["Team"]);
db.NameResponsible.save(nodes["NameResponsible"]);
db.BasedAt.save(nodes["BasedAt"]);

// Edges
const edges = require(__dirname + "/edgesshipdesign.json");
db.WITHINLCPHASE.save(edges["WITHINLCPHASE"]);
db.DUEBYMONTH.save(edges["DUEBYMONTH"]);
db.PARTOF.save(edges["PARTOF"]);
db.ASSIGNEDTO.save(edges["ASSIGNEDTO"]);
db.MEMBEROF.save(edges["MEMBEROF"]);
db.BASEDAT.save(edges["BASEDAT"]);

// Create views
var graph_module =  require("org/arangodb/general-graph");
var graph = graph_module._create("shipdesign");

// Add top level documents
graph._addVertexCollection("MonthDue");
graph._addVertexCollection("ShipLC");
graph._addVertexCollection("Systems");
graph._addVertexCollection("Description");
graph._addVertexCollection("Team");
graph._addVertexCollection("NameResponsible");
graph._addVertexCollection("BasedAt");

graph._extendEdgeDefinitions(graph_module._relation("WITHINLCPHASE", ["Systems"], ["ShipLC"]));
graph._extendEdgeDefinitions(graph_module._relation("DUEBYMONTH", ["Description"], ["MonthDue"]));
graph._extendEdgeDefinitions(graph_module._relation("PARTOF", ["Description"], ["Systems"]));
graph._extendEdgeDefinitions(graph_module._relation("ASSIGNEDTO", ["Description"], ["NameResponsible"]));
graph._extendEdgeDefinitions(graph_module._relation("MEMBEROF", ["NameResponsible"], ["Team"]));
graph._extendEdgeDefinitions(graph_module._relation("BASEDAT", ["NameResponsible"], ["BasedAt"]));
