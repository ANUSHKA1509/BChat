const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');
const moment = require('moment'); 
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('messagesDB');
    const messagesCollection = db.collection('messages');

    function insertMessage(customer_id, message, timestamp) {
      const formattedTimestamp = moment(timestamp, 'DD-MM-YYYY HH:mm:ss').toDate();

      return messagesCollection.insertOne({
        customer_id,
        message,
        timestamp: formattedTimestamp,
        agent_id: null,
        response: null,
        status: 'pending',
      });
    }

    // Read and parse the CSV file
    const insertionPromises = [];
    fs.createReadStream('GeneralistRails_Project_MessageData.csv')
      .pipe(csv())
      .on('data', (row) => {
        // Assuming the CSV has columns named UserID, Message Body, and Timestamp (UTC)
        if (row['User ID'] && row['Message Body'] && row['Timestamp (UTC)']) {
          insertionPromises.push(insertMessage(row['User ID'], row['Message Body'], row['Timestamp (UTC)']));
        } else {
          console.error('Invalid row format:', row);
        }
      })
      .on('end', async () => {
        console.log('CSV file successfully processed');
        try {
          // Wait for all the insertions to complete before closing the client
          await Promise.all(insertionPromises);
          console.log('All messages inserted');
        } catch (err) {
          console.error('Error inserting messages:', err.message);
        } finally {
          await client.close();
        }
      });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
}

run();
