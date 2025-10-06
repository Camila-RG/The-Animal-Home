let animais = [
  {id:1,nome:"Luna",especie:"Gato",idade:1,porte:"Pequeno",status:"Disponível",imagem:"https://placekitten.com/200/200"},
  {id:2,nome:"Thor",especie:"Cachorro",idade:3,porte:"Médio",status:"Disponível",imagem:"https://placedog.net/200/200"},
  {id:3,nome:"Mel",especie:"Jacaré",idade:2,porte:"Grande",status:"Disponível",imagem:"https://placekitten.com/201/200"},
  {id:4,nome:"Galinha",especie:"Galinha",idade:1,porte:"Pequeno",status:"Disponível",imagem:"https://placekitten.com/202/200"}
];

let carrinho = [];

function mostrarSessao(id) {
  document.querySelectorAll(".sessao").forEach(sec => sec.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
}

// --- LISTAR ANIMAIS ---
function listarAnimais() {
  const especie = document.getElementById("select-especie").value;
  const idade = document.getElementById("select-idade").value;
  const porte = document.getElementById("select-porte").value;
  const lista = document.getElementById("lista-animais");
  const mensagemVazia = document.getElementById("mensagem-vazia");

  let filtrados = animais.filter(a => 
    (!especie || a.especie === especie) &&
    (!porte || a.porte === porte) &&
    (!idade || (idade==="0-1"?a.idade<=1: idade==="2-4"?a.idade>=2&&a.idade<=4:a.idade>=5))
  );

  if(filtrados.length===0){
    lista.innerHTML = "";
    mensagemVazia.innerText = "Animal não consta no banco de dados";
    return;
  }

  mensagemVazia.innerText = "";
  lista.innerHTML = filtrados.map(a=>`
    <div class="card">
      <img src="${a.imagem}" alt="${a.nome}">
      <h3>${a.nome}</h3>
      <p>${a.especie} - ${a.idade} anos</p>
      <p>Porte: ${a.porte}</p>
      <button onclick="adotarAnimal(${a.id})">Adotar 💜</button>
    </div>
  `).join('');
}

// --- CARRINHO ---
function adotarAnimal(id){
  const animal = animais.find(a=>a.id===id);
  if(!carrinho.includes(animal)){
    carrinho.push(animal);
    atualizarContador();
    criarCoracao();
  }
}

function atualizarContador(){
  document.getElementById("contador").innerText = carrinho.length;
}

function togglePopup(){
  const popup = document.getElementById("popup-carrinho");
  popup.style.display = popup.style.display==="block"?"none":"block";
  atualizarPopup();
}

function atualizarPopup(){
  const ul = document.querySelector("#popup-carrinho ul");
  ul.innerHTML = carrinho.map(a=>`<li>${a.nome}</li>`).join('');
}

function prosseguirCadastro(){
  mostrarSessao('cadastroAdotante');
  document.getElementById("popup-carrinho").style.display="none";
}

// --- FINALIZAR ADOTANTE ---
document.getElementById("formAdotante").addEventListener("submit", function(e){
  e.preventDefault();
  carrinho=[];
  atualizarContador();
  document.getElementById("lista-animais").innerHTML="";
  document.getElementById("mensagem-finalizacao").innerText = "Entraremos em contato por e-mail para concluir a adoção 💜";
});

// --- CORAÇÃO SUBINDO ---
function criarCoracao(){
  const heart = document.createElement("div");
  heart.classList.add("coracao");
  heart.innerText = "💜";
  heart.style.left = Math.random()*window.innerWidth+"px";
  document.body.appendChild(heart);
  setTimeout(()=>heart.remove(),1000);
}

// Inicializa a lista
listarAnimais();
