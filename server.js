//server.js
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);


server.listen(8000, () => {
    console.log("서버가 대기중입니다.");
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')

})

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

let enemyGenerator;


io.on('connection', function(socket) {
    console.log(`${socket.id}님이 입장하셨습니다.`);

    socket.on('disconnect', function(reason){
        console.log(`${socket.id}님이 ${reason}의 이유로 퇴장하셨습니다. `)
        endGame(socket);
        io.sockets.emit('leave_user', socket.id);
        if(balls.length == 0){
            clearInterval(enemyGenerator)
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

    socket.on('send_location', function(data) {
            socket.broadcast.emit('update_state', {
                id: data.id,
                x: data.x,
                y: data.y,
            })
    })

    let host = balls[0].id;
    socket.on('start', function(data){
        if(host == data.id){
            enemyGenerator = setInterval(function() {
                if(balls.length){ 
                    var decideWall = Math.floor(Math.random()*4);
                    if( decideWall == 0){
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
                    else if( decideWall == 1){
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
                    else if( decideWall == 2){
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
                    else if( decideWall == 3){
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
                }, 1000)

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
    })

})

