// ======== Dados Iniciais ========
let animais = [
  { id:1, nome:"Luna", especie:"Gato", idade:2, porte:"Pequeno", status:"Disponível", imagem:"https://placekitten.com/200/200" },
  { id:2, nome:"Thor", especie:"Cachorro", idade:4, porte:"Médio", status:"Disponível", imagem:"https://placedog.net/200/200" },
  { id:3, nome:"Mel", especie:"Cachorro", idade:1, porte:"Pequeno", status:"Disponível", imagem:"https://placedog.net/201/200" },
  { id:4, nome:"Jack", especie:"Jacaré", idade:3, porte:"Grande", status:"Disponível", imagem:"https://placeimg.com/200/200/reptile" },
  { id:5, nome:"Gal", especie:"Galinha", idade:1, porte:"Pequeno", status:"Disponível", imagem:"https://placeimg.com/200/200/bird" }
];

let carrinho = [];

// ======== Sessões ========
function mostrarSessao(id){
  document.querySelectorAll(".sessao").forEach(sec => sec.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
}

// ======== Filtros ========
function aplicarFiltros() {
  const especie = document.getElementById("filtro-especie").value;
  const idade = document.getElementById("filtro-idade").value;
  const porte = document.getElementById("filtro-porte").value;

  let filtrados = animais.filter(a => a.status==="Disponível");

  if(especie) filtrados = filtrados.filter(a=>a.especie===especie);
  if(idade){
    if(idade==="5+") filtrados = filtrados.filter(a=>a.idade>=5);
    else filtrados = filtrados.filter(a=>a.idade===parseInt(idade));
  }
  if(porte) filtrados = filtrados.filter(a=>a.porte===porte);

  const container = document.getElementById("container-animais");
  const msg = document.getElementById("msg-nao-encontrado");
  if(filtrados.length===0){
    container.innerHTML="";
    msg.textContent="Animal não consta no banco de dados";
  } else {
    msg.textContent="";
    container.innerHTML = filtrados.map(a=>`
      <div class="card">
        <img src="${a.imagem}" alt="${a.nome}">
        <h3>${a.nome}</h3>
        <p>${a.especie} - ${a.idade} anos</p>
        <p>Porte: ${a.porte}</p>
        <button onclick="adicionarCarrinho(${a.id})">Adotar</button>
      </div>
    `).join('');
  }
}

// ======== Carrinho ========
const iconeCarrinho = document.getElementById("icone-carrinho");
const popupCarrinho = document.getElementById("carrinho-popup");
iconeCarrinho.addEventListener("click", ()=> popupCarrinho.style.display = popupCarrinho.style.display==="block"?"none":"block");

function adicionarCarrinho(id){
  const animal = animais.find(a=>a.id===id);
  if(!carrinho.includes(animal)){
    carrinho.push(animal);
    atualizarCarrinho();
    coracaoSubindo();
  }
}

function atualizarCarrinho(){
  const ul = document.getElementById("carrinho-list");
  ul.innerHTML = carrinho.map(a=>`<li>${a.nome}</li>`).join('');
}

// ======== Coração subindo ========
function coracaoSubindo(){
  const heart = document.createElement("div");
  heart.textContent="❤️";
  heart.style.position="fixed";
  heart.style.bottom="100px";
  heart.style.right="80px";
  heart.style.fontSize="24px";
  heart.style.animation="subir 1s forwards";
  document.body.appendChild(heart);
  setTimeout(()=>heart.remove(),1000);
}

const style = document.createElement('style');
style.innerHTML = `
@keyframes subir {
  0% {opacity:1; transform:translateY(0);}
  100% {opacity:0; transform:translateY(-50px);}
}`;
document.head.appendChild(style);

// ======== Finalizar Adoção ========
function finalizarAdocao(){
  if(carrinho.length===0) { alert("Nenhum animal selecionado"); return; }
  mostrarSessao("form-adocao");
}

// ======== Formulário de Adoção ========
document.getElementById("adocao-form").addEventListener("submit", function(e){
  e.preventDefault();
  const nome = this[0].value;
  const email = this[1].value;
  const telefone = this[2].value;
  document.getElementById("mensagem-final").innerHTML = `Parabéns, ${nome}! 💖<br>Você receberá em breve um contato por e-mail ou telefone para concluir a adoção dos seguintes animais:<br>${carrinho.map(a=>a.nome).join(", ")}`;
  carrinho = [];
  atualizarCarrinho();
  popupCarrinho.style.display="none";
  this.reset();
});

// ======== Portal Funcionário ========
const emailFunc = "funcionario@email";
const senhaFunc = "bebeto321";

document.getElementById("form-login-func").addEventListener("submit", function(e){
  e.preventDefault();
  const email = this[0].value;
  const senha = this[1].value;
  if(email===emailFunc && senha===senhaFunc){
    this.classList.add("oculto");
    document.getElementById("portal-conteudo").classList.remove("oculto");
    carregarTabelaAnimais();
    carregarTabelaAdocoes();
  } else alert("Email ou senha incorretos!");
});

// Logout
function sairFuncionario(){
  document.getElementById("portal-conteudo").classList.add("oculto");
  document.getElementById("form-login-func").classList.remove("oculto");
  document.getElementById("form-login-func").reset();
}

// ======== Tabelas Funcionário ========
function carregarTabelaAnimais(){
  const tbody = document.querySelector("#tabela-animais tbody");
  tbody.innerHTML = "";
  animais.forEach(a=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${a.nome}</td><td>${a.especie}</td><td>${a.idade}</td><td>${a.porte}</td><td>${a.status}</td>
    <td><button onclick="removerAnimal(${a.id})">Remover</button></td>`;
    tbody.appendChild(tr);
  });
}

function carregarTabelaAdocoes(){
  const tbody = document.querySelector("#tabela-adocoes tbody");
  tbody.innerHTML = ""; // Aqui pode puxar histórico real
}

// ======== Cadastrar Animal ========
document.getElementById("form-cadastro-animal").addEventListener("submit", function(e){
  e.preventDefault();
  const novo = {
    id: animais.length+1,
    nome:this[0].value,
    especie:this[1].value,
    idade:parseInt(this[2].value),
    porte:this[3].value,
    status:"Disponível",
    imagem:"https://placeimg.com/200/200/animals"
  };
  animais.push(novo);
  carregarTabelaAnimais();
  aplicarFiltros();
  this.reset();
});

// ======== Remover Animal ========
function removerAnimal(id){
  animais = animais.filter(a=>a.id!==id);
  carregarTabelaAnimais();
  aplicarFiltros();
}
