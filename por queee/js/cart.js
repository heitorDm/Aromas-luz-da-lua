function renderCart(){
 const wrap=document.getElementById("cartItems"),cart=getCart();
 if(!cart.length){wrap.innerHTML=`<div class="empty-cart"><span>♡</span><h2>Seu carrinho está vazio.</h2><p>Escolha um aroma para começar.</p><a class="btn gold" href="produtos.html">Ir para o catálogo</a></div>`;document.getElementById("subtotal").textContent=money(0);document.getElementById("total").textContent=money(0);return;}
 wrap.innerHTML=cart.map((i,index)=>`<div class="cart-row"><img src="${i.image}" alt="${i.name}"><div><small>${i.aroma}</small><h3>${i.name}</h3><strong>${money(i.price)}</strong></div><div class="qty-box"><button data-i="${index}" class="dec">−</button><span>${i.qty}</span><button data-i="${index}" class="inc">+</button></div><button class="remove" data-i="${index}">×</button></div>`).join("");
 const sub=cart.reduce((s,i)=>s+i.price*i.qty,0);document.getElementById("subtotal").textContent=money(sub);document.getElementById("total").textContent=money(sub);
 wrap.querySelectorAll(".inc").forEach(b=>b.onclick=()=>{cart[b.dataset.i].qty++;setCart(cart);renderCart()});
 wrap.querySelectorAll(".dec").forEach(b=>b.onclick=()=>{cart[b.dataset.i].qty=Math.max(1,cart[b.dataset.i].qty-1);setCart(cart);renderCart()});
 wrap.querySelectorAll(".remove").forEach(b=>b.onclick=()=>{cart.splice(b.dataset.i,1);setCart(cart);renderCart()});
}
document.addEventListener("DOMContentLoaded",renderCart);
