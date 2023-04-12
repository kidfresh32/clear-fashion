
const {MongoClient} = require('mongodb');
const { connect } = require('http2');

const MONGODB_URI = 'mongodb+srv://arthurclavier:arthurclavier@cluster0.orr4ybr.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_COLLECTION_NAME = 'clearfashion_collection';
const fs = require('fs');

var globalcollection = null;
var globaldb = null;
var globalclient = null


async function Connect() {
    console.log("Connecting...");
    client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    db =  client.db(MONGODB_DB_NAME)
    collection = db.collection(MONGODB_COLLECTION_NAME);
    const count = await collection.countDocuments();
    console.log(count);
    globalcollection = collection;
    globaldb = db;
    globalclient = client;
    console.log("Connected!");
    return collection;
}


async function insertProductsMongoDB(){
    collection = await Connect();
    console.log("Inserting products to the MongoDB database");
    const products_to_insert = JSON.parse(fs.readFileSync('data_montlimart.json'));
    const inserted_products = await collection.insertMany(products_to_insert);
    const products_to_insert2 = JSON.parse(fs.readFileSync('data_Dedicated.json'));
    const inserted_products2 = await collection.insertMany(products_to_insert2);
    const products_to_insert3 = JSON.parse(fs.readFileSync('data_circle.json'));
    const inserted_products3 = await collection.insertMany(products_to_insert3);
    console.log(inserted_products);
    console.log(inserted_products2);
    console.log(inserted_products3);
    process.exit(0);
    //module.exports = {globalcollection,globaldb,globalclient};
}

async function findByBrand(Name) {
    const collection = await Connect();
    const products = await collection.find({ brand: Name }).toArray();
    console.log(products);
    //module.exports = {globalcollection,globaldb,globalclient};
  }


async function findByPrice(maxPrice) {
  const collection = await Connect();
  const products = await collection.find({ price: { $lt: maxPrice } }).toArray();
  console.log(products);
  //module.exports = {globalcollection,globaldb,globalclient};
}

async function sortByPrice() {
  const collection =await Connect();
    db =  client.db(MONGODB_DB_NAME)
    const products = await collection.find().sort({ price: 1 }).toArray();
    console.log(products);
    //module.exports = {globalcollection,globaldb,globalclient};

  }
 
async function sortByDate() {
  const collection = await Connect();
  db =  client.db(MONGODB_DB_NAME)
  const products = await collection.find().sort({ date: -1 }).toArray();
  console.log(products);
  //module.exports = {globalcollection,globaldb,globalclient};
}

async function findByScrapedDate() { 
    const collection =await Connect();
    db =  client.db(MONGODB_DB_NAME)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const products = await collection.find({ date: { $lte: twoWeeksAgo } }).toArray();
    console.log(products);
   
  }
  
async function findAll() {
    const collection =await Connect();
    db =  client.db(MONGODB_DB_NAME)
    const products = await collection.find().toArray();
    console.log(products);
    
  }

  module.exports = {Connect, findAll};



