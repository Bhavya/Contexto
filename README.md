# ContextoModel

ContextoModel is an advanced, context-aware language model with function-calling capabilities, conversation history tracking, and stream-based response generation. It uses n-gram based prediction to generate contextually appropriate responses and can be trained on various contexts.

## Features

- Context-aware language modeling
- N-gram based prediction with variable length
- Conversation history tracking
- Stream-based response generation
- Function calling integration
- Debug mode for detailed logging
- Easy to train and use
- Save and load model states

## Installation

1. Clone this repository or copy the `ContextoModel.js` file into your project.
2. Ensure you have Node.js installed on your system.
3. Install the required dependencies:

```bash
npm install
```

## Usage

### Importing the Model

```javascript
const ContextoModel = require('./path/to/ContextoModel');
```

### Creating a New Model

```javascript
const model = new ContextoModel(3, ['casual', 'formal'], 5);
```

This creates a new model with trigrams (n=3), two contexts: 'casual' and 'formal', and a history size of 5.

### Training the Model

```javascript
model.train("This is a sample sentence.", 'casual');
```

### Generating Responses

```javascript
const response = model.generateResponse('casual', "This is a", 20);
console.log(response);
```

### Using Stream-based Response Generation

```javascript
const responseGenerator = model.generateResponseStream('casual', "This is a", 20);
for (const partialResponse of responseGenerator) {
    console.log(partialResponse);
}
```

### Registering Functions

```javascript
model.registerFunction('getTime', () => new Date().toLocaleTimeString(), 'Get current time');
```

### Saving and Loading the Model

```javascript
// Saving
model.save('model.json');

// Loading
model.load('model.json');
```

### Enabling Debug Mode

```javascript
model.debugMode = true;
```

## API Reference

### `constructor(n, contexts = ['default'], historySize = 5)`

Creates a new ContextoModel instance.

- `n`: The n-gram size
- `contexts`: An array of context names
- `historySize`: Number of previous interactions to consider

### `train(text, context = 'default')`

Trains the model on the given text in the specified context.

### `predict(context, phrase, excludeWords = [])`

Predicts the next word given a context and a phrase.

### `registerFunction(name, func, description)`

Registers a function that can be called during response generation.

### `generateResponse(context, input, maxLength = 20)`

Generates a complete response given a context and an input phrase.

### `*generateResponseStream(context, input, maxLength = 20)`

Generates a response stream, yielding each part of the response as it's generated.

### `filterResponse(response, input)`

Filters the generated response to avoid repetition and improve coherence.

### `save(filename)`

Saves the current model state to a file.

### `load(filename)`

Loads a model state from a file.

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you have any questions or need help with using ContextoModel, please open an issue in the GitHub repository.