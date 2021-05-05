var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8000);

function handler (req, res) {
    fs.readFile(__dirname + '/views/index.html', function( err, data) {
        if(err){
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
}

//플레이어 색상 랜덤값으로 지정하기
function getPlayerColor(){
    let colorMax = 16711680;
    let colorMin = 255;
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
    //최소값 255, 최대값 16,711,680
}

class InputData{
    constructor(num){
        this.num = num;
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
    }
}

const startX = 1024/2;
const startY = 768/2;
class PlayerBall{
    constructor(socket){
        this.socket = socket;
        this.x = Math.random()*1024;
        this.y = Math.random()*768;
        this.color = getPlayerColor();
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

io.on('connection', function(socket) {
    console.log(`${socket.id}님이 입장하셨습니다.`);

    socket.on('disconnect', function(reason){
        console.log(`${socket.id}님이 퇴장하셨습니다. `)
        endGame(socket);
        socket.broadcast.emit('leave_user', socket.id);
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
})

var previousUpdateTime = new Date().getTime();
var stateNum = 0;

function updateGame(){
    let currentUpdateTime = new Date().getTime();
    let deltaTime = currentUpdateTime- previousUpdateTime;
    previousUpdateTime = currentUpdateTime;

    let timeRate = deltaTime /(1000/60);

    for(var i = 0 ; i < balls.length; i++){
        let ball = balls[i];
    }
    setTimeout(updateGame, 16);
}

function broadcastState(){
    stateNum += 1;

    let data = {};

    data.state_num = stateNum;

    for(var i = 0 ; i < balls.length ; i++ ){
        let ball = balls[i];

        data[ball.id] = {
            last_input_num: ball.lastInputNum,
            x: ball.x,
            y: ball.y,
        };
    }

    io.sockets.emit('update_state', data);

    setTimeout(broadcastState, 33);
}

updateGame();
broadcastState();