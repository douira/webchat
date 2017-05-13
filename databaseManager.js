function extendClass(extender, extended) {
  //class extender extends class extended
  extender.prototype = Object.create(extended.prototype);
}

//manages a database
const DatabaseManager = module.exports = function() {
  //database datasets
  this.db = {};
};
//checks a database name
DatabaseManager.prototype.checkSetName = function(name) {
  if (typeof name !== "string") {
    throw Error("database dataset name must be a string");
  }
};
//check if a set exists
DatabaseManager.prototype.checkSetExists = function(name) {
  if (typeof this.db[name] === "undefined") {
    throw Error("dataset '" + name + "' doesn't exist");
  }
};
//adds a new table
DatabaseManager.prototype.createSet = function(name, type) {
  //check for abnormalities
  this.checkSetName(name);
  if (typeof type !== "string") {
    throw Error("database dataset type must be a string");
  }
  if (typeof DatabaseManager.setTypes[type] === "undefined") {
    throw Error("database type '" + type + "' doesn't exist");
  }

  //create dataset of given type with given name
  this.db[name] = new DatabaseManager.setTypes[type]();
};
//get a dataset with given name
DatabaseManager.prototype.getSet = function(name) {
  this.checkSetName(name);
  this.checkSetExists(name);

  //return set at index
  return this.db[name];
};
//sets are registered to this
DatabaseManager.setTypes = {};

//check for specific data types
function stringTypeCheck(index) {
  //throw error if not string
  if (typeof index !== "string") {
    throw Error("index must be a string");
  }
}
function numberTypeCheck(index) {
  if (typeof index !== "number") {
    throw Error("index must be a number");
  }
}

//dict type dataset
const IndexedSet = function() {
  //object contents in this.data
  this.data = {};
};
//gets the value of an entry
IndexedSet.prototype.getEntry = function(index) {
  this.checkType(index);

  //return the value at given index
  return this.hasIndex(index) ? this.data[index] : undefined;
};
//check if the set includes a given index
IndexedSet.prototype.hasIndex = function(index) {
  this.checkType(index);

  //return wether or not the index is included
  return typeof this.data[index] !== "undefined";
};
//explicitly sets the value of an index
IndexedSet.prototype.setEntry = function(index, value) {
  this.checkType(index);

  //set the value for the given index
  this.data[index] = value;
};
//returns all entries, preserves order
IndexedSet.prototype.getData = function() {
  return this.data;
};

//numeric index set
const OrderedSet = function() {
  IndexedSet.call(this);
  this.data = [];
};
//inherits from IndexedSet
extendClass(OrderedSet, IndexedSet);
//needs a numeric index
OrderedSet.prototype.checkType = numberTypeCheck;
//can add an entry to the end
OrderedSet.prototype.add = function(thing) {
  this.data.push(thing);
};
//register with database manager
DatabaseManager.setTypes.OrderedSet = OrderedSet;

//string index set
const DictSet = function() {
  IndexedSet.call(this);
  this.data = {};
};
//inherits from IndexedSet
extendClass(DictSet, IndexedSet);
//needs a string index
DictSet.prototype.checkType = stringTypeCheck;
//returns data as an array
DictSet.prototype.getArray = function() {
  const arr = [];
  for (const propName in this.data) {
    const entry = {
      name: propName,
      entry: this.data[propName]
    };
    arr.push(entry);
  }
  return arr;
};
//returns entries
DictSet.prototype.getArray = function() {
  const arr = [];
  for (const propName in this.data) {
    arr.push(this.data[propName]);
  }
  return arr;
};
//register with database manager
DatabaseManager.setTypes.DictSet = DictSet;
