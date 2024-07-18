const ContextoModel = require('../src/index');

// Create a new Contexto model with quadgrams (n=4)
const model = new ContextoModel(4, ['tech', 'finance', 'general']);

// Train the model with more complex sentences
console.log('Training the model...');
model.train('The new AI model uses advanced neural networks for natural language processing.', 'tech');
model.train('Quantum computing is revolutionizing cryptography and data security.', 'tech');
model.train('The stock market showed significant volatility due to geopolitical tensions.', 'finance');
model.train('Cryptocurrency regulations are evolving rapidly in different jurisdictions.', 'finance');
model.train('Climate change is affecting global weather patterns and ecosystems.', 'general');
model.train('The Olympics showcase extraordinary athletic achievements from around the world.', 'general');

// Register some functions
model.registerFunction('getStockPrice', (stock) => {
  // This would typically involve an API call
  const mockPrices = { 'AAPL': 150.25, 'GOOGL': 2750.80, 'MSFT': 305.60 };
  return mockPrices[stock] || 'Unknown stock';
}, 'Get current stock price');

model.registerFunction('convertCurrency', (amount, from, to) => {
  // This would typically involve an API call
  const mockRates = { 'USD_EUR': 0.85, 'EUR_USD': 1.18, 'USD_JPY': 110.5 };
  const rate = mockRates[`${from}_${to}`] || 1;
  return (parseFloat(amount) * rate).toFixed(2);
}, 'Convert currency');

// Make predictions and generate responses with function calls
console.log('\nGenerating responses with potential function calls:');

console.log('Tech context:');
console.log('  Input: "The new AI model"');
console.log('  Generated:', model.generateResponse('tech', 'The new AI model'));

console.log('\nFinance context:');
console.log('  Input: "What is the stock price of AAPL"');
console.log('  Generated:', model.generateResponse('finance', 'What is the stock price of AAPL'));

console.log('\nFinance context:');
console.log('  Input: "Convert 100 USD to EUR"');
console.log('  Generated:', model.generateResponse('finance', 'Convert 100 USD to EUR'));

console.log('\nGeneral context:');
console.log('  Input: "The Olympics showcase extraordinary"');
console.log('  Generated:', model.generateResponse('general', 'The Olympics showcase extraordinary'));

// Save the advanced model
model.save('advanced_model.json');
console.log('\nAdvanced model saved to advanced_model.json');

// Demonstrate loading and using a pre-trained model
const loadedModel = new ContextoModel(4);
loadedModel.load('advanced_model.json');
console.log('Advanced model loaded from advanced_model.json');

// Re-register functions (since they're not saved with the model)
loadedModel.registerFunction('getStockPrice', (stock) => {
  const mockPrices = { 'AAPL': 150.25, 'GOOGL': 2750.80, 'MSFT': 305.60 };
  return mockPrices[stock] || 'Unknown stock';
}, 'Get current stock price');

loadedModel.registerFunction('convertCurrency', (amount, from, to) => {
  const mockRates = { 'USD_EUR': 0.85, 'EUR_USD': 1.18, 'USD_JPY': 110.5 };
  const rate = mockRates[`${from}_${to}`] || 1;
  return (parseFloat(amount) * rate).toFixed(2);
}, 'Convert currency');

// Test the loaded model
console.log('\nTesting loaded model:');
console.log('  Input: "What is the stock price of GOOGL"');
console.log('  Generated:', loadedModel.generateResponse('finance', 'What is the stock price of GOOGL'));