const header = document.getElementById('nav_bar')

header.innerHTML = `
        <div class="navbar__name">
            <a href="/"><i class="fas fa-gamepad"></i></a>
            <a href="/">Professor vs Student</a>
        </div>

        <ul class="navbar__menu">
            
            <li><a href="">게임 방법</a></li>
            <li><a href="">랭킹</a></li>
            <li><a href="">방명록</a></li>
        </ul>

        <ul class="navbar__icons">
            <i class="fas fa-share-alt-square"></i>
        </ul>`;