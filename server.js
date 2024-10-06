const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');  
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const uri = process.env.MONGODB_URI;
let db, messagesCollection;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db('messagesDB');
    messagesCollection = db.collection('messages');
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('Failed to connect to MongoDB:', err.message));


app.post('/api/messages/respond', async (req, res) => {
    const { customer_id, response, agent_id } = req.body; // Capture customer_id, response, and agent_id

    try {
        // First, find the message by customer_id, agent_id, and status
        const message = await messagesCollection.findOne({
            customer_id: customer_id,
            status: 'pending',
            agent_id: agent_id // Ensure we're responding to the correct message
        });

        if (!message) {
            console.log('No matching message found for customer_id:', customer_id, 'and agent_id:', agent_id);
            return res.status(404).json({ message: 'Message not found or already responded' });
        }

        console.log('Responding to message:', message); // Log the message being responded to

        // Then, update the message status and add the response
        const result = await messagesCollection.updateOne(
            { _id: message._id }, // Use the found message's _id
            { $set: { response: response, status: 'responded' } } // Update response and status
        );

        if (result.modifiedCount > 0) {
            console.log('Message updated successfully:', message._id);
            res.json({ message: 'Response recorded' });
        } else {
            console.log('Failed to update message:', message._id);
            res.status(500).json({ message: 'Failed to update message' });
        }
    } catch (err) {
        console.error('Error responding to the message:', err);
        res.status(500).json({ error: 'Error responding to the message' });
    }
});

  


app.get('/api/messages/next/:agent_id', async (req, res) => {
  const agentId = req.params.agent_id;
  console.log(`Agent ${agentId} is requesting the next message`);

  try {
      const queuedMessages = await messagesCollection.findOne(
          { status: 'queued' },
          { sort: { timestamp: 1 } }
      );

      if (queuedMessages) {
          console.log(`Found queued message: ${queuedMessages._id}`);
          // Now update the status
          await messagesCollection.updateOne(
              { _id: queuedMessages._id },
              { $set: { status: 'pending', agent_id: agentId } }
          );
          res.json(queuedMessages);
      } else {
          console.log('No queued messages available');
          res.status(404).json({ message: 'No queued messages available' });
      }
  } catch (err) {
      console.error('Error fetching the next message:', err);
      res.status(500).json({ error: 'Error fetching message' });
  }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use(express.static('public'));
