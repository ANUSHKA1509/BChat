const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function updateMessagesStatus() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db('messagesDB');
        const messagesCollection = db.collection('messages');

        const result = await messagesCollection.updateMany(
            { status: "pending" },
            { $set: { status: "queued" } }
        );

        console.log(`${result.modifiedCount} messages updated to 'queued'.`);
    } catch (err) {
        console.error('Error updating messages:', err);
    } finally {
        await client.close();
    }
}

updateMessagesStatus();
