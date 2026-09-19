const grid=document.getElementById("catalogGrid");
function renderCatalog(filter="todos"){
 const items=filter==="todos"?PRODUCTS:PRODUCTS.filter(p=>p.category===filter);
 grid.innerHTML=items.map(p=>`
 <article class="product-card">
   <a class="product-photo" href="produto.html?id=${p.id}">
     <span class="pill">${p.label}</span>
     <img src="${p.image}" alt="${p.name}">
   </a>
   <div class="product-meta">
     <small>${p.label}</small><h3>${p.name}</h3>
     <p>${p.description}</p>
     <strong>${money(p.price)}</strong>
     <button class="add-btn" data-id="${p.id}">Adicionar</button>
   </div>
 </article>`).join("");
 grid.querySelectorAll(".add-btn").forEach(b=>b.addEventListener("click",()=>addToCart(b.dataset.id)));
}
document.addEventListener("DOMContentLoaded",()=>{
 const initial=new URLSearchParams(location.search).get("categoria")||"todos";
 const allowed=["todos","velas","aromatizadores","gold","refis"];
 const start=allowed.includes(initial)?initial:"todos";
 document.querySelector(".filter.active")?.classList.remove("active");
 document.querySelector(`.filter[data-filter="${start}"]`)?.classList.add("active");
 renderCatalog(start);

 document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{
  document.querySelector(".filter.active")?.classList.remove("active");
  b.classList.add("active");
  renderCatalog(b.dataset.filter);
 }));
});
