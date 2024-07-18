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

// Make predictions
console.log('\nMaking predictions:');
for (let i = 0; i < 3; i++) {
    console.log('Formal context: "This is" →', model.predict('formal', 'This is'));
    console.log('Formal context: "We regret to" →', model.predict('formal', 'We regret to'));
    console.log('Casual context: "Hey, what\'s" →', model.predict('casual', 'Hey, what\'s'));
    console.log('Casual context: "Catch you" →', model.predict('casual', 'Catch you'));
}

// Generate responses
console.log('\nGenerating responses:');
console.log('Formal context: "We regret to inform you" →', model.generateResponse('formal', 'We regret to inform you', 15));
console.log('Formal context: "Thank you for your" →', model.generateResponse('formal', 'Thank you for your', 15));
console.log('Casual context: "Catch you later" →', model.generateResponse('casual', 'Catch you later', 15));
console.log('Casual context: "This party is" →', model.generateResponse('casual', 'This party is', 15));

// Register a function
model.registerFunction('getTime', () => new Date().toLocaleTimeString(), 'Get current time');

// Generate response with potential function call
console.log('\nGenerating response with potential function call:');
console.log('Casual context: "What time" →', model.generateResponse('casual', 'What time', 15));

console.log('\nQuick test completed!');