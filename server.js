//server.js
const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const fs = require('fs');
//8000번 포트에서 서버 실행
app.listen(8000);

//index.html파일을 읽어오는 코드
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

//플레이어 색상 랜덤값으로 지정
function getPlayerColor(){
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}


const startX = 1024/2;
const startY = 768/2;

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
        socket.broadcast.emit('leave_user', socket.id);
    });

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
})

