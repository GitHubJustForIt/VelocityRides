const grid = document.getElementById("grid");
const userDisplay = document.getElementById("userDisplay");
const modal = document.getElementById("modal");

let selected = null;

// INIT
function initApp(){
  userDisplay.innerHTML = `<i class="fa-solid fa-user"></i> ${username}`;
  render(projects);
}

// RENDER GRID
function render(list){
  grid.innerHTML = "";
  list.forEach((p,i)=>{
    const card = document.createElement("div");
    card.className = "card";

    let badge = "";
    if(p.purchased && p.buyer !== username) badge = `<div class="badge sold">SOLD</div>`;
    else if(pending.includes(p.title)) badge = `<div class="badge pending">PENDING</div>`;
    else if(p.buyer === username) badge = `<div class="badge owned">OWNED</div>`;

    card.innerHTML = `
      ${badge}
      <img src="${p.image}">
      <div class="card-content">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <p><i class="fa-solid fa-dollar-sign"></i> ${p.price} | <i class="fa-solid fa-ticket"></i> ${p.gamepass}</p>
      </div>
    `;

    if(!p.purchased || p.buyer === username){
      card.onclick = () => openModal(i);
    }

    grid.appendChild(card);
  });
}

// MODAL
const mImg = document.getElementById("m-img");
const mTitle = document.getElementById("m-title");
const mDesc = document.getElementById("m-desc");
const mPrice = document.getElementById("m-price");
const mGamepass = document.getElementById("m-gamepass");

function openModal(i){
  selected = i;
  const p = projects[i];
  mImg.src = p.image;
  mTitle.innerText = p.title;
  mDesc.innerText = p.description;
  mPrice.innerText = p.price;
  mGamepass.innerText = p.gamepass;
  modal.classList.add("active");
}

function closeModal(){
  modal.classList.remove("active");
}

// PENDING
function addPending(){
  const p = projects[selected];
  if(pending.includes(p.title)) return alert("Already pending");

  pending.push(p.title);
  localStorage.setItem("pending", JSON.stringify(pending));

  sendWebhook(p.title);

  closeModal();
  render(projects);
  alert("Added to pending ✅");
}

// DISCORD WEBHOOK
function sendWebhook(product){
  if(!WEBHOOK_URL) return;
  fetch(WEBHOOK_URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      username:"Store Bot",
      content:`User: ${username}\nProduct: ${product}`
    })
  });
}

// FILTERS
function showAll(){ render(projects); }
function showPending(){ render(projects.filter(p=>pending.includes(p.title))); }
function showPurchased(){ render(projects.filter(p=>p.buyer === username)); }
