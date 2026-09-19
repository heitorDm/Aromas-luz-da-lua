document.addEventListener("DOMContentLoaded",()=>{
  const id = new URLSearchParams(location.search).get("id") || "vela-140";
  const product = PRODUCTS.find(item=>item.id===id) || PRODUCTS[1];

  document.title = `${product.name} | Luz da Lua Aromas`;

  document.getElementById("productImage").src = product.image;
  document.getElementById("productImage").alt = product.name;
  document.getElementById("viewerImg").src = product.image;
  document.getElementById("productCategory").textContent = product.label;
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productDescription").textContent = product.description;
  document.getElementById("productDetails").textContent = product.details;
  document.getElementById("productPrice").textContent = money(product.price);
  document.getElementById("composition").textContent = product.composition;

  const thumbSource = PRODUCTS.filter(item=>item.category===product.category);
  document.getElementById("thumbs").innerHTML =
    (thumbSource.length ? thumbSource : PRODUCTS.slice(0,4))
    .map(item=>`
      <button type="button">
        <img src="${item.image}" alt="${item.name}">
      </button>
    `).join("");

  document.querySelectorAll("#thumbs button").forEach(button=>{
    button.addEventListener("click",()=>{
      document.getElementById("productImage").src =
        button.querySelector("img").src;
    });
  });

  const aromaSelect = document.getElementById("aromaSelect");
  aromaSelect.innerHTML = AROMAS
    .map(aroma=>`<option value="${aroma.name}" ${aroma.name===product.aroma?"selected":""}>${aroma.name}</option>`)
    .join("");

  function updateAroma(){
    const aroma = AROMAS.find(item=>item.name===aromaSelect.value);
    document.getElementById("aromaHelp").textContent =
      aroma ? aroma.description : "";
    document.getElementById("aroma").textContent =
      aroma ? `${aroma.name} — ${aroma.description}` : "";
  }

  updateAroma();
  aromaSelect.addEventListener("change",updateAroma);

  let quantity = 1;
  const qtyElement = document.getElementById("qty");

  document.getElementById("plus").onclick=()=>{
    quantity++;
    qtyElement.textContent=quantity;
  };

  document.getElementById("minus").onclick=()=>{
    quantity=Math.max(1,quantity-1);
    qtyElement.textContent=quantity;
  };

  document.getElementById("addProduct").onclick=()=>{
    addToCart(product.id,quantity,aromaSelect.value);
  };

  document.querySelector("[data-product-whatsapp]")?.addEventListener("click",event=>{
    event.preventDefault();

    const message =
      `Olá! Vi no site da Luz da Lua e gostaria de saber mais sobre:\n\n` +
      `Produto: ${product.name}\n` +
      `Aroma: ${aromaSelect.value}\n` +
      `Preço: ${money(product.price)}`;

    openWhatsApp(message,"produto");
  });

  const rotation = document.getElementById("rotation");
  const viewerImg = document.getElementById("viewerImg");

  rotation?.addEventListener("input",()=>{
    viewerImg.style.transform =
      `rotateY(${rotation.value}deg) rotateX(2deg)`;
  });

  document.querySelectorAll(".detail-tab").forEach(tab=>{
    tab.addEventListener("click",()=>{
      document.querySelector(".detail-tab.active")?.classList.remove("active");
      tab.classList.add("active");

      document.querySelectorAll(".detail-panel")
        .forEach(panel=>panel.classList.remove("active"));

      document.getElementById(tab.dataset.tab)?.classList.add("active");
    });
  });
});
