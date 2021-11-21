# MediaSoftwareEngineering

# Professor VS Student
## 개요
- 학교에서 Media Software Engineering을 수강하면서 만든 웹 게임입니다.
- 간단한 총알 피하기 게임이지만, 멀티플레이가 지원됩니다.
- [여기](https://media-software-engineering.herokuapp.com/)에서 플레이 해 볼 수 있습니다. 


## 로컬에서 설치하실 경우
- Node.js가 필요합니다.
- git, npm을 통해 클론 해 가실 경우, npm i를 터미널창에 입력해 주십시오.

```
  npm i
```

- 로컬에서 실행하실 경우 아래 코드를 터미널 창에 입력하십시오.
```
  npm run start
```
- http://localhost:8000/ 가 기본 세팅입니다. 
  
## 의존성 세팅
  
  ```
  node를 통해, 서버를 열기 위해 사용
  "express": "^4.17.1",
  
  실시간 멀티 플레이 환경을 위해 사용
  "socket.io": "^4.0.1"
  ```

## Folder architecture
```
├── README.md                 - Readme File
│
├── views/                    - Client side folder
│   ├── badEndingPage.html    - Bad ending page html file
│   ├── badEnding.css         - Bad ending page css file
│   ├── goodEndingPage.html   - Good ending page html file
│   ├── goodEnding.css        - Good ending page css file
│   ├── ranking.html          - Ranking page html file
│   ├── ranking.css           - Ranking page css file
│   ├── startPage.html        - Start page html file
│   ├── startPage.css         - Start page css file
│   ├── startPage.js          - Start page js file
│   ├── index.html            - Main game page html file
│   ├── gamePage.css          - Main game page css file
│   ├── gamePage.js           - Main game page js file
│   ├── header.js             - Header component js file
│   ├── header.css            - Header component css file
│   ├── retry.js              - Retry button event js file
│   ├── gameObject.js         - Game Object collection
│   │── keyHandler.js         - Object key Handler file
│   │ 
│   │
│   ├── sounds/                  
│   │   ├── invisibleSizeDown.mp3    - Background Music
│   │  
│   
│      
├── .gitignore                - git ignore file management
├── package-lock.json              
├── package.json              - dependencies & version setting
├── server.js                 - socket connection server
```


## How to Play
1. [링크](https://media-software-engineering.herokuapp.com)를 통해 게임에 접속한다.

2. 첫번째로 접속한 사람이 호스트이다.
- > 오직 호스트많이 게임을 시작 할 수 있다. 

4. 키보드의 방향키로 상하좌우로 움직일 수 있다.
  
5. 게임이 시작되면, 적들이 여기저기서 날아온다.
   
6. 적들을 피하면서 총 8 스테이지를 클리어하면 성공
- > 플레이어를 도와줄 아이템 (커피, 핫식스)가 생성된다.</br> 멀티 플레이로 플레이 할 시, 한명의 플레이어라도 남아있는 경우 다음 스테이지에 전원 부활이다.
  
7. Good Luck!




## 게임 화면
### 1. 첫 접속 시 

- 닉네임은 브라우저의 LocalStorage에 저장됩니다.
 <img width="100%" height="100%" src="https://user-images.githubusercontent.com/69848929/142234066-0d09be1c-d043-4055-b6c7-23e48326ac35.png"/>

### 2. 게임 플레이 화면
- 최대 7명에서 플레이 하실 수 있습니다.
- 게임이 진행 중인 경우 참여하실 수 없습니다. <개발 예정>
- 플레이어의 색이 랜덤으로 정해집니다. <선택 할 수 있도록 개발예정>
  <img width="100%" height="100%" src="https://user-images.githubusercontent.com/69848929/142234473-6deffc75-39f1-4049-ba0c-56a163888988.png"/>

### 3. 배드 엔딩
- 대학원 엔딩
<img width="100%" height="100%" src="https://user-images.githubusercontent.com/69848929/142235383-f436acef-8b1e-4243-89f9-d67ad1331264.png"/>

### 4. 해피 엔딩
- ~~행복한~~ 대학원 엔딩
<img width="100%" height="100%" src="https://user-images.githubusercontent.com/69848929/142235848-2c5f5597-d5a9-432a-b5aa-6e1884dacde6.png"/>


### 5. 랭킹 페이지
- 랭킹 데이터 연결 개발 예정
 <img width="100%" height="100%" src="https://user-images.githubusercontent.com/69848929/142236418-548e784c-4c44-4159-9959-2a33d77edbb2.png"/>

### 6. 방명록 페이지
 - 개발 예정
  
## 주의사항
1. 게임이 시작중이거나 7명 이상 접속해 있을 경우 플레이 하실 수 없습니다.
- > 게임이 끝날 때 까지 기다려주시길 바랍니다.
2. 게임 시작 전에 브라우저 사이즈를 알맞게 조절해 주시길 바랍니다. 
- >  Control + Mouse Wheel
3. 간혹 버그가 있을 수 있습니다. 방명록 페이지에 남겨주시면 업데이트 하겠습니다.


