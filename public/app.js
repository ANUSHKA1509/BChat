const API_URL = 'http://localhost:3000/api';
let agentId = null;
let currentMessageId = null;
let currentMessageCustomerId = null;

// Function to get query parameters from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// On page load, check if we are in the chat interface
window.onload = function() {
    // Get agentId from the URL
    agentId = getQueryParam('agentId');
    if (agentId) {
        document.getElementById('agent-id-display').innerText = agentId; // Display agent ID if available
        loadNextMessage(); // Fetch the first message if in chat interface
    } else {
        alert('Agent ID is missing.');
    }
};

// Fetch the next available message for this agent
function loadNextMessage() {
    fetch(`${API_URL}/messages/next/${agentId}`)
        .then(response => response.json())
        .then(data => {
            if (data._id) {
                currentMessageId = data._id;
                currentMessageCustomerId = data.customer_id; // Store customer ID
                const messageBox = document.getElementById('message-box');
                messageBox.innerHTML = `<p><strong>Customer ${data.customer_id}:</strong> ${data.message}</p>
                                        <p><em>Received at: ${new Date(data.timestamp).toLocaleString()}</em></p>`;
            }
        })
        .catch(err => {
            console.error('Error fetching message:', err);
            alert('No queued messages available.');
        });
}

// Respond to the current message
function respondToMessage() {
    document.getElementById('response-form-container').style.display = 'block';
    document.getElementById('respond-btn').style.display = 'none';
}

// Send response to the current message
function sendResponse() {
    const responseText = document.getElementById('response-text').value;
    if (!responseText) {
        alert('Please enter a response.');
        return;
    }

    fetch(`${API_URL}/messages/respond`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            customer_id: currentMessageCustomerId, // Use the variable that holds the customer ID
            response: responseText,
            agent_id: agentId,
        }),
    })
        .then(response => response.json())
        .then(() => {
            document.getElementById('response-text').value = ''; // Clear text box
            document.getElementById('response-form-container').style.display = 'none';
            document.getElementById('respond-btn').style.display = 'block';
            loadNextMessage(); // Load the next queued message
        })
        .catch(err => console.error('Error sending response:', err));
};
