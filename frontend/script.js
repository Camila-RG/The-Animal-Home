// -------------------------------
// Dados iniciais
// -------------------------------
let animais = [
  { id: 1, nome: "Luna", especie: "Gato", idade: 2, porte: "Pequeno", status: "Disponível", imagem: "https://placekitten.com/200/200" },
  { id: 2, nome: "Thor", especie: "Cachorro", idade: 4, porte: "Médio", status: "Adotado", imagem: "https://placedog.net/200/200" },
  { id: 3, nome: "Mel", especie: "Cachorro", idade: 1, porte: "Pequeno", status: "Disponível", imagem: "https://placedog.net/201/200" },
  { id: 4, nome: "Jaco", especie: "Jacaré", idade: 5, porte: "Grande", status: "Disponível", imagem: "https://placekitten.com/201/201" },
  { id: 5, nome: "Gal", especie: "Galinha", idade: 1, porte: "Pequeno", status: "Disponível", imagem: "https://placekitten.com/202/202" }
];

let carrinho = [];
let historicoAdocoes = [];
let funcionarioLogado = false;

// -------------------------------
// Sessões
// -------------------------------
function mostrarSessao(id) {
  document.querySelectorAll(".sessao").forEach(sec => sec.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
}

// -------------------------------
// Lista de animais (cliente)
// -------------------------------
function aplicarFiltros() {
  const especie = document.getElementById("filtro-especie").value;
  const idade = document.getElementById("filtro-idade").value;
  const porte = document.getElementById("filtro-porte").value;

  let filtrados = animais.filter(a => a.status === "Disponível");

  if (especie) filtrados = filtrados.filter(a => a.especie === especie);
  if (porte) filtrados = filtrados.filter(a => a.porte === porte);
  if (idade) {
    filtrados = filtrados.filter(a => {
      if (idade === "0-1") return a.idade <= 1;
      if (idade === "2-4") return a.idade >= 2 && a.idade <= 4;
      if (idade === "5+") return a.idade >= 5;
    });
  }

  const container = document.getElementById("animais-container");
  const msg = document.getElementById("msg-nao-encontrado");

  if (filtrados.length === 0) {
    container.innerHTML = "";
    msg.textContent = "Animal não consta no banco de dados.";
  } else {
    msg.textContent = "";
    container.innerHTML = filtrados.map(a => `
      <div class="card">
        <img src="${a.imagem}" alt="${a.nome}">
        <h3>${a.nome}</h3>
        <p>${a.especie} - ${a.idade} anos - ${a.porte}</p>
        <button onclick="adotarAnimal(${a.id})">Adotar</button>
      </div>
    `).join('');
  }
}

// -------------------------------
// Carrinho de adoção
// -------------------------------
function toggleCarrinho() {
  const popup = document.getElementById("carrinho-popup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}

function adotarAnimal(id) {
  const animal = animais.find(a => a.id === id);
  if (!carrinho.includes(animal)) {
    carrinho.push(animal);
    atualizarCarrinho();
    animacaoCoracao();
  }
}

function atualizarCarrinho() {
  const lista = document.getElementById("carrinho-list");
  lista.innerHTML = carrinho.map(a => `<li>${a.nome} (${a.especie})</li>`).join('');
}

function animacaoCoracao() {
  const coracao = document.createElement("div");
  coracao.textContent = "💜";
  coracao.style.position = "fixed";
  coracao.style.left = Math.random() * window.innerWidth + "px";
  coracao.style.top = "80vh";
  coracao.style.fontSize = "24px";
  coracao.style.opacity = 1;
  coracao.style.transition = "all 1s ease-out";
  document.body.appendChild(coracao);
  setTimeout(() => {
    coracao.style.top = "50px";
    coracao.style.opacity = 0;
  }, 10);
  setTimeout(() => document.body.removeChild(coracao), 1000);
}

// -------------------------------
// Finalizar adoção
// -------------------------------
function finalizarAdocao() {
  if (carrinho.length === 0) {
    alert("Adicione pelo menos um animal ao carrinho!");
    return;
  }
  mostrarSessao("cadastro-adotante");
}

// -------------------------------
// Cadastro do adotante
// -------------------------------
function submitAdotante(event) {
  event.preventDefault();
  const form = event.target;
  const dados = {
    nome: form[0].value,
    email: form[1].value,
    telefone: form[2].value,
    endereco: form[3].value,
    animaisAdotados: [...carrinho]
  };
  historicoAdocoes.push(dados);

  // Limpa carrinho
  carrinho.forEach(a => a.status = "Adotado");
  carrinho = [];
  atualizarCarrinho();

  // Mensagem de confirmação
  mostrarSessao("inicio");
  document.getElementById("msg-confirmacao").textContent = `Obrigado, ${dados.nome}! Entraremos em contato pelo email ou telefone para agendar a adoção dos pets escolhidos.`;
}

// -------------------------------
// Login funcionário
// -------------------------------
function loginFuncionario(event) {
  event.preventDefault();
  const email = event.target[0].value;
  const senha = event.target[1].value;

  if (email === "funcionario@email" && senha === "senha") {
    funcionarioLogado = true;
    document.getElementById("formLoginFuncionario").style.display = "none";
    document.getElementById("portal-conteudo").classList.remove("oculto");
    atualizarPortalFuncionario();
  } else {
    alert("Email ou senha incorretos!");
  }
}

// -------------------------------
// Portal do funcionário
// -------------------------------
function cadastrarAnimal(event) {
  event.preventDefault();
  if (!funcionarioLogado) return;

  const form = event.target;
  const novo = {
    id: animais.length + 1,
    nome: form[0].value,
    especie: form[1].value,
    idade: parseInt(form[2].value),
    porte: form[3].value,
    status: "Disponível",
    imagem: "https://placekitten.com/200/200" // placeholder
  };
  animais.push(novo);
  form.reset();
  atualizarPortalFuncionario();
  aplicarFiltros();
}

function removerAnimal(id) {
  animais = animais.filter(a => a.id !== id);
  atualizarPortalFuncionario();
  aplicarFiltros();
}

function atualizarPortalFuncionario() {
  // Lista de animais para remoção
  const container = document.getElementById("animais-funcionario");
  container.innerHTML = animais.map(a => `
    <div class="card">
      <h3>${a.nome}</h3>
      <p>${a.especie} - ${a.idade} anos - ${a.porte} - ${a.status}</p>
      <button onclick="removerAnimal(${a.id})">Remover</button>
    </div>
  `).join('');

  // Estatísticas
  const disponiveis = animais.filter(a => a.status === "Disponível").length;
  const adotados = animais.filter(a => a.status === "Adotado").length;
  document.getElementById("estatisticas").textContent = `Disponíveis: ${disponiveis} | Adotados: ${adotados}`;
}

// -------------------------------
// Inicialização
// -------------------------------
aplicarFiltros();
