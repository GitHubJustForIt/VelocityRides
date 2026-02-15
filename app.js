const grid = document.getElementById("grid");
const userDisplay = document.getElementById("userDisplay");


function initApp(){

  const user = localStorage.getItem("user");

  userDisplay.innerHTML =
    `<i class="fa-solid fa-user"></i> ${user}`;

  render(projects);
}


/* RENDER */

function render(list){

  grid.innerHTML="";

  list.forEach((p,i)=>{

    const card = document.createElement("div");

    card.className="card";

    card.innerHTML=`

      <img src="${p.image}">

      <h3>${p.title}</h3>

      <p>${p.description}</p>

    `;

    grid.appendChild(card);

  });

}
