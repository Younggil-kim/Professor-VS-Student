
        var professor = '/views/images/professor.png';
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");

        var balls  = [];
        var ballMap = {};
        var myId;

        var rightPressed = false;
        var leftPressed = false;
        var upPressed = false;
        var downPressed = false;

        const nickName = localStorage.getItem("nickName")
        document.addEventListener("keydown", keyDownHandler,false);
        document.addEventListener("keyup", keyUpHandler,false);

        function joinUser(id,color,x,y){
            let ball = new PlayerBall(id,color,x,y);
            ball.setColor(color);
            ball.setX(x);
            ball.setY(y);

            balls.push(ball);
            ballMap[id] = ball;

            return ball;
        }
        function leaveUser(id){
            for(var i = 0 ; i < balls.length; i++){
                if(balls[i].getId() == id){
                    balls.splice(i,1);
                    break;
                }
            }
            delete ballMap[id];
        }
        function updateState(id,x,y){
            let ball = ballMap[id];
            if(!ball){
                return;
            }
            ball.setX(x);
            ball.setY(y);
        }
        function sendData() {
            let curPlayer = ballMap[myId];
            let data = {};
            data = {
                id: curPlayer.getId(),
                x: curPlayer.getX(),
                y: curPlayer.getY(),
            };
            if(data){
                socket.emit("send_location", data);
            }
        }
        function collisionDetection(){
            let ball = ballMap[myId]
            for(var i = 0; i < enemys.length ; i++){
                if(  Math.sqrt((ball.getX() - enemys[i].getX())**2 + (ball.getY() - enemys[i].getY())**2) <= enemys[i].getRadius() + ball.getRadius()){
                    ball.setState(0);
                    socket.emit('collision_detect', {id : ball.getId()});
                    break;
                }
            }
            for(var i = 0; i < straightEnemys.length ; i++){
                if(  Math.sqrt((ball.getX() - straightEnemys[i].getX())**2 + (ball.getY() - straightEnemys[i].getY())**2) <= straightEnemys[i].getRadius() + ball.getRadius()){
                    ball.setState(0);
                    socket.emit('collision_detect', {id : ball.getId()});
                    break;
                }
            }
        }
        
        function acquireDetection(){
            let ball = ballMap[myId]
            for(var i = 0; i < items.length ; i++){
                if( ball.getState() != 0 && Math.sqrt((ball.getX() - items[i].getX())**2 + (ball.getY() - items[i].getY())**2) <= ball.getRadius() + items[i].getRadius()){
                    socket.emit('item_detect', {name : items[i].getName()});//보낼때 아이템 정보 보내주기
                    items.splice(i,1);
                    break;
                }
            }
        }
        
        var socket = io();

        socket.on('user_id', function(data){
            myId = data;
        });
        socket.on('join_user', function(data){
            joinUser(data.id, data.color, data.x, data.y);
        })
        socket.on('leave_user', function(data){
            leaveUser(data);
        })
        socket.on('update_state', function(data){
            updateState(data.id, data.x, data.y);
        })
        
        socket.on('collision_update', function(data){
            for( var i = 0 ; i < balls.length; i++){
            if(balls[i].getId() == data.id){
                balls[i].setState(0);
                break;
            }
        }
        })

        
        var enemys = [];
        var straightEnemys = [];
        var items = [];

        let hotsixEffect = false;

        socket.on('force_disconnect', function(data){
            Swal.fire({
                title: "게임 알림",
                text: "현재 게임 중입니다. 나중에 접속 해 주세요.",
                confirmButtonText: "네",
                confirmButtonColor: '#FC5296'
            });
            window.close();
            self.close();
            window.opener = window.location.href; self.close();
            window.open('about:blank', '_self').close();   
        })
        socket.on('enemy_generator', function(data){
            if(hotsixEffect == false){

                let enemy = new EnemyBall(data.startingX, data.startingY, data.destinationX, data.destinationY, data.wall)
                enemys.push(enemy);                
            }

        })
    

        socket.on('straight_enemy_generator', function(data){
            console.log('hello');
            let straightEnemy = new straightEnemyBall(data.startingX, data.startingY, data.destinationX, data.destinationY, data.wall)
            straightEnemys.push(straightEnemy);
            console.log(straightEnemys);
        })


        socket.on('item_generator', function(data){
            let item = new itemBall(data.startingX, data.startingY, data.destinationX, data.destinationY, data.wall, data.name)
            items.push(item);
            console.log(items);
        })

        let coffeeEffect = false;
        socket.on('coffee_effect', function(data){
            coffeeEffect = data.coffee;
        })
        let stopTimer = 0;
        socket.on('hotsix_effect', function(data){
            hotsixEffect = data.hotsix;
            stopTimer = timer;
        })


        let stage = 1;
        socket.on('stage_number', function(data){
            stage = data.stage;
            timer = data.timer;
            console.log(stage)
        })


        socket.on('game_over', function(data){//전 플레이어가 죽으면 나오는 이벤트
            if (data.isFail){
                stage = 1;
                Swal.fire({
                    title: "게임 알림",
                    text: "교수님이 이겼습니다.",
                    confirmButtonText: "아니..",
                    confirmButtonColor: '#FC5296'
                }).then((result)=> {

                    location.href= "/bad";
                })
            }
        })

        socket.on('game_win', function(data){
            stage = 1;
            Swal.fire({
                title: "게임 알림",
                text: "당신이 이겼습니다! 축하드립니다.",
                confirmButtonText: "확인",
                confirmButtonColor: '#FC5296'
            }).then((result) => {
                location.href= "/good";
            })
        })



        function renderStage(){
            ctx.beginPath();
            ctx.fillStyle = '#000000';
            ctx.font = '30px Arial';
            ctx.fillText(`Stage ${stage}`,30,30);
            ctx.closePath();
        }


        function renderPlayers(){
            let curPlayer = ballMap[myId];
            for (let i = 0; i < balls.length; i++) {
                    let ball = balls[i];
                    if (ball.getState() == 0){
                        continue
                    }
                    ctx.beginPath();
                    ctx.fillStyle = ball.getColor();
                    ctx.arc(ball.getX(), ball.getY(), ball.getRadius(), 0, Math.PI * 2, false);
                    ctx.fill();
                    ctx.closePath();

                    if( ball == curPlayer){

                        ctx.beginPath();
                        ctx.font = '15px Arial';
                        ctx.fillText(`${nickName}`,ball.getX()- ball.getRadius()-7, ball.getY() - ball.getRadius());
                        ctx.closePath();
                    }else{
                        ctx.beginPath();
                        ctx.font = '15px Arial';
                        ctx.fillText(`plater${i}`,ball.getX()- ball.getRadius()-7, ball.getY() - ball.getRadius());
                        ctx.closePath();
                    }
                }
                
                if (rightPressed){
                    if (curPlayer.getX() <= 1024 - curPlayer.getRadius()){
                        curPlayer.setX(curPlayer.getX() + curPlayer.getPlayerSpeed());
                    }
                }
                if (leftPressed ){
                    if(curPlayer.getX() >= 0 + curPlayer.getRadius()){
                        curPlayer.setX(curPlayer.getX() - curPlayer.getPlayerSpeed());
                    }
                }
                if(upPressed ){
                    if(curPlayer.getY() >= 0 + curPlayer.getRadius()){
                        curPlayer.setY(curPlayer.getY() - curPlayer.getPlayerSpeed());
                    }
                }
                if(downPressed ){
                    if(curPlayer.getY() <= 768 - curPlayer.getRadius()){
                        curPlayer.setY(curPlayer.getY() + curPlayer.getPlayerSpeed());
                    }
                }
        }

        function renderEnemys(){
            for (let j = 0; j < enemys.length; j++){
                    let enemy = enemys[j];
                    ctx.beginPath();
                    ctx.fillStyle = enemy.getColor();
                    ctx.arc(enemy.getX(), enemy.getY(), enemy.getRadius(), 0, Math.PI *2, false);
                    ctx.fill();
                    ctx.closePath();

                }
                for ( let k = 0 ; k < enemys.length; k++){
                    let enemy = enemys[k];
                    var distanceX = Math.abs(enemy.getDestinationX() - enemy.getInitialX());
                    var distanceY = Math.abs(enemy.getDestinationY() - enemy.getInitialY());
                    var speedY = distanceY/enemy.getAliveTime();
                    var speedX = distanceX/enemy.getAliveTime();
                    enemy.setSpeedX(speedX);
                    enemy.setSpeedY(speedY);
                    if(hotsixEffect){
                        items.length = 0;
                        enemy.setSpeedX(0);
                        enemy.setSpeedY(0);
                        enemy.setX(enemy.getX());
                        enemy.setY(enemy.getY());
                        if(Math.abs(stopTimer- timer) >= 3){
                            hotsixEffect = false;
                        }
                        
                    }
                        if(enemy.getWall() == 0){//leftSide
                            if (enemy.getDestinationY() >= enemy.getY()){
                                enemy.setX(enemy.getX() + enemy.getSpeedX());
                                enemy.setY(enemy.getY() + enemy.getSpeedY());
                            }
                            else{
                                enemy.setX(enemy.getX() + enemy.getSpeedX());
                                enemy.setY(enemy.getY() - enemy.getSpeedY());
                            }
                        }
                        else if (enemy.getWall() == 1){
                            if (enemy.getDestinationY() >= enemy.getY()){
                                enemy.setX(enemy.getX() - enemy.getSpeedX());
                                enemy.setY(enemy.getY() + enemy.getSpeedY());

                            }
                            else{
                                enemy.setX(enemy.getX() - enemy.getSpeedX());
                                enemy.setY(enemy.getY() - enemy.getSpeedY());

                            }
                        }
                        else if (enemy.getWall() == 2){
                            if (enemy.getDestinationX() >= enemy.getX()){
                                enemy.setX(enemy.getX() + enemy.getSpeedX());
                                enemy.setY(enemy.getY() + enemy.getSpeedY());
                            }
                            else{
                                enemy.setX(enemy.getX() - enemy.getSpeedX());
                                enemy.setY(enemy.getY() + enemy.getSpeedY());
                            }
                        }
                        else if (enemy.getWall() == 3){
                            if (enemy.getDestinationX() >= enemy.getX()){
                                enemy.setX(enemy.getX() + enemy.getSpeedX());
                                enemy.setY(enemy.getY() - enemy.getSpeedY());
                            }
                            else{
                                enemy.setX(enemy.getX() - enemy.getSpeedX());
                                enemy.setY(enemy.getY() - enemy.getSpeedY());
                            }
                        }
                        
                        if (enemy.getX() < -100 || enemy.getX() > 1400 || enemy.getY() < -100 || enemy.getY() > 1400){
                        enemys.splice(k,1);
                    }
                
            }
        }

        function renderStraightEnemys(){
            for (let j = 0; j < straightEnemys.length; j++){
                    let straightEnemy = straightEnemys[j];
                    ctx.beginPath();
                    ctx.fillStyle = straightEnemy.getColor();
                    ctx.arc(straightEnemy.getX(), straightEnemy.getY(), straightEnemy.getRadius(), 0, Math.PI *2, false);
                    ctx.fill();
                    ctx.closePath();

                }
                for ( let k = 0 ; k < straightEnemys.length; k++){
                    let straightEnemy = straightEnemys[k];
                    var distanceX = Math.abs(straightEnemy.getDestinationX() - straightEnemy.getInitialX());
                    var distanceY = Math.abs(straightEnemy.getDestinationY() - straightEnemy.getInitialY());
                    var speedY = distanceY/straightEnemy.getAliveTime()/1.5;
                    var speedX = distanceX/straightEnemy.getAliveTime()/1.5;
                    if(straightEnemy.getWall() == 0){//leftSide
                        if (straightEnemy.getDestinationY() >= straightEnemy.getY()){
                            straightEnemy.setX(straightEnemy.getX() + speedX);
                            straightEnemy.setY(straightEnemy.getY() + speedY);
                        }
                        else{
                            straightEnemy.setX(straightEnemy.getX() + speedX);
                            straightEnemy.setY(straightEnemy.getY() - speedY);
                        }
                    }
                    else if (straightEnemy.getWall() == 1){
                        if (straightEnemy.getDestinationY() >= straightEnemy.getY()){
                            straightEnemy.setX(straightEnemy.getX() - speedX);
                            straightEnemy.setY(straightEnemy.getY() + speedY);

                        }
                        else{
                            straightEnemy.setX(straightEnemy.getX() - speedX);
                            straightEnemy.setY(straightEnemy.getY() - speedY);

                        }
                    }
                    else if (straightEnemy.getWall() == 2){
                        if (straightEnemy.getDestinationX() >= straightEnemy.getX()){
                            straightEnemy.setX(straightEnemy.getX() + speedX);
                            straightEnemy.setY(straightEnemy.getY() + speedY);
                        }
                        else{
                            straightEnemy.setX(straightEnemy.getX() - speedX);
                            straightEnemy.setY(straightEnemy.getY() + speedY);
                        }
                    }
                    else if (straightEnemy.getWall() == 3){
                        if (straightEnemy.getDestinationX() >= straightEnemy.getX()){
                            straightEnemy.setX(straightEnemy.getX() + speedX);
                            straightEnemy.setY(straightEnemy.getY() - speedY);
                        }
                        else{
                            straightEnemy.setX(straightEnemy.getX() - speedX);
                            straightEnemy.setY(straightEnemy.getY() - speedY);
                        }
                    }
                    
                    if (straightEnemy.getX() < -100 || straightEnemy.getX() > 1400 || straightEnemy.getY() < -100 || straightEnemy.getY() > 1400){
                        straightEnemys.splice(k,1);
                    }
                }
        }

        
        function renderItems(){
            for (let j = 0; j < items.length; j++){
                    let item = items[j];
                    if(item.getName() == "coffee"){
                        ctx.beginPath();
                        ctx.fillStyle = item.getColor("coffee");
                        ctx.arc(item.getX(), item.getY(), item.getRadius(), 0, Math.PI *2, false);
                        ctx.fill();
                        ctx.closePath();


                        ctx.beginPath();
                        ctx.font = '15px Arial';
                        ctx.fillStyle = '#6f4e37';
                        ctx.fillText(`ITEM_COFFEE`, item.getX()-item.getRadius()-20,item.getY()-item.getRadius());
                        ctx.closePath();
                    }
                    else if(item.getName() == "hotsix"){
                        ctx.beginPath();
                        ctx.fillStyle = item.getColor("hotsix");
                        ctx.arc(item.getX(), item.getY(), item.getRadius(), 0, Math.PI *2, false);
                        ctx.fill();
                        ctx.closePath();

                        ctx.beginPath();
                        ctx.font = '15px Arial';
                        ctx.fillStyle = '#0067a3';
                        ctx.fillText(`ITEM_HOTSIX`, item.getX()-item.getRadius()-20,item.getY()-item.getRadius());
                        ctx.closePath();
                    }

                }
                for ( let k = 0 ; k < items.length; k++){
                    let item = items[k];
                    var distanceX = Math.abs(item.getDestinationX() - item.getInitialX());
                    var distanceY = Math.abs(item.getDestinationY() - item.getInitialY());
                    var speedY = distanceY/item.getAliveTime();
                    var speedX = distanceX/item.getAliveTime();
                    if(item.getWall() == 0){//leftSide
                        if (item.getDestinationY() >= item.getY()){
                            item.setX(item.getX() + speedX);
                            item.setY(item.getY() + speedY);
                        }
                        else{
                            item.setX(item.getX() + speedX);
                            item.setY(item.getY() - speedY);
                        }
                    }
                    else if (item.getWall() == 1){
                        if (item.getDestinationY() >= item.getY()){
                            item.setX(item.getX() - speedX);
                            item.setY(item.getY() + speedY);
                        }
                        else{
                            item.setX(item.getX() - speedX);
                            item.setY(item.getY() - speedY);

                        }
                    }
                    else if (item.getWall() == 2){
                        if (item.getDestinationX() >= item.getX()){
                            item.setX(item.getX() + speedX);
                            item.setY(item.getY() + speedY);
                        }
                        else{
                            item.setX(item.getX() - speedX);
                            item.setY(item.getY() + speedY);
                        }
                    }
                    else if (item.getWall() == 3){
                        if (item.getDestinationX() >= item.getX()){
                            item.setX(item.getX() + speedX);
                            item.setY(item.getY() - speedY);

                        }
                        else{
                            item.setX(item.getX() - speedX);
                            item.setY(item.getY() - speedY);
                        }
                    }
                    
                    if (item.getX() < -100 || item.getX() > 1400 || item.getY() < -100 || item.getY() > 1400){
                        items.splice(k,1);
                    }
                }
        }

        let timer = 15.00;
        function renderTimer(){
            ctx.beginPath();
            ctx.fillStyle = '#000000';
            ctx.font = '20px Arial';
            ctx.fillText(`Timer ${timer.toFixed(2)}`,30,50);
            ctx.closePath();

        }

        function renderClearMessage(){
            ctx.beginPath();
            ctx.fillStyle = '#000000';
            ctx.font = '50px Arial';
            ctx.fillText(`Stage ${stage-1} Clear!!`,1024/2-150, 730-50);
            ctx.fillText(`The next stage will start shortly.`,1024/2-350, 730);
            ctx.closePath();
        }



        function renderGame() {            

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                collisionDetection();
                renderStage();
                renderPlayers();
                renderEnemys();
                renderStraightEnemys();
                renderItems();
                renderTimer();
    
                if(stageClear){
                    renderClearMessage();
                }
                acquireDetection();
                if(coffeeEffect){
                    enemys.length = 0;
                    straightEnemys.length = 0;
                    items.length = 0;
                    coffeeEffect = false;
                }

                if(balls.length){
                    sendData();
                }
                if(isStart){
                    timer -= 0.010;
                    if(parseInt(timer) <= 0){
                        timer = 0;
                    }
                }
                renderTimer();
            }
        
        var isStart = false;
      
        function update() {
            renderGame();
        }

        setInterval(update, 10);

        function start(){
            if(!isStart){
                socket.emit('start', { id: myId, stage : stage, waiting : false, isStart : true});
            }
        }

        socket.on('start_game', function(){
            isStart = true;
            let bgm = document.getElementById("bgm");
            bgm.volume = 0.3;
            bgm.play();
        })
        let stageClear = false;
        socket.on('stage_clear',function(data){//스테이지 하나가 끝난 상태
            stageClear = true;
            enemys.length = 0;
            straightEnemys.length = 0;
            items.length = 0;
            for (var i = 0 ; i < balls.length ; i++){
                if( balls[i].getState() == 0){
                    balls[i].setX(1024/2);
                    balls[i].setY(768/2);
                    balls[i].setState(1);
                }
            }

            isStart = false;
            socket.emit('start', { id: myId, stage : stage, waiting : true});//웨이팅 스테이지로 이동
            stage = data.stage;//스테이지 1 업 시켜주기
        })
        socket.on('end_waiting', function(){//웨이팅이 끝난상태
            timer = 15;
            stageClear = false;
            isStart = false;
            socket.emit('start', { id: myId, stage : stage, waiting : false});            
        })


        