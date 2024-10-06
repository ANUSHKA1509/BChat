const API_URL = 'http://localhost:5000/api';


// Fetch all messages and display them
function loadMessages() {
    fetch(`${API_URL}/messages`)
        .then(response => response.json())
        .then(data => {
            const messageList = document.getElementById('message-list');
            messageList.innerHTML = '';
            data.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';
                
                const date = new Date(message.timestamp); // Convert timestamp to Date object
                
                messageDiv.innerHTML = `
                    <p><strong>Customer ${message.customer_id}:</strong> ${message.message}</p>
                    <p><em>Received at: ${date.toLocaleString()}</em></p>
                    ${message.response ? `<p><strong>Response:</strong> ${message.response}</p>` : ''}
                    ${!message.response ? `<button onclick="openResponseForm('${message._id}')">Respond</button>` : ''}
                `;
                messageList.appendChild(messageDiv);
            });
        });
}


// Respond to a message
function openResponseForm(messageId) {
    document.getElementById('message-id').value = messageId;
}

document.getElementById('response-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const messageId = document.getElementById('message-id').value;
    const responseText = document.getElementById('response-text').value;

    fetch(`${API_URL}/messages/respond`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: messageId,
            agent_id: 'agent123',  // Hardcoded agent ID
            response: responseText
        })
    }).then(() => {
        loadMessages();
    });
});

// Search messages
function searchMessages() {
    const query = document.getElementById('search-bar').value;
    fetch(`${API_URL}/messages/search?query=${query}`)
        .then(response => response.json())
        .then(data => {
            const messageList = document.getElementById('message-list');
            messageList.innerHTML = '';
            data.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';
                messageDiv.innerHTML = `
                    <p><strong>Customer ${message.customer_id}:</strong> ${message.message}</p>
                    ${message.response ? `<p><strong>Response:</strong> ${message.response}</p>` : ''}
                    ${!message.response ? `<button onclick="openResponseForm('${message._id}')">Respond</button>` : ''}
                `;
                messageList.appendChild(messageDiv);
            });
        });
}

// Add a new message
app.post('/api/messages', (req, res) => {
    const { customer_id, message, timestamp } = req.body;
    db.collection('messages').insertOne(
      { 
        customer_id, 
        message, 
        timestamp: new Date(timestamp), // Store timestamp as a date object
        agent_id: null, 
        response: null, 
        status: 'pending' 
      }, 
      (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertedId });
      }
    );
  });
  

// Initially load all messages
loadMessages();
