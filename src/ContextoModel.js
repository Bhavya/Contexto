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
        for (let i = 0; i < words.length; i++) {
            for (let j = 1; j < this.n; j++) {
                if (i + j <= words.length) {
                    const ngram = words.slice(i, i + j).join(' ');
                    const nextWord = words[i + j] || '<END>';

                    if (!this.models[context][ngram]) {
                        this.models[context][ngram] = {};
                    }
                    this.models[context][ngram][nextWord] = (this.models[context][ngram][nextWord] || 0) + 1;
                }
            }
        }
        console.log(`Trained: "${text}" in context: ${context}`);
    }

    predict(context, phrase, excludeWords = []) {
        console.log(`Predicting for: "${phrase}" in context: ${context}`);
        const words = phrase.toLowerCase().split(/\s+/);

        for (let i = this.n - 1; i > 0; i--) {
            let ngram = words.slice(-i).join(' ');
            console.log(`Looking up ngram: "${ngram}"`);
            const possibilities = this.models[context][ngram];

            if (possibilities) {
                const validPredictions = Object.entries(possibilities)
                    .filter(([word]) => !excludeWords.includes(word))
                    .sort((a, b) => b[1] - a[1]);

                if (validPredictions.length > 0) {
                    const totalWeight = validPredictions.reduce((sum, [, count]) => sum + count, 0);
                    let random = Math.random() * totalWeight;

                    for (const [word, count] of validPredictions) {
                        random -= count;
                        if (random <= 0) {
                            console.log(`Predicted: "${word}"`);
                            return word;
                        }
                    }
                }
            }
        }

        console.log('No valid prediction found');
        return null;
    }

    registerFunction(name, func, description) {
        this.functions[name] = { func, description };
        console.log(`Registered function: ${name}`);
    }

    generateResponse(context, input, maxLength = 20) {
        console.log(`Generating response for: "${input}" in context: ${context}`);
        let currentPhrase = input.toLowerCase().split(/\s+/);
        let response = [...currentPhrase];
        let usedWords = new Set(currentPhrase);

        while (response.length < maxLength) {
            const nextWord = this.predict(context, currentPhrase.join(' '), Array.from(usedWords));
            if (!nextWord || nextWord === '<END>') break;

            if (this.functions[nextWord]) {
                const result = this.functions[nextWord].func(response.join(' '));
                console.log(`Function call: ${nextWord}, Result: ${result}`);
                return `${response.join(' ')} [Function Call: ${nextWord}] Result: ${result}`;
            }

            response.push(nextWord);
            usedWords.add(nextWord);
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