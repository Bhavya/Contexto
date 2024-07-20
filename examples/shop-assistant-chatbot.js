const readline = require('readline');
const ContextoModel = require('../src/index');
const fs = require('fs');

// Debug mode flag
let DEBUG_MODE = false;

// Debug logger function
function debugLog(...args) {
    if (DEBUG_MODE) {
        console.log(...args);
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Create the model
const model = new ContextoModel(3, ['formal', 'casual']); // Include both contexts

// Load the dataset
let trainingData;
try {
    const rawData = fs.readFileSync('../datasets/assistive-chatbot.json');
    trainingData = JSON.parse(rawData);
    console.log('Dataset loaded successfully.');
} catch (error) {
    console.error('Error loading the dataset:', error);
    process.exit(1);
}

// Train the model
debugLog('Training the chatbot...');
trainingData.forEach(item => {
    model.train(`${item.input} => ${item.response}`, item.context);
});

// Register the getTime function
model.registerFunction('gettime', () => new Date().toLocaleTimeString(), 'Get current time');

console.log('Chatbot is ready! Type "exit" to end the conversation.');
console.log('Type "debug on" to enable debug mode or "debug off" to disable it.');

let context = 'casual'; // Default context

function generateResponse(input) {
    const response = model.generateResponse(context, `${input} =>`, 30);
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

        // Debug mode toggle
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

        // Context switching
        if (input.toLowerCase().includes('formal')) {
            context = 'formal';
            console.log("Chatbot: Switching to formal context.");
        } else if (input.toLowerCase().includes('casual')) {
            context = 'casual';
            console.log("Chatbot: Switching to casual context.");
        }

        debugLog(`Generating response for: "${input}" in context: ${context}`);
        let response = generateResponse(input);
        debugLog(`Generated response: "${response}"`);

        // Check for time-related queries
        if (input.toLowerCase().includes('time') && !response.includes('[Function Call: gettime]')) {
            response += ` [Function Call: gettime] Result: ${new Date().toLocaleTimeString()}`;
        }

        console.log('Chatbot:', response);

        chat(); // Continue the conversation
    });
}

// Start the chat
chat();
