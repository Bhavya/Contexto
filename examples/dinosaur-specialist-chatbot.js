/**
 * Dinosaur Specialist Chatbot
 * ------------------------------
 * This example program demonstrates how to create a chatbot specialized in dinosaurs using the ContextoModel class.
 * The program trains the model using a dataset and responds to user queries about dinosaurs.
 * 
 * Usage:
 * - Run the program: `node dinosaur-chatbot.js`
 * - Type "exit" to end the program.
 * - Ask questions about dinosaurs to receive informative responses.
 *
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

// Initialize the context-aware model with n-gram size 3 and the 'default' context
const model = new ContextoModel(3, ['default']);

// Load the dataset
let trainingData;
try {
  const rawData = fs.readFileSync('../datasets/dinosaur-subject-matter.json');
  trainingData = JSON.parse(rawData);
  console.log('Dataset loaded successfully.');
} catch (error) {
  console.error('Error loading the dataset:', error);
  process.exit(1);
}

// Train the model using the dataset
debugLog('Training the model...');
trainingData.forEach(item => {
  model.train(`${item.input} ${item.response}`, item.context);
});

console.log('Dinosaur Specialist Chatbot is ready! Type "exit" to end the conversation.');
console.log('Ask questions about dinosaurs to receive informative responses.');

function generateResponse(input) {
  const response = model.generateResponse('default', `${input} =>`, 30);
  const parts = response.split('=>');
  if (parts.length > 1) {
    return parts[1].trim();
  }
  return response;
}

function chat() {
  rl.question('You: ', (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    debugLog(`Generating response for: "${input}"`);
    let response = generateResponse(input);
    debugLog(`Generated response: "${response}"`);

    console.log('DinoBot:', response);

    // Continue the conversation
    chat();
  });
}

// Start the chat
chat();