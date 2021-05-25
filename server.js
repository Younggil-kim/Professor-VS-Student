//server.js
const express = require('express');
// const {Stage} = require('./stage/stageHandler.js');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
// const {StageOne} = require('./stage/stageHandler.js');


server.listen(process.env.PORT || 8000, () => {
    console.log("서버가 대기중입니다.");
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.use('/views/keyHandler', express.static(__dirname+ '/views/keyHandler.js'))

app.use('/views/gameObject', express.static(__dirname+ '/views/gameObject.js'))
app.use('/stage/stageHandler', express.static(__dirname + '/stage/stageHandler.js'))
function getPlayerColor(){
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

const canvasWidth = 1024;
const canvasHeight = 768;
let enemyFrequency = 1000;
const startX = canvasWidth/2;
const startY = canvasHeight/2;
let stageTime = 15;


class Stage{
    constructor(stage){
        this.stage = stage || null;
    }
    setStage(stage){
        return this.stage = stage;
    }
    start(){
        this.stage.start();
    }

}




var enemyRadius = 10;

class PlayerBall{
    constructor(socket){
        this.socket = socket;
        this.x = startX;
        this.y = startY;
        this.color = getPlayerColor();
        this.state = 1;
    }

    get id() {
        return this.socket.id;
    }
}


var balls = [];
var ballMap = {};

function joinGame(socket){
    let ball = new PlayerBall(socket);

    balls.push(ball);
    ballMap[socket.id] = ball;

    return ball;
}

function endGame(socket){
    for( var i = 0 ; i < balls.length; i++){
        if(balls[i].id == socket.id){
            balls.splice(i,1);
            break
        }
    }
    delete ballMap[socket.id];
}


let stageGenerator;
let stage;
let isAccessFail = false;
let enemyInterval;
let itemInterval;

io.on('connection', function(socket) {
    console.log(`${socket.id}님이 입장하셨습니다.`);

    socket.on('disconnect', function(reason){
        console.log(`${socket.id}님이 ${reason}의 이유로 퇴장하셨습니다. `)
        endGame(socket);
        io.sockets.emit('leave_user', socket.id);
        if(balls.length == 0){
            clearInterval(enemyInterval);
            // // clearInterval(stageGenerator);
            // clearInterval(itemGeneratorInterval);
            timer = 15;
            isAccessFail = false;
        }
    });


    
    let newBall = joinGame(socket);

    socket.emit('user_id', socket.id);
 
    for (var i = 0 ; i < balls.length; i++){
        let ball = balls[i];
        socket.emit('join_user', {
            id: ball.id,
            x: ball.x,
            y: ball.y,
            color: ball.color,
        });
    }

    socket.broadcast.emit('join_user',{
        id: socket.id,
        x: newBall.x,
        y: newBall.y,
        color: newBall.color,
    });

    if(balls.length > 7 || isAccessFail){//3명 이상 접속시 접속자 차단해버리기 
        console.log(socket.id)
        socket.emit('force_disconnect', socket.id);
        endGame(socket);
        io.sockets.emit('leave_user', socket.id);
        socket.disconnect(false);
        isAccessFail = false;
    }

    socket.on('send_location', function(data) {
            socket.broadcast.emit('update_state', {
                id: data.id,
                x: data.x,
                y: data.y,
            })
    })

    function enemyLeftSideGenerator(){
            if(balls.length){
                var randomStartY = Math.floor(Math.random() * 768)
                var randomDestinationY = Math.floor(Math.random() * 768)
                io.sockets.emit('enemy_generator', {
                    wall : 0,
                    startingX:  enemyRadius,
                    startingY:  randomStartY,
                    destinationX:  canvasWidth+enemyRadius,
                    destinationY: randomDestinationY,
                })
            }
    }
    function enemyRightSideGenerator(){
            if(balls.length){
                var randomStartY = Math.floor(Math.random() * 768)
                var randomDestinationY = Math.floor(Math.random() * 768)
                io.sockets.emit('enemy_generator', {
                    wall : 1,
                    startingX:  canvasWidth+enemyRadius,
                    startingY:  randomStartY,
                    destinationX:  enemyRadius,
                    destinationY: randomDestinationY,
                })
            }
    }
    function enemyUpSideGenerator(){
            if(balls.length){
                var randomStartX = Math.floor(Math.random() * 1024);
                var randomDestinationX = Math.floor(Math.random() * 1024);
                io.sockets.emit('enemy_generator', {
                    wall : 2,
                    startingX:  randomStartX,
                    startingY:  enemyRadius,
                    destinationX:  randomDestinationX,
                    destinationY: canvasHeight+enemyRadius,
                })
            }
    }
    function enemyDownSideGenerator(){
            if(balls.length){
                var randomStartX = Math.floor(Math.random() * 1024);
                var randomDestinationX = Math.floor(Math.random() * 1024);
                io.sockets.emit('enemy_generator', {
                    wall : 3,
                    startingX:  randomStartX,
                    startingY:  canvasHeight+enemyRadius,
                    destinationX:  randomDestinationX,
                    destinationY: enemyRadius,
                })
            }
    }

    function enemyGenerator(){//전 방향 벽에서 총알 생성하게 하는거
        enemyLeftSideGenerator();
        enemyRightSideGenerator();
        enemyUpSideGenerator();
        enemyDownSideGenerator();
    }

    const WaitingStage = (function(){//전략패턴 사용
        function WaitingStage(){}
        WaitingStage.prototype.start = function(){
            let count = 0;
            waitInterval = setInterval(function() {
                count += 1;
                if(count >= 5){
                    clearInterval(waitInterval);
                    io.sockets.emit('end_waiting');
                }
            }, 1000);
        };
        return WaitingStage;
    })();

    const StageOne = (function(){//전략패턴 사용
        function StageOne(){}
        StageOne.prototype.start = function(){
            let count = 0;
            let stage = 1;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if(Math.floor(count) >= 7 && itemCount < itemMaximum ){
                    console.log(count);
                    itemGenerator();
                    itemCount++;
                }
                if (Math.floor(count) >= 15){
                    clearInterval(enemyInterval);
                    io.sockets.emit('stage_clear', {stage : stage+1});
                }
            }, enemyFrequency);
        };
        return StageOne;
    })();

    const StageTwo = (function(){//전략패턴 사용
        function StageTwo(){}
        StageTwo.prototype.start = function(){
            let count = 0;
            let stage = 2;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 900;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if(Math.floor(count) >= 7 && itemCount < itemMaximum ){
                    console.log(count);
                    itemGenerator();
                    itemCount++;
                }
                if (Math.floor(count) >= 16){
                    clearInterval(enemyInterval);
                    io.sockets.emit('stage_clear', {stage : stage+1});
                }
            }, enemyFrequency);
        };
        return StageTwo;
    })();

    const StageThree = (function(){//전략패턴 사용
        function StageThree(){}
        StageThree.prototype.start = function(){
            let count = 0;
            let stage = 3;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 800;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if(Math.floor(count) >= 7 && itemCount < itemMaximum ){
                    console.log(count);
                    itemGenerator();
                    itemCount++;
                }
                if (Math.floor(count) >= 18){
                    clearInterval(enemyInterval);
                    io.sockets.emit('stage_clear', {stage : stage+1});
                }
            }, enemyFrequency);
        };
        return StageThree;
    })();



    let stageStrategy = new Stage();
    let stageOne = new StageOne;
    let waitingStage = new WaitingStage;
    let stageTwo = new StageTwo;
    let stageThree = new StageThree;


    let host = balls[0].id;
    socket.on('start', function(data){
        isAccessFail= true;
        if(host == data.id){
            if(data.waiting == false){
                if(data.stage == 1){
                    io.sockets.emit('start_game');
                    stageStrategy.setStage(stageOne);
                    stageStrategy.start();
                }
                else if(data.stage == 2){
                    io.sockets.emit('start_game');
                    stageStrategy.setStage(stageTwo);
                    stageStrategy.start();
                }
                else if(data.stage == 3){
                    io.sockets.emit('start_game');
                    stageStrategy.setStage(stageThree);
                    stageStrategy.start();
                }
            }else
            {
                stageStrategy.setStage(waitingStage);
                stageStrategy.start();
            }
        }

    })



    socket.on('collision_detect', function(data){
        for( var i = 0 ; i < balls.length; i++){
            if(balls[i].id == data.id){
                balls[i].state = 0;
                break;
            }
        }
        socket.broadcast.emit('collision_update', {id : data.id})
        isFail = stageFail();
        if(isFail){
            io.sockets.emit('game_over', {isFail: true})
        }
    })

    socket.on('item_detect', function(){
        io.sockets.emit('coffee_effect', {coffee : true});
    })


    const itemRadius=20;

    function itemLeftSideGenerator(){
        if(balls.length){
            var randomStartY = Math.floor(Math.random() * 768)
            var randomDestinationY = Math.floor(Math.random() * 768)
            io.sockets.emit('item_generator', {
                wall: 0,
                startingX: itemRadius,
                startingY: randomStartY,
                destinationX: canvasWidth+itemRadius,
                destinationY: randomDestinationY
            })
        }
    }

    function itemRightSideGenerator(){
        if(balls.length){
            var randomStartY = Math.floor(Math.random() * 768)
            var randomDestinationY = Math.floor(Math.random() * 768)
            io.sockets.emit('item_generator', {
                wall: 1,
                startingX: canvasWidth+itemRadius,
                startingY: randomStartY,
                destinationX: itemRadius,
                destinationY: randomDestinationY
            })
        }
    }

    function itemUpSideGenerator(){
        if(balls.length){
            var randomStartX = Math.floor(Math.random() * 1024)
            var randomDestinationX = Math.floor(Math.random() * 1024)
            io.sockets.emit('item_generator', {
                wall: 2,
                startingX: randomStartX,
                startingY: itemRadius,
                destinationX: randomDestinationX,
                destinationY: canvasHeight+itemRadius
            })
        }
    }

    function itemDownSideGenerator(){
        if(balls.length){
            var randomStartX = Math.floor(Math.random() * 1024)
            var randomDestinationX = Math.floor(Math.random() * 1024)
            io.sockets.emit('item_generator', {
                wall: 3,
                startingX: randomStartX,
                startingY: canvasHeight+itemRadius,
                destinationX: randomDestinationX,
                destinationY: itemRadius
            })
        }
    }

    function itemGenerator(){
        k = Math.floor(Math.random)*4
        if(k == 0){
            itemLeftSideGenerator();
        }
        else if(k == 1){
            itemRightSideGenerator();
        }
        else if(k==2){
            itemUpSideGenerator();
        }
        else{
            itemDownSideGenerator();
        }
    }


    function stageFail(){
        var isFail = true;
        for(let i = 0 ; i < balls.length ; i++){
            if(balls[i].state == 1){
                isFail = false;
            }
        }
        return isFail;
    }
})