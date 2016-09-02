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
        this._memory = [];
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
        this.commandNetworks = [];
        var index = 0;
        for (var command in this.commands) {
            index += 1;
            var inputLayer = new Layer(networkInput.length);
            var hiddenLayer = new Layer(networkInput.length);
            var outputLayer = new Layer(1);
            inputLayer.project(hiddenLayer);
            hiddenLayer.project(outputLayer);
            var network = new Network({
                input: inputLayer,
                hidden: [hiddenLayer],
                output: outputLayer
            });
            //var network = new Architect.LSTM(networkInput.length, networkInput.length * 2, 1);
            //var network = new Architect.Liquid(networkInput.length, networkInput.length * 10, 1, networkInput.length * 15, networkInput.length * 5);
            var trainer = new Trainer(network);
            this.commandNetworks.push({
                network: network,
                trainer: trainer,
                name: command,
                command: this.commands[command]
            });
        }

        /*var inputLayer = new Layer(networkInput.length);
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
         this.trainer = new Trainer(this.network);*/
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
        //console.log("Feeding network with %s inputs...", networkInput.length);
        // Get network output
        //var networkOutput = this.network.activate(networkInput);
        var networkOutput = this.commandNetworks.map((command) => {
            //command.output = _.first(command.network.activate(networkInput));
            return _.first(command.network.activate(networkInput));
        });
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

        var topOutputIndex = networkOutputMap
            .filter((output) => output.chance == networkOutputMap[0].chance)
            .map((output) => output.index);
        //console.table("Selected commands", topOutputIndex.map((index) => Object.keys(self.commands)[index]));
        var selectedNetworkOutputIndex = _.sample(topOutputIndex);
        //networkOutputMap.forEach((output) => console.log("%s% chance of sending %s()", (output.chance / maxRandomInt), Object.keys(self.commands)[output.index].blue));
        /*console.table("getCommand()", networkOutputMap.map((output) => {
         return {
         chance: (output.chance / maxRandomInt).toFixed(3),
         command: Object.keys(self.commands)[output.index]
         };
         }));*/
        // Get the biggest network output index
        //var selectedNetworkOutputIndex = networkOutputMap[selectedOutput].index;
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
        //console.log("Learning...");
        var inputDifference = networkInput.map((input, index) => input - lastNetworkInput[index]);
        var score = 0;
        var metricIndex = 0;
        var self = this;
        inputDifference.forEach(function (difference, index) {
            var scoreHelper = self.score[self._networkInputMap[index]];
            if (!scoreHelper) return;
            if (scoreHelper.score == 0) return;
            if (scoreHelper.min > networkInput[index] || scoreHelper.max < networkInput[index]) return;
            if (scoreHelper.equals != null && scoreHelper.last && networkInput[index] == scoreHelper.equals) {
                return score += scoreHelper.score;
            }
            if (!scoreHelper.score || !scoreHelper.diff) return;

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
            //self.trainer.train(trainSet);
            /*if (score < 0){
                var outputIndexArray = [];
                for (var i = 0; i <= objectSize(self.commands) - 1; i++)
                    outputIndexArray.push(i);
                outputIndexArray.splice(lastNetworkOutputIndex, 1);
                var set = [];
                for(var i = 0; i < 5; i++)
                    set.push({
                        input: lastNetworkInput,
                        output: [0]
                    });
                self.commandNetworks[lastNetworkOutputIndex].trainer.train(set);
                self.commandNetworks[_.sample(outputIndexArray)].trainer.train([{
                    input: lastNetworkInput,
                    output: [1]
                }]);
            }

            else */
            if (score != 0)
                self.commandNetworks[lastNetworkOutputIndex].trainer.train([{
                    input: lastNetworkInput,
                    output: [score > 0 ? 1 : 0]
                }]);
            console.log("Learned that sending the command %s() was a %s idea (score:%s)...", Object.keys(self.commands)[lastNetworkOutputIndex].blue, score >= 0 ? 'good'.green : 'bad'.red, score);

                //console.log("%s good/min | %s bad/min | %s good/bad ratio", (self._totalGood / minutes).toFixed(2).toString().green, (self._totalBad / minutes).toFixed(2).toString().red, (self._totalGood / self._totalBad).toFixed(2).toString().yellow);
                /*require('console.table');
                 console.table(trainSet[0].input.map((value, index) => {
                 return {
                 input: self._networkInputMap[index],
                 value: value
                 };
                 }));*/

            return;
            console.log("Network output trust chance updated to %s% (%s)...", self._networkOutputTrustChance, lastNetworkOutputSortIndex);
            //console.log("Estava indo para (%s)", ['esquerda', 'direita', 'cima', 'baixo'][lastNetworkInput[self._networkInputMap.indexOf('direction')]]);

            var minutes = (new Date() - self._started) / 1000 / 60;


            console.log("Trained with", trainSet[0].output);
            var networkOutputMap = self.network.activate(trainSet[0].input).map(function (output, index) {
                var chance = parseInt(output * 100);
                return {
                    name: Object.keys(self.commands)[index],
                    value: output,
                    index: index,
                    chance: chance
                };
            });
            networkOutputMap = _.sortBy(networkOutputMap, 'value').reverse();
            console.table("Test result", networkOutputMap);
        }, 10);
    }

    _save(filename, done) {
        var self = this;
        fs.unlink(filename, function (err) {
            // Ignore error if no file already exists
            if (err && err.code !== 'ENOENT') return console.log("Cant load network from file %s", filename);

            var save = {};
            //save.network = self.network.toJSON();
            save.commandNetworks = [];

            self.commandNetworks.forEach((command) => {
                //command.network = command.network.toJSON();
                //command.trainer = null;
                return save.commandNetworks.push({
                    network: command.network.toJSON(),
                    trainer: null,
                    name: command.name,
                    command: command.command
                });
            });

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
            //self._network = Network.fromJSON(save.network);
            //self.trainer = new Trainer(self.network);
            self.commandNetworks = save.commandNetworks.map((command) => {
                command.network = Network.fromJSON(command.network)
                command.trainer = new Trainer(command.network);
                return command;
            });
            console.log("Network loaded...");
            if (done) done();
        });
    }
}

module
    .exports = GameLearn;
