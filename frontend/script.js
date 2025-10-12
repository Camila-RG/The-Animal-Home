// Define a URL base da sua API backend para centralizar a referência
const API_URL = 'http://localhost:3000';

/**
 * @description Altera a visibilidade das seções da página (Início, Ver Animais, etc.).
 * @param {string} id - O ID da seção que deve ser exibida.
 */
function mostrarSessao(id) {
  // Esconde todas as seções
  document.querySelectorAll(".sessao").forEach(sec => sec.classList.remove("ativa"));
  // Exibe apenas a seção desejada
  document.getElementById(id).classList.add("ativa");
  // Se a seção for a de lista de animais, atualiza os dados
  if (id === 'lista-animais') {
    atualizarLista();
  }
}

// Array para armazenar os animais selecionados para adoção no frontend
let carrinho = [];

// Dados de login para o portal do funcionário
const funcEmail = "funcionario@email";
const funcSenha = "bebeto321";

/**
 * @description Cria uma animação de um coração que flutua na tela a partir de um ponto.
 * @param {number} x - A coordenada X inicial do coração.
 * @param {number} y - A coordenada Y inicial do coração.
 */
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

/**
 * @description Busca os animais disponíveis na API e os exibe na tela.
 * Também aplica os filtros selecionados pelo usuário.
 */
async function atualizarLista() {
  const lista = document.getElementById("lista-animais-cards");
  lista.innerHTML = "<p>Carregando animais... 🐾</p>";

  // Pega os valores dos filtros
  const especie = document.getElementById("filtro-especie").value;
  const idade = document.getElementById("filtro-idade").value;
  const porte = document.getElementById("filtro-porte").value;

  // Monta a URL com os parâmetros de filtro para a API
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
    // Faz a requisição para a API
    const response = await fetch(`${API_URL}/animais?${params.toString()}`);
    if (!response.ok) throw new Error('Falha ao buscar os animais.');
    
    const animais = await response.json();

    // Se não houver animais, exibe uma mensagem
    if (animais.length === 0) {
      lista.innerHTML = "<p>Nenhum animal encontrado com esses filtros. 🐾</p>";
      return;
    }

    // Cria os cards para cada animal e os insere na página
    lista.innerHTML = animais.map(a => `
      <div class="card">
        <img src="${a.imagem_url || 'images/logo.png'}" alt="${a.nome}">
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
 * @description Adiciona um animal ao carrinho de adoção local.
 * @param {object} animal - O objeto do animal a ser adicionado.
 * @param {Event} e - O evento de clique para a animação do coração.
 */
function adicionarCarrinho(animal, e) {
  // Verifica se o animal já está no carrinho para evitar duplicatas
  if (animal && !carrinho.some(item => item.id_animal === animal.id_animal)) {
    carrinho.push(animal);
    atualizarCarrinho(); // Atualiza a exibição do carrinho
    criarCoracao(e.clientX, e.clientY); // Cria a animação
  } else {
    alert(`${animal.nome} já está no seu carrinho de adoção!`);
  }
}

/**
 * @description Atualiza a interface do pop-up do carrinho com os animais selecionados.
 */
function atualizarCarrinho() {
  const popup = document.getElementById("popup-carrinho");
  const lista = document.getElementById("carrinho-list");
  // Se o carrinho estiver vazio, esconde o pop-up
  if (carrinho.length === 0) {
    popup.style.display = "none";
    return;
  }
  // Preenche a lista do carrinho e o exibe
  lista.innerHTML = carrinho.map(a => `<li>${a.nome}</li>`).join('');
  popup.style.display = "block";
}

/**
 * @description Leva o usuário para a tela do formulário de adoção.
 */
function finalizarAdocao() {
  if (carrinho.length === 0) {
    alert("Adicione ao menos um animal ao carrinho.");
    return;
  }
  mostrarSessao('form-adocao');
}

// Evento que escuta o envio do formulário de adoção
document.getElementById("adocao-form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Impede o recarregamento da página
  const form = this;
  const nomeAdotante = form.querySelector('input[type="text"]').value;
  const emailAdotante = form.querySelector('input[type="email"]').value;
  const telefoneAdotante = form.querySelector('input[type="tel"]').value;
  const mensagem = document.getElementById("mensagem-final");

  try {
    // 1. Cadastra o novo adotante na API
    const resAdotante = await fetch(`${API_URL}/adotantes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: nomeAdotante, email: emailAdotante, telefone: telefoneAdotante })
    });
    if (!resAdotante.ok) throw new Error('Falha ao cadastrar adotante.');
    const novoAdotante = await resAdotante.json();
    
    // 2. Registra a adoção para cada animal no carrinho
    for (const animal of carrinho) {
      await fetch(`${API_URL}/adocoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_animal: animal.id_animal, id_adotante: novoAdotante.id_adotante })
      });
    }

    // 3. Limpa os dados e exibe mensagem de sucesso
    carrinho = [];
    atualizarCarrinho();
    mensagem.innerHTML = "💖 Obrigado! Entraremos em contato para finalizar o processo de adoção!";
    form.reset();

  } catch (error) {
    console.error("Erro ao finalizar adoção:", error);
    mensagem.innerHTML = "❌ Ops! Ocorreu um erro ao registrar a adoção. Tente novamente.";
  }
});

/**
 * @description Função chamada pelo botão "Filtrar" para recarregar a lista de animais.
 */
function aplicarFiltros() {
  atualizarLista();
}

// --- Funções do Portal do Funcionário ---

// Evento que escuta o envio do formulário de login
document.getElementById("form-login-func").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  const senha = this.querySelector('input[type="password"]').value;
  
  // Verifica se as credenciais estão corretas
  if (email === funcEmail && senha === funcSenha) {
    document.getElementById("form-login-func").classList.add("oculto");
    document.getElementById("portal-conteudo").classList.remove("oculto");
    // Carrega as tabelas de animais e histórico
    atualizarTabelaAnimais();
    atualizarHistorico();
  } else {
    alert("Email ou senha incorretos.");
  }
});

// Evento que escuta o envio do formulário de cadastro de um novo animal
document.getElementById("form-cadastro-animal").addEventListener("submit", async function (e) {
  e.preventDefault();
  
  // Captura os dados do formulário usando os IDs
  const novoAnimal = {
    nome: document.getElementById("animal-nome").value,
    especie: document.getElementById("animal-especie").value,
    idade: Number(document.getElementById("animal-idade").value),
    sexo: document.getElementById("animal-sexo").value,
    porte: document.getElementById("animal-porte").value,
    imagem_url: document.getElementById("animal-imagem-url").value,
    status: "Disponível"
  };

  try {
    // Envia os dados para a API
    const response = await fetch(`${API_URL}/animais`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoAnimal)
    });
    if (!response.ok) {
        const erroData = await response.json();
        throw new Error(erroData.erro || 'Erro ao cadastrar animal.');
    }

    alert('Animal cadastrado com sucesso!');
    atualizarTabelaAnimais(); // Atualiza a tabela de animais
    this.reset(); // Limpa o formulário
  } catch (error) {
    console.error("Erro no cadastro:", error);
    alert(`Falha ao cadastrar animal. Detalhe: ${error.message}`);
  }
});

/**
 * @description Busca todos os animais cadastrados e os exibe na tabela do funcionário.
 */
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

/**
 * @description Remove um animal do sistema através da API.
 * @param {number} id_animal - O ID do animal a ser removido.
 */
async function removerAnimal(id_animal) {
  if (!confirm('Tem certeza que deseja remover este animal do sistema?')) return;

  try {
    const response = await fetch(`${API_URL}/animais/${id_animal}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Falha ao remover.');

    alert('Animal removido com sucesso!');
    atualizarTabelaAnimais(); // Atualiza a tabela após a remoção
  } catch (error) {
    console.error("Erro ao remover:", error);
    alert('Não foi possível remover o animal.');
  }
}

/**
 * @description Realiza o logout do funcionário, escondendo o portal e mostrando o login.
 */
function sairFuncionario() {
  document.getElementById("portal-conteudo").classList.add("oculto");
  document.getElementById("form-login-func").classList.remove("oculto");
  document.getElementById("form-login-func").reset();
}

/**
 * @description Busca o histórico de adoções na API e o exibe na tabela do funcionário.
 */
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

// Evento que executa quando o conteúdo da página é totalmente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Exibe a seção inicial por padrão
    mostrarSessao('inicio');
});