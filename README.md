# MediaSoftwareEngineering

# Professor VS Student
- This is a project that worked on while taking the Media Software Engineering class.
- It's a simple bullet hell Web game. However, this game is supported by multiplayer.
- If you access the URL below, you can play.
- Play URL : https://media-software-engineering.herokuapp.com/

## Installation
- Node.js must be installed as required.
- either through cloning with git or by using npm (the recommended way)
```
  npm install express
  npm install socket.io
  npm install bootstrap
```
- When the dependencies are completely installed, enter below.
```
  npm run start
```
- http://localhost:8000/ is default setting. If you join url, you can play game. 

## Folder architecture
```
├── README.md                 - Readme File
│
├── views/                       - Client side folder
│   ├── badending.html        - Bad ending page html file
│   ├── goodending.html       - Good ending page html file
│   │── gameObject.js         - Game Object collection
│   │── index.html            - Client Side Rendering file
│   │── keyHandler.js         - Object key Handler file
│   │ 
│   ├── images/                  - Client image folder
│   │   ├── ending.jpg        - Bad ending image
│   │   ├── good.png          - Good ending image
│   │   ├── professor.png     - Game canvas background image
│   │
│   ├── sounds/                  
│   │   ├── invisibleSizeDown.mp3    - BackgroundMusic
│   │  
│   │   
│      
├── .gitignore                - git ignore file management
├── package-lock.json              
├── package.json              - dependencies & version setting
├── server.js                 - socket connection server
```


## How to Play
1. Access to the corresponding url.
- > https://media-software-engineering.herokuapp.com

2. The first person to access the game is player 0 and host. 
- > Only the host can start the game

3. When the game starts, avoid enemies everywhere that fly to you.

4. The operation is simple. Use your arrow key to avoid flying enemies.

5. If you pass all stages(8 stages), you will win. (I still haven't reached it.)

6. In multiplayer mode, if at least one person is alive, all of them will be revived in the next stage.

7. Eating an item will have a beneficial effect on the player (so that you can get as much as you can!). GOOD LUCK!


## Precautions
1. If the game is running or more than 7 people are connected at the same time, you cannot access it.
- > Please wait until one game is over.
2. Before you play, adjust the game window to fit your screen size. (With Control + Mouse Wheel)
