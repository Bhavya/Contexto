const readline = require('readline');
const ContextoModel = require('./src/index');

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
const model = new ContextoModel(3, ['casual', 'formal']);

// Enhanced training data
const trainingData = [
  { context: 'casual', input: "Hi", response: "Hey there! How's it going?" },
  { context: 'casual', input: "Hey", response: "Hi! What's up?" },
  { context: 'casual', input: "How are you", response: "I'm doing great, thanks for asking! How about you?" },
  { context: 'casual', input: "What's up", response: "Not much, just chatting! What's new with you?" },
  { context: 'casual', input: "Bye", response: "See you later! Take care!" },
  { context: 'casual', input: "What time is it", response: "Let me check the time for you." },
  { context: 'casual', input: "Tell me a joke", response: "Why don't scientists trust atoms? Because they make up everything!" },
  { context: 'casual', input: "How's the weather", response: "I'm not sure, but I hope it's nice where you are!" },
  { context: 'formal', input: "Hello", response: "Good day. How may I assist you?" },
  { context: 'formal', input: "How are you", response: "I'm well, thank you for asking. How may I be of service?" },
  { context: 'formal', input: "Goodbye", response: "Thank you for your time. Have a pleasant day." },
  { context: 'formal', input: "What is the current time", response: "Certainly, I'd be happy to provide you with the current time." },
  { context: 'formal', input: "Can you help me", response: "Of course, I'd be glad to assist you. What do you need help with?" },
  { context: 'formal', input: "Thank you", response: "You're welcome. Is there anything else I can help you with?" },
];

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