const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const  MongoDB = require('./connect');


const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});


app.get('/products/search', async (req, res) => {
  const limit = parseInt(req.query.limit) || 12; 
  const brand = req.query.brand || null; 
  const price = parseInt(req.query.price) || 0; 
  try {
    collection = await MongoDB.Connect();
    const query = {};
    if (brand) {
      query.brand = brand;
    }
    if (price > 0) {
      query.price = { $lte: price };
    }
    const products = await collection.find(query).sort({ price: 1 }).limit(limit).toArray();
    res.json(products);
  } catch (err) {
    console.error('Error finding products:', err);
    res.status(500).send('Internal server error');
  }
});





app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { ObjectId } = require('mongodb');

  collection = await MongoDB.Connect();

  try {
    const product = await collection.findOne({ _id: ObjectId(id) });
    if (!product) {
      res.status(404).send({ error: 'Product not found' });
    } else {
      res.send(product);
    }
  } catch (error) {
    console.error(`Error finding product by ID: ${error}`);
    res.status(500).send({ error: 'Internal server error' });
  }
});





app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);