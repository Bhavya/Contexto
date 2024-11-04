/**
 * Chatbot with Streaming
 * ----------------------
 * This example program demonstrates how to create a simple context-aware chatbot using an n-gram based language model.
 * The chatbot can switch between 'casual' and 'formal' contexts and has a basic understanding of user input.
 * 
 * Features:
 * - Context-aware responses: The chatbot can switch between 'casual' and 'formal' contexts based on user input.
 * - Debug mode: Toggle debug mode on and off to log additional information for troubleshooting.
 * - Function registration: The chatbot can call registered functions, such as getting the current time.
 * - Dataset loading: Train the chatbot using a dataset loaded from a JSON file.
 * - Streaming responses: Generate responses in a streaming fashion, yielding parts of the response as they are generated.
 * 
 * Usage:
 * - Run the program: `node shop-assistant-chatbot.js`
 * - Type "exit" to end the conversation.
 * - Type "debug on" to enable debug mode or "debug off" to disable it.
 * - Switch context by including the words "formal" or "casual" in your input.
 * - The chatbot responds to user input based on the trained dataset and the current context.
 * 
 * Dependencies:
 * - readline: Node.js module to read input from the console.
 * - fs: Node.js module to handle file system operations.
 * - ContextoModel: Custom module implementing the context-aware n-gram language model.
 */

const readline = require('readline');
const ContextoModel = require('../src/index'); // Ensure this path is correct
const fs = require('fs');

// Debug mode flag
let DEBUG_MODE = false;

// Debug logger function
function debugLog(...args) {
  if (DEBUG_MODE) {
    console.log(...args);
  }
}

// Create an interface for reading input from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initialize the context-aware model with n-gram size 3 and the 'casual' context
const model = new ContextoModel(3, ['formal','casual']);

// Load the dataset
let trainingData;
try {
  const rawData = fs.readFileSync('../datasets/generic-chatbot.json');
  trainingData = JSON.parse(rawData);
  console.log('Dataset loaded successfully.');
} catch (error) {
  console.error('Error loading the dataset:', error);
  process.exit(1);
}

// Train the model using the dataset
debugLog('Training the chatbot...');
trainingData.forEach(item => {
  model.train(`${item.input} => ${item.response}`, item.context);
});

// Register a function to get the current time
model.registerFunction('gettime', () => new Date().toLocaleTimeString(), 'Get current time');

console.log('Chatbot is ready! Type "exit" to end the conversation.');
console.log('Type "debug on" to enable debug mode or "debug off" to disable it.');

let context = 'casual'; // Default context

// Function to generate a response based on user input using a generator for streaming
async function generateResponse(input) {
  const responseStream = model.generateResponseStream(context, `${input} =>`, 30);
  for (let response of responseStream) {
    await new Promise(r => setTimeout(r, 100)); // Simulate delay for streaming effect
    process.stdout.write(response + ' ');
  }
  process.stdout.write('\n');
}

// Main chat function
function chat() {
  rl.question('You: ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    // Toggle debug mode
    if (input.toLowerCase() === 'debug on') {
      DEBUG_MODE = true;
      console.log("Debug mode enabled.");
      chat();
      return;
    } else if (input.toLowerCase() === 'debug off') {
      DEBUG_MODE = false;
      console.log("Debug mode disabled.");
      chat();
      return;
    }

    // Switch context based on user input
    if (input.toLowerCase().includes('formal')) {
      context = 'formal';
      console.log("Chatbot: Switching to formal context.");
    } else if (input.toLowerCase().includes('casual')) {
      context = 'casual';
      console.log("Chatbot: Switching to casual context.");
    }

    // Generate and log the response
    debugLog(`Generating response for: "${input}" in context: ${context}`);
    await generateResponse(input);

    // Continue the conversation
    chat();
  });
}

// Start the chat
chat();
