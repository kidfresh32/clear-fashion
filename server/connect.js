
const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://arthurclavier:arthurclavier@cluster0.orr4ybr.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_COLLECTION_NAME = 'clearfashion_collection';
const fs = require('fs');
const { connect } = require('http2');
//const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
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
}

async function insertProductsMongoDB(){
    await Connect();
    console.log("Inserting products to the MongoDB database");
    const products_to_insert = JSON.parse(fs.readFileSync('data_montlimart.json'));
    const inserted_products = await collection.insertMany(products_to_insert);
    console.log(inserted_products);
    process.exit(0);
}

async function findByName(Name) {
    await Connect();
    const products = await db.collection(MONGODB_COLLECTION_NAME).find({ name: Name }).toArray();
    console.log(products);
  }


async function findByPrice(maxPrice) {
  await Connect();
  const products = await globaldb.collection(MONGODB_COLLECTION_NAME).find({ price: { $lt: maxPrice } }).toArray();
  console.log(products);
}

async function sortByPrice() {
    await Connect();
    db =  client.db(MONGODB_DB_NAME)
    const products = await db.collection(MONGODB_COLLECTION_NAME).find().sort({ price: 1 }).toArray();
    console.log(products);
  }
 
async function sortByDate() {
  await Connect();
  db =  client.db(MONGODB_DB_NAME)
  const products = await db.collection(MONGODB_COLLECTION_NAME).find().sort({ date: -1 }).toArray();
  console.log(products);
}

async function findByScrapedDate() {
    await Connect();
    db =  client.db(MONGODB_DB_NAME)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const products = await db.collection(MONGODB_COLLECTION_NAME).find({ date: { $lte: twoWeeksAgo } }).toArray();
    console.log(products);
  }
  


//Connect();
//insertProductsMongoDB();
//findByPrice(50);
//sortByPrice();
//sortByDate();
findByScrapedDate();
//findByName("PULL POLLEN");