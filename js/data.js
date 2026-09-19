const PRODUCTS = [
  {
    id:"vela-80", name:"Vela Clássica 80 g", category:"velas", label:"VELA AROMÁTICA",
    price:30, image:"assets/vela-80g.png", aroma:"Lavanda",
    description:"Vela clássica de 80 g.",
    details:"O catálogo informa blend de cera vegetal biodegradável, pavio de algodão, essência premium e pote reutilizável.",
    composition:"Blend de cera vegetal biodegradável; pavio de algodão; essência premium."
  },
  {
    id:"vela-140", name:"Vela Clássica 140 g", category:"velas", label:"VELA AROMÁTICA",
    price:50, image:"assets/vela-140g.png", aroma:"Florença",
    description:"Vela clássica de 140 g.",
    details:"O catálogo apresenta a linha de velas aromáticas com blend de cera vegetal biodegradável, pavio de algodão, essência premium e potes reutilizáveis.",
    composition:"Blend de cera vegetal biodegradável; pavio de algodão; essência premium."
  },
  {
    id:"decor-180", name:"Vela Decor 180 g", category:"velas", label:"VELA AROMÁTICA",
    price:55, image:"assets/vela-decor.png", aroma:"Macadâmia",
    description:"Vela Decor de 180 g.",
    details:"Produto apresentado na seção de velas aromáticas do catálogo.",
    composition:"Conforme composição da linha de velas descrita no catálogo."
  },
  {
    id:"home-250", name:"Home Spray 250 ml", category:"aromatizadores", label:"AROMATIZADOR",
    price:50, image:"assets/home-spray.png", aroma:"Lavanda",
    description:"Home Spray 250 ml — frasco PET.",
    details:"O catálogo descreve os aromatizadores como feitos com base de perfume e essências de alta qualidade.",
    composition:"Base de perfume e essências de alta qualidade."
  },
  {
    id:"gold-difusor", name:"Difusor 250 ml", category:"gold", label:"LINHA GOLD",
    price:65, image:"assets/gold-difusor.png", aroma:"Equilíbrio",
    description:"Difusor 250 ml — frasco cilíndrico.",
    details:"O catálogo apresenta o Difusor de 250 ml na Linha Gold e informa que os aromatizadores acompanham 5 varetas de fibra.",
    composition:"Base de perfume e essências de alta qualidade; acompanha 5 varetas de fibra."
  },
  {
    id:"gold-spray", name:"Home Spray 250 ml", category:"gold", label:"LINHA GOLD",
    price:60, image:"assets/gold-spray.png", aroma:"Conecta",
    description:"Home Spray 250 ml — frasco cilíndrico.",
    details:"Produto da Linha Gold apresentado no catálogo.",
    composition:"Base de perfume e essências de alta qualidade."
  },
  {
    id:"gold-sabonete", name:"Sabonete Líquido Perolizado 250 ml", category:"gold", label:"LINHA GOLD",
    price:55, image:"assets/gold-sabonete.png", aroma:"Equilíbrio",
    description:"Sabonete líquido perolizado 250 ml.",
    details:"Produto apresentado na Linha Gold. O catálogo também apresenta a opção de montar kits.",
    composition:"Produto da Linha Gold."
  },
  {
    id:"gold-kit", name:"Kit Linha Gold", category:"gold", label:"KIT",
    price:120, image:"assets/gold-kit.png", aroma:"Equilíbrio",
    description:"Kit da Linha Gold.",
    details:"O catálogo informa o valor do kit e, em outra página, apresenta a possibilidade de montar seu kit.",
    composition:"Combinação de itens da Linha Gold, conforme disponibilidade."
  },
  {
    id:"refil-250", name:"Refil de Difusor 250 ml", category:"refis", label:"REFIL",
    price:50, image:"assets/refil-250.png", aroma:"Equilíbrio",
    description:"Refil de Difusor 250 ml.",
    details:"O catálogo informa que acompanha 5 varetas de fibra.",
    composition:"Refil para difusor; acompanha 5 varetas de fibra."
  },
  {
    id:"refil-500", name:"Refil 500 ml para Difusor", category:"refis", label:"REFIL",
    price:90, image:"assets/refil-500.png", aroma:"Equilíbrio",
    description:"Refil 500 ml para Difusor.",
    details:"Produto apresentado na seção de aromatizadores e refis.",
    composition:"Refil para difusor."
  }
];

const AROMAS = [
  {name:"Florença", type:"Aroma", description:"Descrito no catálogo como cítrico floral."},
  {name:"Lavanda", type:"Aroma", description:"Aroma listado no catálogo."},
  {name:"Flor de Cerejeira", type:"Aroma", description:"Aroma listado no catálogo."},
  {name:"Vanilla", type:"Aroma", description:"Aroma listado no catálogo."},
  {name:"Alecrim", type:"Aroma", description:"Aroma listado no catálogo."},
  {name:"Macadâmia", type:"Aroma", description:"Aroma listado no catálogo."},
  {name:"Equilíbrio", type:"Criação Luz da Lua", description:"Lavanda + Bamboo."},
  {name:"Conecta", type:"Criação Luz da Lua", description:"Lavanda + Mirraj."},
  {name:"Harmonia", type:"Criação Luz da Lua", description:"Vanilla + Limão."}
];

function money(v){
  return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}
