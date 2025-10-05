function mostrarSessao(id) {
  document.querySelectorAll(".sessao").forEach(sec => sec.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
}

// Lista inicial de animais
const animais = [
  { nome: "Luna", especie: "Gato", idade: 2, porte: "Pequeno", status: "Disponível", imagem: "https://placekitten.com/200/200" },
  { nome: "Thor", especie: "Cachorro", idade: 4, porte: "Médio", status: "Adotado", imagem: "https://placedog.net/200/200" },
  { nome: "Mel", especie: "Cachorro", idade: 1, porte: "Pequeno", status: "Disponível", imagem: "https://placedog.net/201/200" }
];

// Listar todos os animais
function listarAnimais() {
  const lista = document.getElementById("lista-animais");
  lista.innerHTML = animais.map(a => `
    <div class="card">
      <img src="${a.imagem}" alt="${a.nome}">
      <h3>${a.nome}</h3>
      <p>${a.especie} - ${a.idade} anos</p>
      <p>Porte: ${a.porte}</p>
      <p>Status: <b>${a.status}</b></p>
    </div>
  `).join('');
}

// Listar apenas disponíveis
function listarDisponiveis() {
  const disponiveis = animais.filter(a => a.status === "Disponível");
  const lista = document.getElementById("animais-disponiveis");
  lista.innerHTML = disponiveis.map(a => `
    <div class="card">
      <img src="${a.imagem}" alt="${a.nome}">
      <h3>${a.nome}</h3>
      <p>${a.especie} - ${a.idade} anos</p>
      <p>Porte: ${a.porte}</p>
      <button>Adotar</button>
    </div>
  `).join('');
}

// Aplicar filtros
function aplicarFiltros() {
  const especie = document.getElementById('filtro-especie').value;
  const porte = document.getElementById('filtro-porte').value;
  const idade = document.getElementById('filtro-idade').value;

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

  const lista = document.getElementById("lista-animais");
  lista.innerHTML = filtrados.map(a => `
    <div class="card">
      <img src="${a.imagem}" alt="${a.nome}">
      <h3>${a.nome}</h3>
      <p>${a.especie} - ${a.idade} anos</p>
      <p>Porte: ${a.porte}</p>
      <button>Adotar</button>
    </div>
  `).join('');
}

// Inicializar listas
listarAnimais();
listarDisponiveis();
