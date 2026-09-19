const WHATSAPP_NUMBER = "5527999512072";
const CART_GUEST_KEY = "luzdalua_cart_guest";
const USERS_KEY = "luzdalua_users";
const SESSION_KEY = "luzdalua_session";
const EVENTS_KEY = "luzdalua_events";
const ORDERS_KEY = "luzdalua_orders";

function currentUser(){
  return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
}

function cartStorageKey(){
  const user = currentUser();
  return user ? `luzdalua_cart_${user.email.toLowerCase()}` : CART_GUEST_KEY;
}

function getCart(){
  return JSON.parse(localStorage.getItem(cartStorageKey()) || "[]");
}

function setCart(cart){
  localStorage.setItem(cartStorageKey(), JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge(){
  document.querySelectorAll(".cart-badge").forEach(el=>{
    el.textContent = getCart().reduce((sum,item)=>sum + Number(item.qty || 0), 0);
  });
}

function money(value){
  return Number(value).toLocaleString("pt-BR", {
    style:"currency",
    currency:"BRL"
  });
}

function toast(message){
  let el = document.querySelector(".toast");
  if(!el){
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  window.setTimeout(()=>el.classList.remove("show"), 2200);
}

function trackEvent(type, payload={}){
  const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]");
  events.push({
    id: String(Date.now()) + Math.random().toString(16).slice(2),
    type,
    payload,
    at: new Date().toISOString()
  });
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

function whatsappUrl(message){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function openWhatsApp(message, context="geral"){
  trackEvent("whatsapp_click",{context});
  window.open(whatsappUrl(message), "_blank", "noopener");
}

function defaultWhatsAppMessage(){
  return "Olá! Vim pelo site da Luz da Lua Aromas e gostaria de saber mais sobre os produtos. 🌙";
}

function addToCart(productId, qty=1, aroma="Florença"){
  const product = PRODUCTS.find(item=>item.id===productId);
  if(!product) return;

  const cart = getCart();
  const key = `${productId}|${aroma}`;
  const existing = cart.find(item=>item.key===key);

  if(existing){
    existing.qty += Number(qty);
  }else{
    cart.push({
      key,
      id:product.id,
      name:product.name,
      price:product.price,
      image:product.image,
      qty:Number(qty),
      aroma
    });
  }

  setCart(cart);
  trackEvent("add_to_cart",{productId,qty,aroma});
  toast("Adicionado ao carrinho ♡");
}

function getUsers(){
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users){
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function registerUser(name,email,password){
  name = String(name || "").trim();
  email = String(email || "").trim().toLowerCase();
  password = String(password || "");

  if(!name || !email || password.length < 6){
    return {ok:false,message:"Preencha os dados corretamente. A senha precisa ter pelo menos 6 caracteres."};
  }

  const users = getUsers();
  if(users.some(user=>user.email===email)){
    return {ok:false,message:"Esse e-mail já está cadastrado."};
  }

  users.push({
    name,
    email,
    password,
    createdAt:new Date().toISOString()
  });

  saveUsers(users);
  loginUser(email,password);
  return {ok:true};
}

function loginUser(email,password){
  email = String(email || "").trim().toLowerCase();

  const user = getUsers().find(
    item => item.email===email && item.password===String(password || "")
  );

  if(!user){
    return {ok:false,message:"E-mail ou senha incorretos."};
  }

  mergeGuestCart(email);

  localStorage.setItem(SESSION_KEY, JSON.stringify({
    name:user.name,
    email:user.email
  }));

  trackEvent("login");
  updateCartBadge();
  return {ok:true,user};
}

function logoutUser(){
  trackEvent("logout");
  localStorage.removeItem(SESSION_KEY);
  updateCartBadge();
}

function mergeGuestCart(email){
  const guest = JSON.parse(localStorage.getItem(CART_GUEST_KEY) || "[]");
  if(!guest.length) return;

  const userKey = `luzdalua_cart_${email}`;
  const userCart = JSON.parse(localStorage.getItem(userKey) || "[]");

  guest.forEach(guestItem=>{
    const existing = userCart.find(item=>item.key===guestItem.key);
    if(existing){
      existing.qty += guestItem.qty;
    }else{
      userCart.push(guestItem);
    }
  });

  localStorage.setItem(userKey,JSON.stringify(userCart));
  localStorage.removeItem(CART_GUEST_KEY);
}

function renderAccountChip(){
  document.querySelectorAll("[data-account-area]").forEach(area=>{
    const user = currentUser();

    if(user){
      area.innerHTML = `
        <a href="conta.html" class="account-chip">
          <span class="account-dot">♙</span>
          <span>${user.name.split(" ")[0]}</span>
        </a>
      `;
    }else{
      area.innerHTML = `<a href="conta.html" class="account-chip"><span class="account-dot">♙</span><span>Entrar</span></a>`;
    }
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  updateCartBadge();
  renderAccountChip();

  const menu = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  menu?.addEventListener("click",()=>nav?.classList.toggle("open"));

  document.querySelectorAll(".add-btn").forEach(button=>{
    button.addEventListener("click",event=>{
      event.preventDefault();
      addToCart(button.dataset.id,1,button.dataset.aroma || "Florença");
    });
  });

  document.querySelectorAll("[data-whatsapp]").forEach(button=>{
    button.addEventListener("click",event=>{
      event.preventDefault();
      openWhatsApp(
        button.dataset.message || defaultWhatsAppMessage(),
        button.dataset.whatsapp || "contato"
      );
    });
  });
});
