const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.MONGODB_URI;
let db;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db('messagesDB');
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error(err));

// Fetch all messages
app.get('/api/messages', (req, res) => {
  db.collection('messages').find().toArray((err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add a new message
app.post('/api/messages', (req, res) => {
  const { customer_id, message } = req.body;
  db.collection('messages').insertOne({ customer_id, message, agent_id: null, response: null, status: 'pending' }, (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertedId });
  });
});

// Respond to a message
app.post('/api/messages/respond', (req, res) => {
  const { id, agent_id, response } = req.body;
  db.collection('messages').updateOne({ _id: new ObjectId(id) }, { $set: { agent_id, response, status: 'responded' } }, (err, result) => {
    if (err) throw err;
    res.json({ message: 'Response added successfully' });
  });
});

// Work: Assign the first pending message to an agent
app.post('/api/messages/assign', (req, res) => {
  const { agent_id } = req.body;
  db.collection('messages').findOneAndUpdate({ agent_id: null, status: 'pending' }, { $set: { agent_id } }, { returnOriginal: false }, (err, result) => {
    if (err) throw err;
    if (result.value) {
      res.json({ message: 'Message assigned', message_id: result.value._id });
    } else {
      res.json({ message: 'No pending messages' });
    }
  });
});

// Search messages
app.get('/api/messages/search', (req, res) => {
  const { query } = req.query;
  db.collection('messages').find({ message: { $regex: query, $options: 'i' } }).toArray((err, results) => {
    if (err) throw err;
    res.json(results);
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(express.static('public'));

