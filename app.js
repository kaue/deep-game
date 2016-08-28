var synaptic = require('synaptic');
var Layer = synaptic.Layer;
var Network = synaptic.Network;
var Neuron = synaptic.Neuron;
var Architect = synaptic.Architect;
var Trainer = synaptic.Trainer;

// User defined parametrs

var metrics = {
    health: 100,
    pos: 0,
    iteration : 0
};

var commands = {
    moveForward: function(){
        if(metrics.pos > 50)
            metrics.health -= 1;
        metrics.pos += 1;
        console.log("moveForward();")
    },
    moveBackward: function(){
        if(metrics.pos > 0)
            metrics.pos -= 1;
        if(metrics.pos > 50 && metrics.health < 100)
            metrics.health += 5;
        console.log("moveBackward();")
    }
}

var metricScore = {
    health: {
        difference: 1,
        score: 2,
        min: 10,
        max: 100
    },
    pos: {
        difference: 1,
        score: 2
    },
    iteration: {
        difference: -1,
        score: 1
    }
}

var winPos = 150;

var objectToArray = (object) => Object.keys(object).map((key) => object[key]);

function setup(options){
    var inputLayer = new Layer(Object.keys(options.metrics).length);
    //var hiddenLayer = new Layer(4);
    var outputLayer = new Layer(Object.keys(options.commands).length);

    inputLayer.project(outputLayer);
    //hiddenLayer.project(outputLayer);

    var network = new Network({
        input: inputLayer,
        //hidden: [hiddenLayer],
        output: outputLayer
    });
    return network;
}


var network = setup({
    metrics: metrics,
    commands: commands
});

var trainer = new Trainer(network);
//for(var i = 0; i<= 10; i++){
    //while(metrics.pos < winPos){
    function next(){
        metrics.iteration += 1;
        var networkInput = objectToArray(metrics);
        var networkOutput = network.activate(networkInput);
        var selectedNetworkOutputIndex = networkOutput.indexOf(Math.max.apply(Math, networkOutput));
        var selectedCommand = commands[Object.keys(commands)[selectedNetworkOutputIndex]];
        // Execute selectedCommand
        selectedCommand();
        console.log(metrics);
        var metricsDifference = objectToArray(metrics).map((value, index) => value - networkInput[index]);
        var score = 0;
        var metricIndex = 0;
        for(var metricName in metrics){
            var scoreHelper = metricScore[metricName];
            var difference = metricsDifference[metricIndex];
            if(scoreHelper.min < metrics[metricName])
                score = 0;
            else if(difference > 0)
                score += scoreHelper.score * scoreHelper.difference;
            else if(difference < 0)
                score += scoreHelper.score * (scoreHelper.difference * -1);
            metricIndex += 1;
        }
        //console.log(metricsDifference);
        //console.log("Score = %s", score);
        propperNetworkOutput = [];
        //var score = metricsDifference.reduce((a, b) => a+b);
        if(score > 0){
            propperNetworkOutput = Array.apply(null, Array(networkOutput.length)).map(Number.prototype.valueOf,0);
            propperNetworkOutput[selectedNetworkOutputIndex] = 1;
        }else{
            propperNetworkOutput = Array.apply(null, Array(networkOutput.length)).map(Number.prototype.valueOf,1);
            propperNetworkOutput[selectedNetworkOutputIndex] = 0;
        }


        trainer.train([{
            input: networkInput,
            output: propperNetworkOutput
        }]);
        if(metrics.pos < winPos)
            setTimeout(next, 100);
        else{
            console.log("Finished with %s iterations", metrics.iteration);
            metrics = {
                health: 100,
                pos: 0,
                iteration : 0
            };
            next();
        }
    }
    next();

//}
