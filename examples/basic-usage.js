const ContextoModel = require('../src/index');

// Create a new Contexto model with trigrams (n=3)
const model = new ContextoModel(3, ['formal', 'casual']);

// Train the model with some example sentences
console.log('Training the model...');
model.train('This is a formal business letter.', 'formal');
model.train('We regret to inform you that your application was not successful.', 'formal');
model.train('Hey, what\'s up dude?', 'casual');
model.train('Catch you later, gonna grab some pizza.', 'casual');

// Make predictions
console.log('\nMaking predictions:');
console.log('Formal context:');
console.log('  Input: "This is a"');
console.log('  Prediction:', model.predict('formal', 'This is a'));

console.log('\nCasual context:');
console.log('  Input: "Hey, what\'s"');
console.log('  Prediction:', model.predict('casual', 'Hey, what\'s'));

// Generate responses
console.log('\nGenerating responses:');
console.log('Formal context:');
console.log('  Input: "We regret to"');
console.log('  Generated:', model.generateResponse('formal', 'We regret to'));

console.log('\nCasual context:');
console.log('  Input: "Catch you"');
console.log('  Generated:', model.generateResponse('casual', 'Catch you'));

// Save the model
model.save('basic_model.json');
console.log('\nModel saved to basic_model.json');

// Load the model
const loadedModel = new ContextoModel(3);
loadedModel.load('basic_model.json');
console.log('Model loaded from basic_model.json');

// Test the loaded model
console.log('\nTesting loaded model:');
console.log('  Input: "This is a"');
console.log('  Prediction:', loadedModel.predict('formal', 'This is a'));