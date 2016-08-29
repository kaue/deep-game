var GameLearn = require('./learn');


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
};

var metricScore = {
    health: {
        diff: 1,
        score: 2,
        min: 10,
        max: 80
    },
    pos: {
        diff: 1,
        score: 2
    },
    iteration: {
        diff: -1,
        score: 1
    }
};

var winPos = 200;

var ai = new GameLearn({
    file: 'test.json',
    metrics: metrics,
    commands: commands,
    score: metricScore
});
//for(var i = 0; i<= 10; i++){
//while(metrics.pos < winPos){
function next(){
    var nextCommand = ai.getCommand(metrics);
    nextCommand();
    console.log(metrics);
    if(metrics.pos < winPos)
        setTimeout(next, 100);
    else{
        console.log("Finished with %s iterations", metrics.iteration);
        metrics = {
            health: 100,
            pos: 0,
            iteration : 0
        };
        //next();
    }
}
next();

//}
