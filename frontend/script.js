// Sessões
function mostrarSessao(id) {
  document.querySelectorAll(".sessao").forEach(sec => sec.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
  if(id === 'lista-animais') atualizarLista();
}

// Dados iniciais de animais
let animais = [
  { nome: "Luna", especie: "Gato", idade: 2, porte: "Pequeno", status: "Disponível", imagem: "https://placekitten.com/200/200" },
  { nome: "Thor", especie: "Cachorro", idade: 4, porte: "Médio", status: "Disponível", imagem: "https://placedog.net/200/200" },
  { nome: "Mel", especie: "Cachorro", idade: 1, porte: "Pequeno", status: "Disponível", imagem: "https://placedog.net/201/200" },
  { nome: "Galinho", especie: "Galinha", idade: 1, porte: "Pequeno", status: "Disponível", imagem: "https://placekitten.com/201/200" },
  { nome: "Jacarezinho", especie: "Jacaré", idade: 3, porte: "Grande", status: "Disponível", imagem: "https://placekitten.com/202/200" }
];

// Carrinho de adoção
let carrinho = [];

// Login funcionário
const funcEmail = "funcionario@email";
const funcSenha = "bebeto321";

// Criar animação coração
function criarCoracao(x, y) {
  const heart = document.createElement("div");
  heart.textContent = "💜";
  heart.style.position = "fixed";
  heart.style.left = x + "px";
  heart.style.top = y + "px";
  heart.style.fontSize = "20px";
  heart.style.pointerEvents = "none";
  document.body.appendChild(heart);

  let pos = 0;
  const anim = setInterval(() => {
    pos++;
    heart.style.top = y - pos + "px";
    heart.style.opacity = 1 - pos/50;
    if(pos >= 50) {
      clearInterval(anim);
      heart.remove();
    }
  }, 10);
}

// Atualiza lista de animais
function atualizarLista() {
  const lista = document.getElementById("lista-animais-cards");
  const especie = document.getElementById("filtro-especie").value;
  const idade = document.getElementById("filtro-idade").value;
  const porte = document.getElementById("filtro-porte").value;

  let filtrados = animais.filter(a => 
    (especie === "" || a.especie === especie) &&
    (idade === "" || (idade === "5+" ? a.idade >=5 : a.idade == idade)) &&
    (porte === "" || a.porte === porte) &&
    a.status === "Disponível"
  );

  if(filtrados.length === 0){
    lista.innerHTML = "<p>Animal não consta no banco de dados 🐾</p>";
    return;
  }

  lista.innerHTML = filtrados.map(a => `
    <div class="card">
      <img src="${a.imagem}" alt="${a.nome}">
      <h3>${a.nome}</h3>
      <p>${a.especie} - ${a.idade} anos - ${a.porte}</p>
      <button onclick="adicionarCarrinho('${a.nome}', event)">Adotar</button>
    </div>
  `).join('');
}

// Adicionar ao carrinho
function adicionarCarrinho(nome, e) {
  const animal = animais.find(a => a.nome === nome);
  if(animal && !carrinho.includes(animal)){
    carrinho.push(animal);
    atualizarCarrinho();
    criarCoracao(e.clientX, e.clientY);
  }
}

// Atualiza pop-up carrinho
function atualizarCarrinho() {
  const popup = document.getElementById("popup-carrinho");
  const lista = document.getElementById("carrinho-list");
  if(carrinho.length === 0){
    popup.style.display = "none";
    return;
  }
  lista.innerHTML = carrinho.map(a => `<li>${a.nome}</li>`).join('');
  popup.style.display = "block";
}

// Finalizar adoção e ir para formulário
function finalizarAdocao() {
  if(carrinho.length === 0) return alert("Adicione ao menos um animal ao carrinho.");
  mostrarSessao('form-adocao');
}

// Enviar formulário de adoção
document.getElementById("adocao-form").addEventListener("submit", function(e){
  e.preventDefault();
  carrinho.forEach(a => a.status = "Adotado");
  carrinho = [];
  atualizarLista();
  document.getElementById("popup-carrinho").style.display = "none";

  const mensagem = document.getElementById("mensagem-final");
  mensagem.innerHTML = "💖 Obrigado! Entraremos em contato pelo email ou telefone para agendar a adoção e construir uma família feliz!";
  this.reset();
});

// Aplicar filtros
function aplicarFiltros() { atualizarLista(); }

// Portal do funcionário - login
document.getElementById("form-login-func").addEventListener("submit", function(e){
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  const senha = this.querySelector('input[type="password"]').value;
  if(email === funcEmail && senha === funcSenha){
    document.getElementById("form-login-func").classList.add("oculto");
    document.getElementById("portal-conteudo").classList.remove("oculto");
    atualizarTabelaAnimais();
    atualizarHistorico();
  } else {
    alert("Email ou senha incorretos.");
  }
});

// Cadastrar novo animal
document.getElementById("form-cadastro-animal").addEventListener("submit", function(e){
  e.preventDefault();
  const inputs = this.querySelectorAll("input, select");
  const novo = {
    nome: inputs[0].value,
    especie: inputs[1].value,
    idade: Number(inputs[2].value),
    porte: inputs[3].value,
    status: "Disponível",
    imagem: "https://placekitten.com/200/200"
  };
  animais.push(novo);
  atualizarTabelaAnimais();
  atualizarLista();
  this.reset();
});

// Atualiza tabela de animais no portal
function atualizarTabelaAnimais() {
  const tbody = document.querySelector("#tabela-animais tbody");
  tbody.innerHTML = animais.map((a, i) => `
    <tr>
      <td>${a.nome}</td>
      <td>${a.especie}</td>
      <td>${a.idade}</td>
      <td>${a.porte}</td>
      <td>${a.status}</td>
      <td><button onclick="removerAnimal(${i})">Remover</button></td>
    </tr>
  `).join('');
}

// Remover animal
function removerAnimal(index){
  animais.splice(index,1);
  atualizarTabelaAnimais();
  atualizarLista();
}

// Logout do funcionário
function sairFuncionario(){
  document.getElementById("portal-conteudo").classList.add("oculto");
  document.getElementById("form-login-func").classList.remove("oculto");
}

// Histórico de adoções
function atualizarHistorico(){
  const tbody = document.querySelector("#tabela-adocoes tbody");
  let adocoes = animais.filter(a => a.status === "Adotado");
  tbody.innerHTML = adocoes.map(a => `
    <tr>
      <td>${a.nome}</td>
      <td>-</td>
      <td>-</td>
    </tr>
  `).join('');
}

// Inicializar lista
atualizarLista();
  