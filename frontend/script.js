// Função para trocar as seções visíveis
function mostrarSessao(id) {
  document.querySelectorAll(".sessao").forEach(sec => sec.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
}

// Dados de exemplo
const animais = [
  { nome: "Luna", especie: "Gato", idade: 2, status: "Disponível", imagem: "https://placekitten.com/200/200" },
  { nome: "Thor", especie: "Cachorro", idade: 4, status: "Adotado", imagem: "https://placedog.net/200/200" },
  { nome: "Mel", especie: "Cachorro", idade: 1, status: "Disponível", imagem: "https://placedog.net/201/200" }
];

// Exibe lista de todos os animais
function listarAnimais() {
  const lista = document.getElementById("lista-animais");
  lista.innerHTML = animais.map(a => `
    <div class="card">
      <img src="${a.imagem}" alt="${a.nome}">
      <h3>${a.nome}</h3>
      <p>${a.especie} - ${a.idade} anos</p>
      <p>Status: <b>${a.status}</b></p>
    </div>
  `).join('');
}

// Exibe apenas animais disponíveis
function listarDisponiveis() {
  const disponiveis = animais.filter(a => a.status === "Disponível");
  const lista = document.getElementById("animais-disponiveis");
  lista.innerHTML = disponiveis.map(a => `
    <div class="card">
      <img src="${a.imagem}" alt="${a.nome}">
      <h3>${a.nome}</h3>
      <p>${a.especie} - ${a.idade} anos</p>
      <button>Adotar</button>
    </div>
  `).join('');
}

// Inicializa
listarAnimais();
listarDisponiveis();
