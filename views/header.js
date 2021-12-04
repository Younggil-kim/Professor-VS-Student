const header = document.getElementById('nav_bar')

header.innerHTML = `
        <div class="navbar__name">
            <a href="/game"><i class="fas fa-gamepad"></i></a>
            <a href="/game">Professor vs Student</a>
        </div>

        <ul class="navbar__menu">
            <li><a href="#" id="modal_btn">게임 방법</a></li>
            
            
            <li><a href="/rank">랭킹</a></li>
            <li><a href="">방명록</a></li>
        </ul>

        <ul class="navbar__icons">
            <i class="fas fa-share-alt-square"></i>
        </ul>`
    ;

