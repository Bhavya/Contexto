/**
 * Simple Text Prediction Example
 * ------------------------------
 * This example program demonstrates how to use the ContextoModel class for text prediction.
 * The program trains the model using a dataset and predicts the next word(s) based on user input.
 * 
 * Usage:
 * - Run the program: `node simple-prediction.js`
 * - Type "exit" to end the program.
 * - Type a phrase to see the next word(s) prediction based on the trained model.
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
  const rawData = fs.readFileSync('../datasets/simple-prediction.json');
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

console.log('Text Prediction is ready! Type "exit" to end the program.');
console.log('Type a phrase to see the next word(s) prediction based on the trained model.');

function predictNextWords(input) {
  const prediction = model.predict('default', input);
  return prediction || "No prediction available";
}

function getNextWords(input) {
  let response = input;
  for (let i = 0; i < 5; i++) { // Predict next 5 words
    const nextWord = model.predict('default', response);
    if (!nextWord || nextWord === '<END>') break;
    response += ' ' + nextWord;
  }
  return response;
}

function chat() {
  rl.question('You: ', (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    debugLog(`Predicting next words for: "${input}"`);
    let response = getNextWords(input);
    debugLog(`Prediction: "${response}"`);

    console.log('Prediction:', response);

    // Continue the interaction
    chat();
  });
}

// Start the text prediction
chat();
