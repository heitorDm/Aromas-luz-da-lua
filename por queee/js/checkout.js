function renderCheckout(){
  const cart = getCart();
  const list = document.getElementById("checkoutItems");
  const total = cart.reduce((sum,item)=>sum + item.price * item.qty,0);

  list.innerHTML = cart.length
    ? cart.map(item=>`
      <div class="mini-order">
        <div>
          <span>${item.name} × ${item.qty}</span>
          <small>${item.aroma}</small>
        </div>
        <strong>${money(item.price * item.qty)}</strong>
      </div>
    `).join("")
    : `<p class="empty-mini">Seu carrinho está vazio.</p>`;

  document.getElementById("checkoutTotal").textContent = money(total);

  const note = document.getElementById("accountNote");
  const user = currentUser();

  if(note){
    note.innerHTML = user
      ? `Conta ativa: <strong>${user.name}</strong>. Seu carrinho fica salvo nesta conta neste navegador.`
      : `Você pode continuar como visitante ou <a href="conta.html">criar sua conta</a> para salvar seu carrinho.`;
  }
}

function buildWhatsAppMessage(order){
  const products = order.items.map(item=>(
    `• ${item.name}\n` +
    `  Aroma: ${item.aroma}\n` +
    `  Quantidade: ${item.qty}\n` +
    `  ${money(item.price * item.qty)}`
  )).join("\n\n");

  const paymentName = {
    pix:"Pix",
    card:"Cartão de crédito",
    cash:"Dinheiro"
  }[order.payment] || order.payment;

  return (
    "Olá! Quero fazer um pedido na Luz da Lua Aromas 🌙\n\n" +
    "🛍️ PRODUTOS\n" +
    products + "\n\n" +
    "────────────────────\n" +
    `💰 TOTAL: ${money(order.total)}\n\n` +
    "📍 ENTREGA\n" +
    `Nome: ${order.customer.name}\n` +
    `Telefone: ${order.customer.phone}\n` +
    `E-mail: ${order.customer.email}\n` +
    `Cidade: ${order.address.city}\n` +
    `CEP: ${order.address.cep}\n` +
    `Endereço: ${order.address.address}\n\n` +
    "💳 PAGAMENTO\n" +
    `${paymentName}\n\n` +
    `Pedido: ${order.id}`
  );
}

document.addEventListener("DOMContentLoaded",()=>{
  renderCheckout();

  const form = document.getElementById("checkoutForm");
  if(!form) return;

  form.addEventListener("submit",event=>{
    event.preventDefault();

    const cart = getCart();
    if(!cart.length){
      alert("Seu carrinho está vazio.");
      return;
    }

    const data = new FormData(form);

    const order = {
      id:`LL-${Date.now().toString().slice(-8)}`,
      createdAt:new Date().toISOString(),
      status:"Enviado ao WhatsApp",
      payment:data.get("payment"),
      customer:{
        name:data.get("name"),
        phone:data.get("phone"),
        email:data.get("email")
      },
      address:{
        cep:data.get("cep"),
        city:data.get("city"),
        address:data.get("address")
      },
      items:cart.map(item=>({...item})),
      total:cart.reduce((sum,item)=>sum + item.price * item.qty,0)
    };

    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    orders.push({
      ...order,
      userEmail:currentUser()?.email || null
    });
    localStorage.setItem(ORDERS_KEY,JSON.stringify(orders));

    trackEvent("whatsapp_order_created",{orderId:order.id,total:order.total});
    localStorage.removeItem(cartStorageKey());
    updateCartBadge();

    window.location.href =
      `${whatsappUrl(buildWhatsAppMessage(order))}`;
  });
});
