//server.js
// const app = require('http').createServer(handler);
const app = require('express')();
const server = require('http').Server(app);

const io = require('socket.io')(server);
// const fs = require('fs');
//8000번 포트에서 서버 실행
// app.listen(8000);

server.listen(8000, () => {
    console.log("서버가 대기중입니다.");
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')

})

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/views/room.html')

// })

//index.html파일을 읽어오는 코드
// function handler (req, res) {
//     fs.readFile(__dirname + '/views/index.html', function( err, data) {
//         if(err){
//             res.writeHead(500);
//             return res.end('Error loading index.html');
//         }
//         res.writeHead(200);
//         res.end(data);
//     });
// }

//플레이어 색상 랜덤값으로 지정
function getPlayerColor(){
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

const canvasWidth = 1024;
const canvasHeight = 768;

const startX = canvasWidth/2;
const startY = canvasHeight/2;

var enemyStartX = 0;
var enemyStartY = 0;
var enemyDestinationX = 0;
var enemyDestinationY = 0;
var enemyRadius = 10;

class PlayerBall{
    constructor(socket){
        this.socket = socket;
        this.x = startX;
        this.y = startY;
        this.color = getPlayerColor();
    }

    get id() {
        return this.socket.id;
    }
}
// var enemyStartX = enemyRadius;
// var enemyStartY = Math.floor(Math.random() * 768);

var enemySpeedX = 0;
var enemySpeedY = 0;
var enemyAliveTime = 400;

class EnemyLeftBall{
    constructor(){
        this.x = enemyRadius;
        this.y = Math.floor(Math.random() * 768);
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




io.on('connection', function(socket) {
    console.log(`${socket.id}님이 입장하셨습니다.`);
    socket.on('disconnect', function(reason){
        console.log(`${socket.id}님이 ${reason}의 이유로 퇴장하셨습니다. `)
        endGame(socket);
        io.sockets.emit('leave_user', socket.id);
    });

    // socket.on('move', function(){
    //     socket.broadcast.emit('move_gameroom');
    // })

    let newBall = joinGame(socket);
    socket.emit('user_id', socket.id);
    // 이미 있는 유저들의 데이터 보내기
    for (var i = 0 ; i < balls.length; i++){
        let ball = balls[i];
        socket.emit('join_user', {
            id: ball.id,
            x: ball.x,
            y: ball.y,
            color: ball.color,
        });
    }

    // 새로운 유저의 데이터 보내기
    socket.broadcast.emit('join_user',{
        id: socket.id,
        x: newBall.x,
        y: newBall.y,
        color: newBall.color,
    });

    //유저에게 변경사항 보내기
    socket.on('send_location', function(data) {
            socket.broadcast.emit('update_state', {
                id: data.id,
                x: data.x,
                y: data.y,
            })
    })


    setInterval(function() {
        if(balls.length){
            //5초정도 있다가 시작하게 바꾸기. 
            let host = balls[0].id;
            var decideWall = Math.floor(Math.random()*4);
            if( decideWall == 0){
                var randomStartY = Math.floor(Math.random() * 768)
                var randomdetiY = Math.floor(Math.random() * 768)
                io.sockets.emit('enemy_left', {
                    wall : 0,
                    startingX:  enemyRadius,
                    startingY:  randomStartY,
                    destinationX:  canvasWidth+enemyRadius,
                    destinationY: randomdetiY,
                })
            }
            else if( decideWall == 1){
                var randomStartY = Math.floor(Math.random() * 768)
                var randomdetiY = Math.floor(Math.random() * 768)
                io.sockets.emit('enemy_left', {
                    wall : 1,
                    startingX:  canvasWidth+enemyRadius,
                    startingY:  randomStartY,
                    destinationX:  enemyRadius,
                    destinationY: randomdetiY,
                })
            }
            else if( decideWall == 2){
                var randomStartX = Math.floor(Math.random() * 1024);
                var randomdetiX = Math.floor(Math.random() * 1024);
                io.sockets.emit('enemy_left', {
                    wall : 2,
                    startingX:  randomStartX,
                    startingY:  enemyRadius,
                    destinationX:  randomdetiX,
                    destinationY: canvasHeight+enemyRadius,
                })
            }
            else if( decideWall == 3){
                var randomStartX = Math.floor(Math.random() * 1024);
                var randomdetiX = Math.floor(Math.random() * 1024);
                io.sockets.emit('enemy_left', {
                    wall : 3,
                    startingX:  randomStartX,
                    startingY:  canvasHeight+enemyRadius,
                    destinationX:  randomdetiX,
                    destinationY: enemyRadius,
                })
            }

    }
    }, 1000)


})

