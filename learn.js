var synaptic = require('synaptic');
var _ = require('underscore');
var colors = require('colors');
var fs = require('fs');

const Layer = synaptic.Layer;
const Network = synaptic.Network;
const Neuron = synaptic.Neuron;
const Architect = synaptic.Architect;
const Trainer = synaptic.Trainer;

const DefaultMetrics = {
    /*iteration: {
     value: 0,
     set: (iteration) => iteration += 1
     }*/
};
const DefaultScore = {
    /*iteration: {
     diff: -1,
     score: 1
     }*/
};
const DefaultScoreHelper = {
    diff: 1,
    score: 0
};
const TrustChanceChange = 0.5;
// Helpers
const objectSize = (object) => Object.keys(object).length;
const objectToArray = (object) => Object.keys(object).map((key) => object[key]);

// Private

class GameLearn {
    constructor(options) {
        console.log("Neural network setup started...");
        var self = this;
        this._lastNetworkOutputIndex = null;
        this._lastMetrics = null;
        this._lastNetworkInput = [];
        this._networkInputMap = [];
        this._networkInputValueMap = [];
        this._networkOutputTrustChance = 15;
        this._started = new Date();
        this._totalBad = 0;
        this._totalGood = 0;
        if (!options || !options.metrics || !options.commands) throw new Error('Metrics and Commands settings are required to create a network.');
        if (objectSize(options.metrics) == 0 || objectSize(options.commands) == 0) throw new Error('At least one metric and one command are required.');
        this.file = options.file;
        this.metrics = options.metrics;
        this.commands = options.commands;
        this.score = _.extend(options.score || {}, DefaultScore);

        var defaultMetrics = {};
        Object.keys(DefaultMetrics).forEach((metric) => defaultMetrics[metric] = DefaultMetrics[metric].value);
        this.metrics = _.extend(this.metrics, defaultMetrics);

        var networkInput = this._mapNetworkInput(options.metrics);

        var inputLayer = new Layer(networkInput.length);
        var hiddenLayer = new Layer(networkInput.length);
        var hiddenLayer2 = new Layer(networkInput.length);
        var hiddenLayer3 = new Layer(10);
        var hiddenLayer4 = new Layer(6);
        var outputLayer = new Layer(objectSize(options.commands));

        inputLayer.project(hiddenLayer);
        hiddenLayer.project(hiddenLayer2);
        hiddenLayer2.project(outputLayer);
        //hiddenLayer3.project(outputLayer);
        //hiddenLayer4.project(outputLayer);
        this.network = new Network({
            input: inputLayer,
            hidden: [hiddenLayer, hiddenLayer2],
            output: outputLayer
        });
        this.trainer = new Trainer(this.network);
        if (options.file) this._load(options.file, () => {
            (function save() {
                self._save(self.file, () => setTimeout(save, 120000));
            })();
        });

        console.log("Network generated: input(%s) hidden(?) output(%s)", networkInput.length, objectSize(options.commands))
    }


    getCommand(updatedMetrics) {
        var self = this;
        // Update default metrics values
        Object.keys(DefaultMetrics).forEach((name) => updatedMetrics[name] = DefaultMetrics[name].set((this._lastMetrics || updatedMetrics)[name]));
        // Setup network input
        var networkInput = this._mapNetworkInput(updatedMetrics);
        // Train
        if (this._lastNetworkInput != null && this._lastNetworkOutputIndex != null && this._lastNetworkOutputSortIndex != null)
            this._train(this._lastNetworkInput, networkInput, this._lastNetworkOutputIndex, this._lastNetworkOutputSortIndex);
        console.log("Feeding network with %s inputs...", networkInput.length);
        // Get network output        
        var networkOutput = this.network.activate(networkInput);
        var maxRandomInt = 0;
        var networkOutputMap = networkOutput.map(function (output, index) {
            var chance = parseInt(output * 100);
            maxRandomInt += chance;
            return {
                value: output,
                index: index,
                chance: chance
            };
        });

        var randomInt = _.random(1, maxRandomInt);

        networkOutputMap = _.sortBy(networkOutputMap, 'value').reverse();
        var selectedOutput = 0;
        var totalChance = 0;
        for (var outputIndex in networkOutputMap) {
            var currentOutput = networkOutputMap[outputIndex];
            var formula = (n) => 1 / 2 * n * (n + 1);

            //if (outputIndex > 0)
            //      currentOutput.chance += (100 - self._networkOutputTrustChance) / formula(networkOutput.length - 1) * (networkOutput.length - outputIndex);
            totalChance += currentOutput.chance;
            if (randomInt <= totalChance) {
                selectedOutput = outputIndex;
                break;
            }
        }
        //selectedOutput = 0;
        networkOutputMap.forEach((output) => console.log("%s% chance of sending %s()", parseInt(output.chance), Object.keys(self.commands)[output.index].blue));
        // Get the biggest network output index        
        var selectedNetworkOutputIndex = networkOutputMap[selectedOutput].index;
        // Map the output to the correct command function
        var selectedCommand = this.commands[Object.keys(this.commands)[selectedNetworkOutputIndex]];
        // Update vars
        this.metrics = updatedMetrics;
        this._lastMetrics = updatedMetrics;
        this._lastNetworkInput = _.clone(networkInput);
        this._lastNetworkOutputIndex = selectedNetworkOutputIndex;
        this._lastNetworkOutputSortIndex = parseInt(selectedOutput);
        return selectedCommand;
    }

    _mapNetworkInput(networkInputObject) {
        var networkInput = Array.apply(null, Array(this._networkInputMap.length)).map(Number.prototype.valueOf, 0);
        var self = this;

        function getNetworkInputIndex(name) {
            if (self._networkInputMap.indexOf(name) == -1) {
                self._networkInputMap.push(name);
                self._networkInputValueMap[self._networkInputMap.indexOf(name)] = [];
            }
            return self._networkInputMap.indexOf(name);
        }

        function map(name, value) {
            var inputIndex = getNetworkInputIndex(name);
            if (!_.isNumber(value)) throw new Error('Cant train network with ' + name);
            networkInput[inputIndex] = value;
            //console.log("Mapped %s(%s)=%s",name, inputIndex, value);
        }

        function mapValue(name, value) {
            var inputIndex = getNetworkInputIndex(name);
            var valueMap = self._networkInputValueMap[inputIndex];
            if (valueMap.indexOf(value) == -1) valueMap.push(value);
            return valueMap.indexOf(value) + 1;
        }

        var nameDivisor = ".";
        (function parse(name, value) {
            if (_.isNumber(value))
                return map.apply(null, arguments);
            if (_.isString(value))
                return map(name, mapValue(name, value));
            if (_.isBoolean(value))
                return map(name, value == true ? 1 : 0);
            if (_.isObject(value))
                return Object.keys(value).map((propName) => parse(!name ? propName : name + nameDivisor + propName, value[propName]));
        })(null, networkInputObject);
        networkInput = networkInput.map((input) => isNaN(input) ? 0 : input);
        return networkInput;
    }

    _train(lastNetworkInput, networkInput, lastNetworkOutputIndex, lastNetworkOutputSortIndex) {
        console.log("Learning...");
        var inputDifference = networkInput.map((input, index) => input - lastNetworkInput[index]);
        var score = 0;
        var metricIndex = 0;
        var self = this;
        inputDifference.forEach(function (difference, index) {
            var scoreHelper = self.score[self._networkInputMap[index]];
            if (!scoreHelper) scoreHelper = DefaultScoreHelper;
            if (scoreHelper.score == 0) return;
            if (scoreHelper.min > networkInput[index] || scoreHelper.max < networkInput[index]) return;
            if(scoreHelper.equals != null && scoreHelper.last && networkInput[index] == scoreHelper.equals) return score += scoreHelper.score;

            if (difference > 0 && !scoreHelper.disableBiggerDifference) {
                score += scoreHelper.score * scoreHelper.diff;
            } else if (difference < 0) {
                score += scoreHelper.score * (scoreHelper.diff * -1);
            }
            metricIndex += 1;
        });
        var trustUpdate = TrustChanceChange * (lastNetworkOutputSortIndex + 1);

        var propperNetworkOutput = [];
        if (score > 0) {
            this._totalGood += 1;
            propperNetworkOutput = Array.apply(null, Array(objectSize(this.commands))).map(Number.prototype.valueOf, 0);
            propperNetworkOutput[lastNetworkOutputIndex] = 1;
            this._networkOutputTrustChance += lastNetworkOutputSortIndex == 0 ? trustUpdate : trustUpdate * -1;
        } else {
            this._totalBad += 1;
            propperNetworkOutput = Array.apply(null, Array(objectSize(this.commands))).map(Number.prototype.valueOf, 1);
            var outputIndexArray = [];
            for (var i = 0; i <= objectSize(this.commands) - 1; i++)
                outputIndexArray.push(i);
            outputIndexArray.splice(lastNetworkOutputIndex, 1);

            propperNetworkOutput[lastNetworkOutputIndex] = 0;
            // Select a random command
            //propperNetworkOutput[_.sample(outputIndexArray)] = 1;

            this._networkOutputTrustChance += lastNetworkOutputSortIndex == 0 ? trustUpdate * -1 : trustUpdate;
            this._networkOutputTrustChance = 0;
        }

        if (this._networkOutputTrustChance < 0)
            this._networkOutputTrustChance = 0;
        if (this._networkOutputTrustChance > 100)
            this._networkOutputTrustChance = 100;
        var trainSet = [];
        for (var i = 1; i <= Math.abs(score); i++)
            trainSet.push({
                input: lastNetworkInput,
                output: propperNetworkOutput
            });
        if (trainSet.length == 0) return;
        setTimeout(function () {
            self.trainer.train(trainSet);
            console.log("Learned that sending the command %s() was a %s idea (score:%s)...", Object.keys(self.commands)[lastNetworkOutputIndex].blue, score >= 0 ? 'good'.green : 'bad'.red, score);
            console.log("Network output trust chance updated to %s% (%s)...", self._networkOutputTrustChance, lastNetworkOutputSortIndex);
            //console.log("Estava indo para (%s)", ['esquerda', 'direita', 'cima', 'baixo'][lastNetworkInput[self._networkInputMap.indexOf('direction')]]);
            var minutes = (new Date() - self._started) / 1000 / 60;
            console.log("%s good/min | %s bad/min | %s good/bad ratio", (self._totalGood / minutes).toFixed(2).toString().green, (self._totalBad / minutes).toFixed(2).toString().red, (self._totalGood / self._totalBad).toFixed(2).toString().yellow);
            require('console.table');
            console.table(trainSet[0].input.map((value, index) => {
                return {
                    input: self._networkInputMap[index],
                    value: value
                };
            }));
            console.log(trainSet[0].output);
        }, 10);
    }

    _save(filename, done) {
        var self = this;
        fs.unlink(filename, function (err) {
            // Ignore error if no file already exists
            if (err && err.code !== 'ENOENT') return console.log("Cant load network from file %s", filename);

            var save = {};
            save.network = self.network.toJSON();
            save._networkInputMap = self._networkInputMap;
            save._networkInputValueMap = self._networkInputValueMap;
            save._networkOutputTrustChance = self._networkOutputTrustChance;

            fs.writeFile(filename, JSON.stringify(save), {flag: 'w'}, function (err) {
                if (err && err.code !== 'ENOENT') throw err;
                console.log('Network saved to %s...', filename);
                if (done) done();
            });
        });
    }

    _load(filename, done) {
        var self = this;
        fs.readFile(filename, 'utf8', function (err, content) {
            if (err && err.code !== 'ENOENT') throw err;
            if (!content) {
                if (done) done();
                return console.log("No save data on %s", filename);
            }
            var save = JSON.parse(content);

            self._networkInputMap = save._networkInputMap;
            self._networkInputValueMap = save._networkInputValueMap;
            self._networkOutputTrustChance = save._networkOutputTrustChance;
            self._network = save.network;
            self.trainer = new Trainer(self.network);
            console.log("Network loaded...");
            if (done) done();
        });
    }
}

module.exports = GameLearn;
