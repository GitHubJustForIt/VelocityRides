const loginBox = document.getElementById("loginBox");
const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("usernameInput");
const app = document.getElementById("app");

let username = localStorage.getItem("user") || "";
let pending = JSON.parse(localStorage.getItem("pending")) || [];

// Login Button
loginBtn.addEventListener("click", login);

// Auto-login
if(username){
  startApp();
}

function login(){
  const name = usernameInput.value.trim();
  if(!name) return alert("Enter username");
  localStorage.setItem("user", name);
  username = name;
  startApp();
}

function startApp(){
  loginBox.style.display = "none";
  app.style.display = "block";
  initApp();  // Aufruf App
}
