function enterGame(){
    var enter = document.getElementById('enter').value
    
    localStorage.setItem("nickName", enter);
    location.href= "/"
}