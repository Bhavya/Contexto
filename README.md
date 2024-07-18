# Contexto

Contexto is a lightweight, context-aware language model with function calling capabilities. It allows you to train and use language models that are sensitive to different contexts and can execute functions based on the input.

## Features

- Context-aware language modeling
- N-gram based prediction
- Function calling integration
- Easy to train and use
- Lightweight and efficient

## Installation

```bash
npm install contexto
```

## Quick Start

```javascript
const ContextoModel = require('contexto');

// Create a new model
const model = new ContextoModel(3, ['formal', 'casual']);

// Train the model
model.train("This is a formal business letter.", 'formal');
model.train("Hey, what's up dude?", 'casual');

// Make predictions
console.log(model.predict('formal', 'This is a'));
console.log(model.predict('casual', 'Hey, what's'));

// Register a function
model.registerFunction('getTime', () => new Date().toLocaleTimeString(), 'Get current time');

// Generate a response with potential function calling
console.log(model.generateResponse('casual', 'Hey, what time'));
```

## Documentation

For full documentation, please visit our [GitHub wiki](https://github.com/bhavya/contexto/wiki).

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.