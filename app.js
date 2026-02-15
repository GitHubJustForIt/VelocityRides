const grid = document.getElementById("grid");
const userDisplay = document.getElementById("userDisplay");
const modal = document.getElementById("modal");

const mImg = document.getElementById("m-img");
const mTitle = document.getElementById("m-title");
const mDesc = document.getElementById("m-desc");
const mPrice = document.getElementById("m-price");
const mGamepass = document.getElementById("m-gamepass");
const mTags = document.getElementById("m-tags");
const confirmUser = document.getElementById("confirmUser");
const contactInfo = document.getElementById("contactInfo");

let selected = null;
let pending = JSON.parse(localStorage.getItem("pending")) || [];

// INIT App
function initApp(){
  username = localStorage.getItem("user") || username;
  userDisplay.innerHTML = `<i class="fa-solid fa-user"></i> ${username}`;
  updatePendingList();
  render(projects);
}

// RENDER GRID
function render(list){
  grid.innerHTML = "";
  list.forEach((p,i)=>{
    const card = document.createElement("div");
    card.className = "card";

    // Badge Logic
    let badge = "";
    if(p.purchased && p.buyer !== username) {
      badge = `<div class="badge sold">SOLD</div>`;
      removeFromPending(p.title);
    }
    else if(pending.includes(p.title)) badge = `<div class="badge pending">PENDING</div>`;
    else if(p.buyer === username) badge = `<div class="badge owned">OWNED</div>`;

    // Tags display
    const tags = p.tags ? `<p class="tags">Tags: ${p.tags.join(", ")}</p>` : "";

    card.innerHTML = `
      ${badge}
      <img src="${p.image}">
      <div class="card-content">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <p><i class="fa-solid fa-dollar-sign"></i> ${p.price} | <i class="fa-solid fa-ticket"></i> ${p.gamepass}</p>
        ${tags}
      </div>
    `;

    if(!p.purchased || p.buyer === username){
      card.onclick = () => openModal(i);
    }

    grid.appendChild(card);
  });
}

// MODAL
function openModal(i){
  selected = i;
  const p = projects[i];
  mImg.src = p.image;
  mTitle.innerText = p.title;
  mDesc.innerText = p.description;
  mPrice.innerText = p.price;
  mGamepass.innerText = p.gamepass;
  mTags.innerText = p.tags ? `Tags: ${p.tags.join(", ")}` : "";
  confirmUser.value = username;
  contactInfo.value = "";
  modal.classList.add("active");
}

function closeModal(){
  modal.classList.remove("active");
}

// ADD PENDING
function addPending(){
  const p = projects[selected];
  const user = confirmUser.value.trim();
  const contact = contactInfo.value.trim();
  if(!user || !contact) return alert("Enter username and contact info");

  if(p.purchased && p.buyer !== username){
    return alert("Product already sold!");
  }

  if(!pending.includes(p.title)){
    pending.push(p.title);
    localStorage.setItem("pending", JSON.stringify(pending));
  }

  sendWebhook(p.title, user, contact);
  alert("Added to pending ✅");
  closeModal();
  render(projects);
}

// REMOVE PENDING IF SOLD
function removeFromPending(title){
  pending = pending.filter(t=>t!==title);
  localStorage.setItem("pending", JSON.stringify(pending));
}

// DISCORD WEBHOOK
function sendWebhook(product,user,contact){
  if(!WEBHOOK_URL) return;
  fetch(WEBHOOK_URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      username:"VelocityRides Bot",
      content:`User: ${user}\nProduct: ${product}\nContact: ${contact}`
    })
  });
}

// FILTERS
function showAll(){ render(projects); }
function showPending(){ render(projects.filter(p=>pending.includes(p.title))); }
function showPurchased(){ render(projects.filter(p=>p.buyer===username)); }

// UPDATE PENDING LIST AUTOMATICALLY ON LOAD
function updatePendingList(){
  projects.forEach(p=>{
    if(p.purchased && p.buyer!==username) removeFromPending(p.title);
  });
}
