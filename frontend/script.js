// Dados iniciais dos animais
let animais = [
  { id: 1, nome: "Luna", especie: "Gato", idade: 2, porte: "Pequeno", status: "Disponível", imagem: "https://placekitten.com/200/200" },
  { id: 2, nome: "Thor", especie: "Cachorro", idade: 4, porte: "Médio", status: "Disponível", imagem: "https://placedog.net/200/200" },
  { id: 3, nome: "Mel", especie: "Cachorro", idade: 1, porte: "Pequeno", status: "Disponível", imagem: "https://placedog.net/201/200" },
  { id: 4, nome: "Jabuti", especie: "Jacaré", idade: 5, porte: "Grande", status: "Disponível", imagem: "https://placeimg.com/200/200/reptile" },
  { id: 5, nome: "Galinha", especie: "Galinha", idade: 2, porte: "Pequeno", status: "Disponível", imagem: "https://placeimg.com/200/200/bird" }
];

// Carrinho de adoção
let carrinho = [];

// Histórico de adoções
let historicoAdocoes = [];

// Mostrar sessão
function mostrarSessao(id) {
  document.querySelectorAll(".sessao").forEach(sec => sec.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
  if(id === "animais") listarAnimais();
  if(id === "inicio") document.getElementById("msg-confirmacao").innerHTML = "";
}

// Listar animais (cliente)
function listarAnimais() {
  const container = document.getElementById("animais-container");
  container.innerHTML = "";
  const especieFiltro = document.getElementById("filtro-especie").value;
  const idadeFiltro = document.getElementById("filtro-idade").value;
  const porteFiltro = document.getElementById("filtro-porte").value;

  let filtrados = animais.filter(a => a.status === "Disponível");

  if(especieFiltro) filtrados = filtrados.filter(a => a.especie === especieFiltro);
  if(porteFiltro) filtrados = filtrados.filter(a => a.porte === porteFiltro);
  if(idadeFiltro){
    if(idadeFiltro === "0-1") filtrados = filtrados.filter(a => a.idade <= 1);
    if(idadeFiltro === "2-4") filtrados = filtrados.filter(a => a.idade >=2 && a.idade <=4);
    if(idadeFiltro === "5+") filtrados = filtrados.filter(a => a.idade >=5);
  }

  if(filtrados.length === 0){
    document.getElementById("msg-nao-encontrado").innerText = "Animal não consta no banco de dados.";
  } else {
    document.getElementById("msg-nao-encontrado").innerText = "";
  }

  filtrados.forEach(a => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${a.imagem}" alt="${a.nome}">
      <h3>${a.nome}</h3>
      <p>${a.especie} - ${a.idade} anos - ${a.porte}</p>
      <button onclick="adicionarCarrinho(${a.id})">Adotar 💜</button>
    `;
    container.appendChild(card);
  });
}

// Adicionar ao carrinho
function adicionarCarrinho(id) {
  const animal = animais.find(a => a.id === id);
  if(!carrinho.includes(animal)){
    carrinho.push(animal);
    atualizarCarrinho();
    subirCoracao();
  }
}

// Atualizar pop-up carrinho
function atualizarCarrinho() {
  const lista = document.getElementById("carrinho-list");
  lista.innerHTML = carrinho.map(a => `<li>${a.nome} (${a.especie})</li>`).join('');
}

// Mostrar/ocultar carrinho
function toggleCarrinho() {
  const popup = document.getElementById("carrinho-popup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}

// Finalizar adoção
function finalizarAdocao() {
  if(carrinho.length === 0) return alert("Adicione pelo menos um animal ao carrinho!");
  mostrarSessao("cadastro-adotante");
}

// Enviar dados do adotante
function submitAdotante(event){
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

  // Atualizar status dos animais
  carrinho.forEach(a => a.status = "Adotado");
  carrinho = [];
  atualizarCarrinho();

  // Mensagem final
  mostrarSessao("inicio");
  document.getElementById("msg-confirmacao").innerHTML = `
    Obrigado, <b>${dados.nome}</b>! 💜<br>
    Entraremos em contato pelo email ou telefone para agendar a adoção dos pets escolhidos.
  `;
}

// Portal do funcionário
const FUNC_EMAIL = "funcionario@email";
const FUNC_SENHA = "bebeto321";

function loginFuncionario(event){
  event.preventDefault();
  const email = event.target[0].value;
  const senha = event.target[1].value;
  const portal = document.getElementById("portal-conteudo");
  if(email === FUNC_EMAIL && senha === FUNC_SENHA){
    portal.classList.remove("oculto");
    listarAnimaisFuncionario();
    listarHistoricoFuncionario();
    mostrarEstatisticas();
  } else {
    alert("Email ou senha incorretos.");
  }
}

// Listar animais (funcionário)
function listarAnimaisFuncionario() {
  const container = document.getElementById("animais-funcionario");
  container.innerHTML = "";
  animais.forEach(a => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${a.nome}</td>
      <td>${a.especie}</td>
      <td>${a.idade}</td>
      <td>${a.porte}</td>
      <td>${a.status}</td>
      <td><button onclick="removerAnimal(${a.id})">Remover</button></td>
    `;
    container.appendChild(row);
  });
}

// Cadastrar animal (funcionário)
function cadastrarAnimal(event){
  event.preventDefault();
  const form = event.target;
  const novo = {
    id: animais.length + 1,
    nome: form[0].value,
    especie: form[1].value,
    idade: Number(form[2].value),
    porte: form[3].value,
    status: "Disponível",
    imagem: form[4].value || "https://placekitten.com/200/200"
  };
  animais.push(novo);
  listarAnimaisFuncionario();
  listarAnimais();
  form.reset();
}

// Remover animal
function removerAnimal(id){
  animais = animais.filter(a => a.id !== id);
  listarAnimaisFuncionario();
  listarAnimais();
}

// Listar histórico de adoções
function listarHistoricoFuncionario() {
  const container = document.getElementById("historico-funcionario");
  container.innerHTML = "";
  historicoAdocoes.forEach(h => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${h.nome}</td>
      <td>${h.email}</td>
      <td>${h.telefone}</td>
      <td>${h.endereco}</td>
      <td>${h.animaisAdotados.map(a => a.nome).join(", ")}</td>
    `;
    container.appendChild(row);
  });
}

// Estatísticas rápidas
function mostrarEstatisticas() {
  const disp = animais.filter(a => a.status === "Disponível").length;
  const adot = animais.filter(a => a.status === "Adotado").length;
  document.getElementById("estatisticas").innerHTML = `
    <p>Total disponíveis: ${disp}</p>
    <p>Total adotados: ${adot}</p>
  `;
}

// Animação de coração subindo
function subirCoracao() {
  const heart = document.createElement("div");
  heart.innerText = "💜";
  heart.style.position = "fixed";
  heart.style.bottom = "100px";
  heart.style.right = "90px";
  heart.style.fontSize = "24px";
  heart.style.opacity = 1;
  heart.style.zIndex = 1000;
  document.body.appendChild(heart);

  let pos = 100;
  const interval = setInterval(() => {
    pos += 2;
    heart.style.bottom = pos + "px";
    heart.style.opacity -= 0.02;
    if(pos > 200){
      clearInterval(interval);
      heart.remove();
    }
  }, 10);
}
