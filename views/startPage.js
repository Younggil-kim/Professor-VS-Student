function enterGame(){
    var enter = document.getElementById('enter').value
    if(enter.length === 0){
        Swal.fire({
            title: "게임 알림",
            text: "닉네임을 입력해주세요",
            confirmButtonText: "네",
            confirmButtonColor: '#FC5296'
        });
    }else if( enter.length < 2 || enter.length > 9 ){
        Swal.fire({
            title: "게임 알림",
            text: "닉네임은 최소 2자에서 최대 8자 입니다.",
            confirmButtonText: "네",
            confirmButtonColor: '#FC5296'
        });
    }else{
        localStorage.setItem("nickName", enter);
        location.href= "/game"
    }


}