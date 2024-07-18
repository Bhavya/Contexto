const fs = require('fs');

class ContextoModel {
  constructor(n, contexts = ['default']) {
    this.n = n;
    this.contexts = contexts;
    this.models = {};
    this.functions = {};
    
    contexts.forEach(context => {
      this.models[context] = {};
    });
  }

  train(text, context = 'default') {
    const words = text.toLowerCase().split(/\s+/);
    for (let i = 0; i <= words.length - this.n; i++) {
      const ngram = words.slice(i, i + this.n - 1).join(' ');
      const nextWord = words[i + this.n - 1] || '<END>';
      
      if (!this.models[context][ngram]) {
        this.models[context][ngram] = {};
      }
      this.models[context][ngram][nextWord] = (this.models[context][ngram][nextWord] || 0) + 1;
    }
    console.log(`Trained: "${text}" in context: ${context}`);
  }

  predict(context, phrase) {
    console.log(`Predicting for: "${phrase}" in context: ${context}`);
    const words = phrase.toLowerCase().split(/\s+/);
    let ngram = words.slice(-this.n + 1).join(' ');
    
    console.log(`Looking up ngram: "${ngram}"`);
    const possibilities = this.models[context][ngram];
    if (!possibilities) {
      console.log('No possibilities found');
      return null;
    }

    // Choose a random prediction weighted by frequency
    const total = Object.values(possibilities).reduce((sum, count) => sum + count, 0);
    let random = Math.random() * total;
    for (const [word, count] of Object.entries(possibilities)) {
      random -= count;
      if (random <= 0) {
        console.log(`Predicted: "${word}"`);
        return word;
      }
    }
  }

  registerFunction(name, func, description) {
    this.functions[name] = { func, description };
    console.log(`Registered function: ${name}`);
  }

  generateResponse(context, input, maxLength = 20) {
    console.log(`Generating response for: "${input}" in context: ${context}`);
    let currentPhrase = input.toLowerCase().split(/\s+/);
    let response = [...currentPhrase];

    while (response.length < maxLength) {
      const nextWord = this.predict(context, currentPhrase.slice(-this.n + 1).join(' '));
      if (!nextWord || nextWord === '<END>') break;
      
      if (this.functions[nextWord]) {
        const result = this.functions[nextWord].func(response.join(' '));
        console.log(`Function call: ${nextWord}, Result: ${result}`);
        return `${response.join(' ')} [Function Call: ${nextWord}] Result: ${result}`;
      }
      
      response.push(nextWord);
      currentPhrase = response.slice(-this.n + 1);
    }

    console.log(`Generated response: "${response.join(' ')}"`);
    return response.join(' ');
  }

  save(filename) {
    const data = {
      n: this.n,
      contexts: this.contexts,
      models: this.models,
      functions: Object.keys(this.functions).reduce((acc, key) => {
        acc[key] = this.functions[key].description;
        return acc;
      }, {})
    };
    fs.writeFileSync(filename, JSON.stringify(data));
    console.log(`Model saved to: ${filename}`);
  }

  load(filename) {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    this.n = data.n;
    this.contexts = data.contexts;
    this.models = data.models;
    console.log(`Model loaded from: ${filename}`);
    // Note: Functions need to be re-registered after loading
  }
}

module.exports = ContextoModel;