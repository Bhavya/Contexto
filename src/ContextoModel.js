const fs = require('fs');

class ContextoModel {
    constructor(n, contexts = ['default']) {
        this.n = n;
        this.contexts = contexts;
        this.models = {};
        this.functions = {};
        this.debugMode = false;

        contexts.forEach(context => {
            this.models[context] = {};
        });
    }

    debugLog(...args) {
        if (this.debugMode) {
            console.log(...args);
        }
    }

    train(text, context = 'default') {
        const words = text.toLowerCase().split(/\s+/);
        for (let i = 0; i < words.length; i++) {
            for (let j = 1; j <= this.n; j++) {
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
        this.debugLog(`Trained: "${text}" in context: ${context}`);
    }

    predict(context, phrase, excludeWords = []) {
        this.debugLog(`Predicting for: "${phrase}" in context: ${context}`);
        const words = phrase.toLowerCase().split(/\s+/);

        for (let i = this.n; i > 0; i--) {
            let ngram = words.slice(-i).join(' ');
            this.debugLog(`Looking up ngram: "${ngram}"`);
            const possibilities = this.models[context][ngram];

            if (possibilities) {
                const validPredictions = Object.entries(possibilities)
                    .filter(([word]) => !excludeWords.includes(word) && word !== '<END>')
                    .sort((a, b) => b[1] - a[1]);

                if (validPredictions.length > 0) {
                    const totalWeight = validPredictions.reduce((sum, [, count]) => sum + count, 0);
                    let random = Math.random() * totalWeight;

                    for (const [word, count] of validPredictions) {
                        random -= count;
                        if (random <= 0) {
                            this.debugLog(`Predicted: "${word}"`);
                            return word;
                        }
                    }
                }
            }
        }

        this.debugLog('No valid prediction found');
        return null;
    }

    registerFunction(name, func, description) {
        this.functions[name] = { func, description };
        this.train(`call ${name} function`, 'casual');
        this.train(`call ${name} function`, 'formal');
        this.debugLog(`Registered function: ${name}`);
    }

    generateResponse(context, input, maxLength = 20) {
        this.debugLog(`Generating response for: "${input}" in context: ${context}`);
        let currentPhrase = input.toLowerCase().split(/\s+/);
        let response = [...currentPhrase];
        let usedWords = new Set(currentPhrase);

        // Check if the input directly calls for a function
        const callIndex = currentPhrase.indexOf('call');
        if (callIndex !== -1 && callIndex + 1 < currentPhrase.length) {
            const funcName = currentPhrase[callIndex + 1];
            if (this.functions[funcName.toLowerCase()]) {
                const result = this.functions[funcName.toLowerCase()].func(response.join(' '));
                this.debugLog(`Function call: ${funcName}, Result: ${result}`);
                return `${response.join(' ')} [Function Call: ${funcName}] Result: ${result}`;
            }
        }

        while (response.length < maxLength) {
            const nextWord = this.predict(context, currentPhrase.join(' '), Array.from(usedWords));
            if (!nextWord) break;

            if (nextWord === 'call' || nextWord === 'time' || this.functions[nextWord.toLowerCase()]) {
                let funcName = nextWord === 'call' || nextWord === 'time' ? 'getTime' : nextWord;
                if (this.functions[funcName.toLowerCase()]) {
                    const result = this.functions[funcName.toLowerCase()].func(response.join(' '));
                    this.debugLog(`Function call: ${funcName}, Result: ${result}`);
                    return `${response.join(' ')} ${nextWord} [Function Call: ${funcName}] Result: ${result}`;
                }
            }

            response.push(nextWord);
            usedWords.add(nextWord);
            currentPhrase = response.slice(-this.n + 1);
        }

        this.debugLog(`Generated response: "${response.join(' ')}"`);
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
        this.debugLog(`Model saved to: ${filename}`);
    }

    load(filename) {
        const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
        this.n = data.n;
        this.contexts = data.contexts;
        this.models = data.models;
        this.debugLog(`Model loaded from: ${filename}`);
        // Note: Functions need to be re-registered after loading
    }
}

module.exports = ContextoModel;