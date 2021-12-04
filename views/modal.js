
const modalBack = document.querySelector('.modal_back')
modalBack.innerHTML = `
    <div class="modal">
    <div class="modal_body">
        <h2>게임 방법</h2>
         1. 제일 처음 접속한 플레이어가 호스트이다.</br>
        2. 호스트가 게임 시작 버튼을 누른다.</br>
        3. 사방에서 날아오는 적들을 방향키로 피한다.</br>
        4. 게임은 총 8스테이지이며, 각 스테이지는 15초 동안 진행된다. </br>
        5. 아이템을 획득하면 특정한 효과를 누릴 수 있다.</br>
        6. 한 플레이어라도 살아남을 경우 다음 스테이지에서 전원 부활된다.</br>
        <button class="close_modal">닫기</button>
    </div>
    </div>
`
const modal = document.querySelector('.modal');
const btnOpen = document.getElementById('modal_btn')
const closeModal = document.querySelector('.close_modal')



btnOpen.addEventListener('click', () => {
    modal.style.display = 'block';
    modalBack.style.display='block';
})

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    modalBack.style.display='none';
})

