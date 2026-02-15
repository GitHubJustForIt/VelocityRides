const loginBox = document.getElementById("loginBox");
const app = document.getElementById("app");

const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("usernameInput");

loginBtn.addEventListener("click", login);

function login(){

  const name = usernameInput.value.trim();

  if(!name){
    alert("Enter username");
    return;
  }

  localStorage.setItem("user", name);

  startApp();
}

/* AUTO LOGIN */

if(localStorage.getItem("user")){
  startApp();
}

function startApp(){

  loginBox.style.display="none";
  app.style.display="block";

  initApp();
}
