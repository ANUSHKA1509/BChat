# BChat: Agent Messaging Application

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## Project Overview
BChat is a messaging application designed for agents to interact with customers. It facilitates real-time communication by allowing agents to receive messages, respond, and maintain a chat history for future reference. The interface is user-friendly and resembles popular chat applications, providing a seamless experience for agents.

## Features
- **Real-time Messaging**: Agents can receive and respond to messages in real-time.
- **Responsive Design**: The application is designed to work on various screen sizes.
- **User-Friendly Interface**: The layout is intuitive, making it easy for agents to manage conversations.
- **Timestamped Messages**: Each message and response is timestamped for better context.
- **Error Handling**: Provides feedback for no messages available and input validation.

## Installation
To run the BChat application locally, follow these steps:

### Prerequisites
- Node.js (version 14.x or higher)
- MongoDB (for storing messages)
- Git (optional, for cloning the repository)

### Steps
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd bchat
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add your MongoDB connection URI:
   ```plaintext
   MONGODB_URI=<your-mongodb-uri>
   ```

4. **Run the Server**:
   Start the server:
   ```bash
   node server.js
   ```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000/` to access 

## Usage
1. **Agent ID**: Enter your Agent ID on the home page to start receiving messages.
2. **Receive Messages**: New messages will appear in the main message area.
3. **Respond to Messages**: Type your response in the provided text area and click "Send" to respond.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Environment Variables**: dotenv

## Contributing
Contributions are welcome! If you have suggestions for improvements or features, feel free to open an issue or submit a pull request.
