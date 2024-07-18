const ContextoModel = require('./src/index');

// Create a new model
const model = new ContextoModel(4, ['formal', 'casual']);

// Train the model
console.log('Training the model...');
model.train('This is a formal business letter.', 'formal');
model.train('We regret to inform you that your application was not successful.', 'formal');
model.train('Please find enclosed the requested documents.', 'formal');
model.train('Thank you for your interest in our company.', 'formal');
model.train('We look forward to hearing from you soon.', 'formal');
model.train('Hey, what\'s up dude?', 'casual');
model.train('Catch you later, gonna grab some pizza.', 'casual');
model.train('Wanna hang out tonight?', 'casual');
model.train('This party is gonna be lit!', 'casual');
model.train('I\'m so excited for the weekend.', 'casual');

// Add specific training data for time-related queries
model.train('What time is it now?', 'casual');
model.train('Could you tell me the current time?', 'formal');
model.train('Do you know what time it is?', 'casual');
model.train('Would you be so kind as to provide the current time?', 'formal');
model.train('Hey, can you check the time for me?', 'casual');
model.train('Please call the gettime function.', 'formal');
model.train('Let\'s call gettime to check the current time.', 'casual');

// Register the getTime function
model.registerFunction('gettime', () => new Date().toLocaleTimeString(), 'Get current time');

// Generate responses with potential function calls
console.log('\nGenerating responses with potential function calls:');
console.log('Casual context: "What time" →', model.generateResponse('casual', 'What time', 15));
console.log('Formal context: "Could you tell me" →', model.generateResponse('formal', 'Could you tell me', 15));
console.log('Casual context: "Hey, can you check" →', model.generateResponse('casual', 'Hey, can you check', 15));
console.log('Formal context: "Would you be so kind" →', model.generateResponse('formal', 'Would you be so kind', 15));

// Test direct function call trigger
console.log('\nTesting direct function call trigger:');
console.log('Casual context: "Call gettime function" →', model.generateResponse('casual', 'Call gettime function', 15));
console.log('Formal context: "Please call the gettime function" →', model.generateResponse('formal', 'Please call the gettime function', 15));
console.log('Casual context: "Let\'s call gettime" →', model.generateResponse('casual', 'Let\'s call gettime', 15));

console.log('\nQuick test completed!');