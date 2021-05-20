//server.js
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


server.listen(process.env.PORT || 8000, () => {
    console.log("서버가 대기중입니다.");
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.use('/views/keyHandler', express.static(__dirname+ '/views/keyHandler.js'))


function getPlayerColor(){
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

const canvasWidth = 1024;
const canvasHeight = 768;

const startX = canvasWidth/2;
const startY = canvasHeight/2;

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
let stage = 2;
let isAccessFail = false;
let enemyGeneratorInterval;
let enemyFrequency = 800;
let itemGeneratorInterval;
let itemFrequency = 15000;

io.on('connection', function(socket) {
    console.log(`${socket.id}님이 입장하셨습니다.`);

    socket.on('disconnect', function(reason){
        console.log(`${socket.id}님이 ${reason}의 이유로 퇴장하셨습니다. `)
        endGame(socket);
        io.sockets.emit('leave_user', socket.id);
        if(balls.length == 0){
            clearInterval(enemyGeneratorInterval);
            clearInterval(stageGenerator);
            clearInterval(itemGeneratorInterval);
            stage = 2;
            timer = 10;
            enemyFrequency = 800;
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
        enemyGeneratorInterval = setInterval(function (){
            enemyLeftSideGenerator();
            enemyRightSideGenerator();
            enemyUpSideGenerator();
            enemyDownSideGenerator();
        }, enemyFrequency);
    }


    let host = balls[0].id;
    socket.on('start', function(data){
        isAccessFail= true;
        if(host == data.id){
            enemyGenerator();
            itemGenerator();
            stageStart();
            io.sockets.emit('start_game');
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
        itemGeneratorInterval = setInterval(function(){
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
            
        }, itemFrequency);
    }

    function stageClear(){
        stage = stage + 1;
        if (enemyFrequency > 200){
            enemyFrequency -= 100;
        }
        clearInterval(enemyGeneratorInterval);
        enemyGenerator();
    }


    function stageStart(){//스테이지 시작제어, 10초당 1스테이지
        stageGenerator = setInterval(
            function(){
                io.sockets.emit('stage_number', {stage : stage, timer : 10});
                if(stage == 9){
                    io.sockets.emit('game_win', {isWin: true});
                }
                if(stage <= 8){
                    stageClear();
                }

            }
        , 10000)

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