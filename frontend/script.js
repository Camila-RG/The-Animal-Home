// Em frontend/script.js

// Define a URL base da sua API backend
const API_URL = 'http://localhost:3000';

// Sessões
function mostrarSessao(id) {
  document.querySelectorAll(".sessao").forEach(sec => sec.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
  if (id === 'lista-animais') {
    atualizarLista();
  }
}

// Carrinho de adoção (mantido no lado do cliente)
let carrinho = [];

// Login do funcionário (lógica mantida como no original)
const funcEmail = "funcionario@email";
const funcSenha = "bebeto321";

// --- Funções de Animação e UI (sem alterações) ---

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
    heart.style.opacity = 1 - pos / 50;
    if (pos >= 50) {
      clearInterval(anim);
      heart.remove();
    }
  }, 10);
}

// --- Funções Integradas com o Backend ---

/**
 * Atualiza a lista de animais buscando dados da API.
 * Aplica os filtros selecionados na tela.
 */
async function atualizarLista() {
  const lista = document.getElementById("lista-animais-cards");
  lista.innerHTML = "<p>Carregando animais... 🐾</p>";

  // Pega os valores dos filtros
  const especie = document.getElementById("filtro-especie").value;
  const idade = document.getElementById("filtro-idade").value;
  const porte = document.getElementById("filtro-porte").value;

  // Monta a URL com os filtros como query params
  const params = new URLSearchParams({ status: 'Disponível' });
  if (especie) params.append('especie', especie);
  if (porte) params.append('porte', porte);
  if (idade) {
    if (idade.includes('+')) {
      params.append('idade_min', idade.replace('+', ''));
    } else {
      params.append('idade_max', idade);
      params.append('idade_min', idade);
    }
  }
  
  try {
    const response = await fetch(`${API_URL}/animais?${params.toString()}`);
    if (!response.ok) throw new Error('Falha ao buscar os animais.');
    
    const animais = await response.json();

    if (animais.length === 0) {
      lista.innerHTML = "<p>Nenhum animal encontrado com esses filtros. 🐾</p>";
      return;
    }

    lista.innerHTML = animais.map(a => `
      <div class="card">
        <img src="https://placedog.net/200/200?id=${a.id_animal}" alt="${a.nome}">
        <h3>${a.nome}</h3>
        <p>${a.especie} - ${a.idade} anos - ${a.porte}</p>
        <button onclick='adicionarCarrinho(${JSON.stringify(a)}, event)'>Adotar</button>
      </div>
    `).join('');

  } catch (error) {
    console.error("Erro ao atualizar lista:", error);
    lista.innerHTML = "<p>Ocorreu um erro ao carregar os animais. Tente novamente mais tarde.</p>";
  }
}

/**
 * Adiciona um animal ao carrinho de adoção local.
 * @param {object} animal - O objeto completo do animal.
 * @param {Event} e - O evento do clique para a animação.
 */
function adicionarCarrinho(animal, e) {
  // Verifica se o animal já está no carrinho pelo ID
  if (animal && !carrinho.some(item => item.id_animal === animal.id_animal)) {
    carrinho.push(animal);
    atualizarCarrinho();
    criarCoracao(e.clientX, e.clientY);
  } else {
    alert(`${animal.nome} já está no seu carrinho de adoção!`);
  }
}

// Atualiza o pop-up do carrinho
function atualizarCarrinho() {
  const popup = document.getElementById("popup-carrinho");
  const lista = document.getElementById("carrinho-list");
  if (carrinho.length === 0) {
    popup.style.display = "none";
    return;
  }
  lista.innerHTML = carrinho.map(a => `<li>${a.nome}</li>`).join('');
  popup.style.display = "block";
}

// Finalizar adoção e ir para o formulário
function finalizarAdocao() {
  if (carrinho.length === 0) {
    alert("Adicione ao menos um animal ao carrinho.");
    return;
  }
  mostrarSessao('form-adocao');
}

// Enviar formulário de adoção
document.getElementById("adocao-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = this;
  const nomeAdotante = form.querySelector('input[type="text"]').value;
  const emailAdotante = form.querySelector('input[type="email"]').value;
  const telefoneAdotante = form.querySelector('input[type="tel"]').value;
  const mensagem = document.getElementById("mensagem-final");

  try {
    // 1. Cadastrar o adotante
    const resAdotante = await fetch(`${API_URL}/adotantes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: nomeAdotante, email: emailAdotante, telefone: telefoneAdotante })
    });
    if (!resAdotante.ok) throw new Error('Falha ao cadastrar adotante.');
    const novoAdotante = await resAdotante.json();
    
    // 2. Registrar cada adoção
    for (const animal of carrinho) {
      await fetch(`${API_URL}/adocoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_animal: animal.id_animal, id_adotante: novoAdotante.id_adotante })
      });
    }

    // 3. Limpar tudo e mostrar mensagem de sucesso
    carrinho = [];
    atualizarLista();
    document.getElementById("popup-carrinho").style.display = "none";
    mensagem.innerHTML = "💖 Obrigado! Entraremos em contato para finalizar o processo de adoção!";
    form.reset();

  } catch (error) {
    console.error("Erro ao finalizar adoção:", error);
    mensagem.innerHTML = "❌ Ops! Ocorreu um erro ao registrar a adoção. Tente novamente.";
  }
});


// Aplicar filtros
function aplicarFiltros() {
  atualizarLista();
}

// --- Portal do Funcionário ---

// Login
document.getElementById("form-login-func").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  const senha = this.querySelector('input[type="password"]').value;
  if (email === funcEmail && senha === funcSenha) {
    document.getElementById("form-login-func").classList.add("oculto");
    document.getElementById("portal-conteudo").classList.remove("oculto");
    atualizarTabelaAnimais();
    atualizarHistorico();
  } else {
    alert("Email ou senha incorretos.");
  }
});

// Cadastrar novo animal
document.getElementById("form-cadastro-animal").addEventListener("submit", async function (e) {
  e.preventDefault();
  const inputs = this.querySelectorAll("input, select");
  const novoAnimal = {
    nome: inputs[0].value,
    especie: inputs[1].value,
    idade: Number(inputs[2].value),
    sexo: inputs[3].value,
    porte: inputs[4].value,
    status: "Disponível"
  };

  try {
    const response = await fetch(`${API_URL}/animais`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoAnimal)
    });
    if (!response.ok) throw new Error('Erro ao cadastrar animal.');

    alert('Animal cadastrado com sucesso!');
    atualizarTabelaAnimais();
    atualizarLista();
    this.reset();
  } catch (error) {
    console.error("Erro no cadastro:", error);
    alert('Falha ao cadastrar animal. Verifique o console.');
  }
});

// Atualiza a tabela de animais no portal do funcionário
async function atualizarTabelaAnimais() {
  const tbody = document.querySelector("#tabela-animais tbody");
  tbody.innerHTML = '<tr><td colspan="6">Carregando...</td></tr>';
  
  try {
    const response = await fetch(`${API_URL}/animais`);
    const animais = await response.json();
    tbody.innerHTML = animais.map(a => `
      <tr>
        <td>${a.nome}</td>
        <td>${a.especie}</td>
        <td>${a.idade}</td>
        <td>${a.porte}</td>
        <td>${a.status}</td>
        <td><button onclick="removerAnimal(${a.id_animal})">Remover</button></td>
      </tr>
    `).join('');
  } catch (error) {
    console.error("Erro ao buscar animais:", error);
    tbody.innerHTML = '<tr><td colspan="6">Erro ao carregar animais.</td></tr>';
  }
}

// Remover animal
async function removerAnimal(id_animal) {
  if (!confirm('Tem certeza que deseja remover este animal do sistema?')) return;

  try {
    const response = await fetch(`${API_URL}/animais/${id_animal}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Falha ao remover.');

    alert('Animal removido com sucesso!');
    atualizarTabelaAnimais();
    atualizarLista();
  } catch (error) {
    console.error("Erro ao remover:", error);
    alert('Não foi possível remover o animal.');
  }
}

// Logout do funcionário
function sairFuncionario() {
  document.getElementById("portal-conteudo").classList.add("oculto");
  document.getElementById("form-login-func").classList.remove("oculto");
  // Limpa os campos do formulário de login para segurança
  document.getElementById("form-login-func").reset();
}

// Histórico de adoções
async function atualizarHistorico() {
  const tbody = document.querySelector("#tabela-adocoes tbody");
  tbody.innerHTML = '<tr><td colspan="3">Carregando...</td></tr>';

  try {
    const response = await fetch(`${API_URL}/adocoes`);
    const adocoes = await response.json();

    if (adocoes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3">Nenhuma adoção registrada ainda.</td></tr>';
      return;
    }
    
    tbody.innerHTML = adocoes.map(a => `
      <tr>
        <td>${a.nome_animal}</td>
        <td>${a.nome_adotante}</td>
        <td>${new Date(a.data_adocao).toLocaleDateString('pt-BR')}</td>
      </tr>
    `).join('');
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    tbody.innerHTML = '<tr><td colspan="3">Erro ao carregar histórico.</td></tr>';
  }
}

// Inicializa a lista de animais ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    mostrarSessao('inicio');
});