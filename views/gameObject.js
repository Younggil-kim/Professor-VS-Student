
        class PlayerBall{
            constructor(id,color,x,y){
                this.id = id;
                this.x = x;
                this.y = y;
                this.color = color;
                this.state = 1;
                this.radius = 16;
                this.playerSpeed = 4;
            }
            getId(){
                return this.id;
            }
            setId(id){
                this.id = id;
            }
            getX(){
                return this.x;
            }
            setX(x){
                this.x = x;
            }
            getY(){
                return this.y;
            }
            setY(y){
                this.y = y;
            }
            getColor(){
                return this.color;
            }
            setColor(color){
                this.color = color;
            }
            getState(){
                return this.state;
            }
            setState(state){
                this.state = state;
            }
            getRadius(){
                return this.radius;
            }
            setRadius(radius){
                this.radius = radius;
            }
            getPlayerSpeed(){
                return this.playerSpeed;
            }
            setPlayerSpeed(playerSpeed){
                this.playerSpeed = playerSpeed;
            }
        }

class EnemyBall{
    constructor(x,y,destinationX,destinationY, wall){

        this.color = "#000000";
        this.x = x;
        this.y = y;
        this.destinationX = destinationX;
        this.destinationY = destinationY;
        this.initialX = x;
        this.initialY = y;
        this.wall = wall;
        this.radius = 10;
        this.aliveTime = 300;
        this.speedX = 0;
        this.speedY = 0;
    }
    getSpeedX(){
        return this.speedX;
    }
    setSpeedX(speedX){
        this.speedX = speedX;
    }

    getSpeedY(){
        return this.speedY;
    }
    setSpeedY(speedY){
        this.speedY = speedY;
    }

    getColor(){
        return this.color;
    }
    setColor(color){
        this.color = color;
    }
    getX(){
        return this.x;
    }
    setX(x){
        this.x = x;
    }
    getY(){
        return this.y;
    }
    setY(y){
        this.y = y;
    }
    getDestinationX(){
        return this.destinationX;
    }
    setDestinationX(destinationX){
        this.destinationX = destinationX;
    }
    getDestinationY(){
        return this.destinationY;
    }
    setDestinationY(destinationY){
        this.destinationY = destinationY;
    }
    getInitialX(){
        return this.initialX;
    }
    setInitialX(initialX){
        this.initialX = initialX;
    }
    getInitialY(){
        return this.initialY;
    }
    setInitialY(initialY){
        this.initialY = initialY;
    }
    getWall(){
        return this.wall;
    }
    setWall(wall){
        this.wall = wall;
    }
    getRadius(){
        return this.radius;
    }
    setRadius(radius){
        this.radius = radius;
    }
    getAliveTime(){
        return this.aliveTime;
    }
    setAliveTime(aliveTime){
        this.aliveTime = aliveTime;
    }
}

class straightEnemyBall{
    constructor(x,y,destinationX,destinationY, wall){

        this.color = "#000000";
        this.x = x;
        this.y = y;
        this.destinationX = destinationX;
        this.destinationY = destinationY;
        this.initialX = x;
        this.initialY = y;
        this.wall = wall;
        this.radius = 10;
        this.aliveTime = 300;
    }
    getColor(){
        return this.color;
    }
    setColor(color){
        this.color = color;
    }
    getX(){
        return this.x;
    }
    setX(x){
        this.x = x;
    }
    getY(){
        return this.y;
    }
    setY(y){
        this.y = y;
    }
    getDestinationX(){
        return this.destinationX;
    }
    setDestinationX(destinationX){
        this.destinationX = destinationX;
    }
    getDestinationY(){
        return this.destinationY;
    }
    setDestinationY(destinationY){
        this.destinationY = destinationY;
    }
    getInitialX(){
        return this.initialX;
    }
    setInitialX(initialX){
        this.initialX = initialX;
    }
    getInitialY(){
        return this.initialY;
    }
    setInitialY(initialY){
        this.initialY = initialY;
    }
    getWall(){
        return this.wall;
    }
    setWall(wall){
        this.wall = wall;
    }
    getRadius(){
        return this.radius;
    }
    setRadius(radius){
        this.radius = radius;
    }
    getAliveTime(){
        return this.aliveTime;
    }
    setAliveTime(aliveTime){
        this.aliveTime = aliveTime;
    }
}

class itemBall{
    constructor(x,y,destinationX,destinationY, wall, name){

        this.color = "#6f4e37";
        this.x = x;
        this.y = y;
        this.destinationX = destinationX;
        this.destinationY = destinationY;
        this.initialX = x;
        this.initialY = y;
        this.wall = wall;
        this.radius = 20;
        this.aliveTime = 1000;
        this.name = name;
    }
    getName(){
        return this.name;
    }
    setName(name){
        this.name = name;
    }
    getColor(name){
        if(name == "coffee"){
            return this.color;
        }
        else if(name == "hotsix"){
            return "#0067a3";
        }
        
    }
    setColor(color){
        this.color = color;
    }
    getX(){
        return this.x;
    }
    setX(x){
        this.x = x;
    }
    getY(){
        return this.y;
    }
    setY(y){
        this.y = y;
    }
    getDestinationX(){
        return this.destinationX;
    }
    setDestinationX(destinationX){
        this.destinationX = destinationX;
    }
    getDestinationY(){
        return this.destinationY;
    }
    setDestinationY(destinationY){
        this.destinationY = destinationY;
    }
    getInitialX(){
        return this.initialX;
    }
    setInitialX(initialX){
        this.initialX = initialX;
    }
    getInitialY(){
        return this.initialY;
    }
    setInitialY(initialY){
        this.initialY = initialY;
    }
    getWall(){
        return this.wall;
    }
    setWall(wall){
        this.wall = wall;
    }
    getRadius(){
        return this.radius;
    }
    setRadius(radius){
        this.radius = radius;
    }
    getAliveTime(){
        return this.aliveTime;
    }
    setAliveTime(aliveTime){
        this.aliveTime = aliveTime;
    }
}
