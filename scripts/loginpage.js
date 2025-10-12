console.log("Скрипт подключен и работает! loginpage.js");
//Элементы страницы, константы и переменные 
const errorLabel = document.getElementById("messageLabel");
const borders = document.getElementsByClassName("box");
const box1 = document.getElementById("registerBox");
const box2 = document.getElementById("loginBox");

document.addEventListener("DOMContentLoaded", () => {
  showLoginBox();
});

function showLoginBox(){
   errorLabel.innerText = "";
   box1.style.display="none";
   box2.style.display="inline-block";
}

function showRegisterBox(){
   errorLabel.innerText = "";
   box2.style.display="none";
   box1.style.display="inline-block";
}

async function checkLoginValues(){
    borders[0].style.borderColor="#000000";
    const user = document.getElementById("logUser").value;
    const pass = document.getElementById("logPass").value;
    if (user == "" || pass == ""){
        borders[0].style.borderColor="#ff0000";
        errorLabel.innerText = "Поля должны быть заполнены";
	return;
    }
    try {
        await login(user, pass);
    } catch (err) {
        borders[1].style.borderColor = "#ff0000";
        errorLabel.innerText = err.message;
    }
}

async function checkRegisterValues(){
    borders[1].style.borderColor="#000000";
    const user = document.getElementById("regUser").value;
    const pass = document.getElementById("regPass").value;
    const pass2 = document.getElementById("regPass2").value;
    
    if (user == "" || pass == "" || pass2 == ""){
        borders[1].style.borderColor="#ff0000";
        errorLabel.innerText = "Поля не должны быть пустыми";
	return;
    }
    	
    if (pass != pass2){
        borders[1].style.borderColor="#ff0000";
        errorLabel.innerText = "Пароли не совпадают";
    	return;
    }
    try {
        await register(user, pass); // если всё ок, register сам покажет alert и вызовет showLoginBox()
    } catch (err) {
        borders[1].style.borderColor = "#ff0000";
        errorLabel.innerText = `${err} + ${err.message} \n 409- Имя пользователя занят \n` // выводим ошибку на страницу
    }
}