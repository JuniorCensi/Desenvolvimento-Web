// Função para carregar e renderizar variedades
document.addEventListener('DOMContentLoaded', async function() {
  const container = document.querySelector('.variedades-container');
  if (!container) return;
  try {
    const resp = await fetch('/variedades');
    if (!resp.ok) throw new Error('Erro ao buscar variedades');
    const variedades = await resp.json();
    if (!Array.isArray(variedades) || variedades.length === 0) {
      container.innerHTML = '<p>Nenhuma variedade cadastrada.</p>';
      return;
    }
    container.innerHTML = '';
    renderVariedades(variedades);
  } catch (err) {
    container.innerHTML = '<p>Erro ao carregar variedades.</p>';
  }
});

// Função para buscar categorias
async function fetchCategorias() {
  const resp = await fetch('/categorias');
  return await resp.json();
}

// Função para buscar embalagens
async function fetchEmbalagens() {
  const resp = await fetch('/embalagens');
  return await resp.json();
}

// Função para renderizar variedades na tela
function renderVariedades(variedades) {
  const container = document.querySelector('.variedades-container');
  container.innerHTML = '';
  variedades.forEach(v => {
    const card = document.createElement('div');
    card.className = 'card-variedade';

    // Conteúdo do card, em HTML
    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; min-height: 38px; width: 100%;">
        <i class="bi bi-pencil-square" style="font-size: 1.4em; color: #222; margin-right: 8px; align-self: center;"></i>
        <span style="font-weight: 400; font-size: 1.02em; color: #222; letter-spacing: 0.01em; align-self: center;">Variedade:</span>
        <span style="font-weight: 600; font-size: 1.18em; text-transform: uppercase; color: #222; letter-spacing: 0.02em; align-self: center;">${v.nome}</span>
        <span style="flex: 1 1 auto;"></span>
        <span style="font-weight: 400; font-size: 0.98em; color: #222; align-self: center;">Categoria:</span>
        <span style="font-weight: 600; font-size: 1.18em; color: #222; letter-spacing: 0.02em; align-self: center;">${v.categoria?.nome || 'N/A'}</span>
      </div>
    `;
    // Aplica cor de fundo baseada na cor da categoria
    if (v.categoria && v.categoria.cor) {
      let cor = v.categoria.cor;
      if (!cor.startsWith('#')) cor = '#' + cor;
      card.style.background = hexToLight(cor, 1); // ajustar alpha para cor mais clara
      card.style.borderColor = cor;
    } else {
      card.style.background = '';
      card.style.borderColor = '';
    }
    card.addEventListener('click', async function(e) {
      // Cria modal de edição
      e.stopPropagation();
      if (document.getElementById('modal-editar-variedade')) return;
      const [categorias, embalagens] = await Promise.all([fetchCategorias(), fetchEmbalagens()]);
      const modal = document.createElement('div');
      modal.id = 'modal-editar-variedade';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content card-variedade expanded" style="max-width: 480px; min-width: 320px;">
          <button class="close-modal" title="Fechar">&times;</button>
          <form class="edit-fields">
            <label>Nome:<input type="text" name="nome" value="${v.nome}" maxlength="30"></label>
            <label>Descrição:<textarea name="descricao" maxlength="150" style="min-height:60px;max-height:60px;resize:none;">${v.descricao || ''}</textarea></label>
            <label>Categoria:
              <select name="categoria" required>
                ${categorias.map(cat => `<option value="${cat._id}"${v.categoria && v.categoria._id === cat._id ? ' selected' : ''}>${cat.nome}</option>`).join('')}
              </select>
            </label>
            <label>Embalagens:
              <div class="embalagens-list">
                ${v.embalagem.map(e => {
                  const emb = embalagens.find(em => em._id === e._id);
                  if (!emb) return '';
                  return `<span class="embalagem-tag" data-id="${emb._id}">${emb.descricao} (${emb.tamanho}) <button class="remove-embalagem" data-id="${emb._id}" title="Remover">&times;</button></span>`;
                }).join('')}
                <select name="add-embalagem">
                  <option value="">Adicionar embalagem...</option>
                  ${embalagens.filter(emb => !v.embalagem.map(e=>e._id).includes(emb._id)).map(emb => `<option value="${emb._id}">${emb.descricao} (${emb.tamanho})</option>`).join('')}
                </select>
              </div>
            </label>
            <div style="display:flex; gap:8px; justify-content:flex-end;">
              <button type="button" class="delete-btn">Excluir</button>
              <button type="submit" class="save-btn">Salvar</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);
      // Fechar modal
      modal.querySelector('.close-modal').onclick = () => modal.remove();
      // Controle de fechamento seguro
      let mouseDownInside = false;
      modal.querySelector('.modal-content').addEventListener('mousedown', () => { mouseDownInside = true; });
      modal.addEventListener('mousedown', e => {
        if (e.target === modal) mouseDownInside = false;
      });
      modal.addEventListener('mouseup', e => {
        if (e.target === modal && !mouseDownInside) modal.remove();
        mouseDownInside = false;
      });
      // Botão excluir
      modal.querySelector('.delete-btn').onclick = async function(e) {
        e.preventDefault();
        if (confirm('Excluir esta variedade?')) {
          await fetch(`/variedades/${v._id}`, { method: 'DELETE' });
          modal.remove();
          carregarVariedades();
        }
      };
      // Botão salvar
      modal.querySelector('form').onsubmit = async function(e) {
        e.preventDefault();
        const nome = modal.querySelector('input[name="nome"]').value;
        const descricao = modal.querySelector('textarea[name="descricao"]').value;
        const categoria = modal.querySelector('select[name="categoria"]').value;
        let embalagem = Array.from(modal.querySelectorAll('.embalagem-tag')).map(tag => tag.getAttribute('data-id'));
        if (!Array.isArray(embalagem)) embalagem = [];
        const payload = { nome, descricao, categoria, embalagem };
        const resp = await fetch(`/variedades/${v._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          alert('Erro ao salvar variedade: ' + (err.message || resp.status));
          return;
        }
        modal.remove();
        carregarVariedades();
      };
      // Adicionar embalagem
      const addSelect = modal.querySelector('select[name="add-embalagem"]');
      addSelect.addEventListener('change', function(e) {
        const val = addSelect.value;
        if (val) {
          const emb = embalagens.find(em => em._id === val);
          if (emb) {
            const tag = document.createElement('span');
            tag.className = 'embalagem-tag';
            tag.setAttribute('data-id', emb._id);
            tag.innerHTML = `${emb.descricao} (${emb.tamanho}) <button class="remove-embalagem" data-id="${emb._id}" title="Remover">&times;</button>`;
            addSelect.parentElement.insertBefore(tag, addSelect);
            addSelect.querySelector(`option[value="${emb._id}"]`).remove();
            addSelect.value = '';
          }
        }
      });
      // Remover embalagem
      modal.querySelector('.embalagens-list').addEventListener('click', function(e) {
        if (e.target && e.target.matches('button.remove-embalagem')) {
          e.preventDefault();
          e.stopPropagation();
          const btn = e.target;
          const id = btn.getAttribute('data-id');
          const tag = btn.closest('.embalagem-tag');
          if (tag) tag.remove();
          // Reinsere opção no select, mantendo ordem alfabética
          const emb = embalagens.find(em => em._id === id);
          if (emb) {
            const opt = document.createElement('option');
            opt.value = emb._id;
            opt.textContent = `${emb.descricao} (${emb.tamanho})`;
            let inserted = false;
            for (let i = 1; i < addSelect.options.length; i++) {
              if (addSelect.options[i].textContent.localeCompare(opt.textContent) > 0) {
                addSelect.insertBefore(opt, addSelect.options[i]);
                inserted = true;
                break;
              }
            }
            if (!inserted) addSelect.appendChild(opt);
          }
        }
      });
    });
    container.appendChild(card);
  });
}

// Função utilitária para clarear cor hex
function hexToLight(hex, alpha=0.35) {
  hex = hex.replace('#','');
  if (hex.length === 3) hex = hex.split('').map(x=>x+x).join('');
  const r = parseInt(hex.slice(0,2),16);
  const g = parseInt(hex.slice(2,4),16);
  const b = parseInt(hex.slice(4,6),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Função para carregar variedades inicialmente
async function carregarVariedades() {
  const resp = await fetch('/variedades');
  const variedades = await resp.json();
  renderVariedades(variedades);
}

carregarVariedades();

// Botão + abre modal
const addBtn = document.getElementById('add-variedade-btn');
const modal = document.getElementById('modal-variedade');
let closeModal = null;
if (modal) closeModal = modal.querySelector('.close-modal');
if (addBtn && modal) addBtn.onclick = () => modal.classList.add('active');
if (closeModal && modal) closeModal.onclick = () => modal.classList.remove('active');
if (modal) modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });

// Formulário de nova variedade
const formNova = document.getElementById('form-nova-variedade');
if (formNova && modal) {
  // Preencher categorias e embalagens ao abrir o modal
  const selectCategoria = formNova.querySelector('select[name="categoria"]');
  const embalagensListDiv = formNova.querySelector('.embalagens-list');
  let embalagensDisponiveis = [];
  let embalagensSelecionadas = [];
  function renderEmbalagensSelect() {
    // Renderiza tags das embalagens selecionadas
    embalagensListDiv.innerHTML =
      embalagensSelecionadas.map(eid => {
        const emb = embalagensDisponiveis.find(em => em._id === eid);
        if (!emb) return '';
        return `<span class="embalagem-tag" data-id="${emb._id}">${emb.descricao} (${emb.tamanho}) <button class="remove-embalagem" data-id="${emb._id}" title="Remover">&times;</button></span>`;
      }).join('') +
      `<select name="add-embalagem" style="width:100%;margin-top:6px;">
        <option value="">Adicionar embalagem...</option>
        ${embalagensDisponiveis.filter(emb => !embalagensSelecionadas.includes(emb._id)).map(emb => `<option value="${emb._id}">${emb.descricao} (${emb.tamanho})</option>`).join('')}
      </select>`;
  }
  addBtn.addEventListener('click', async () => {
    // Preenche categorias
    if (selectCategoria) {
      const categorias = await fetchCategorias();
      selectCategoria.innerHTML = '<option value="" disabled selected>Selecione...</option>' +
        categorias.map(cat => `<option value="${cat._id}">${cat.nome}</option>`).join('');
    }
    // Preenche embalagens
    if (embalagensListDiv) {
      embalagensDisponiveis = await fetchEmbalagens();
      embalagensSelecionadas = [];
      renderEmbalagensSelect();
    }
  });
  // Event delegation para adicionar/remover embalagem
  if (embalagensListDiv) {
    embalagensListDiv.addEventListener('change', function(e) {
      if (e.target && e.target.name === 'add-embalagem') {
        const val = e.target.value;
        if (val) {
          embalagensSelecionadas.push(val);
          renderEmbalagensSelect();
        }
      }
    });
      embalagensListDiv.addEventListener('click', function(e) {
        // Remover embalagem só se clicar exatamente no botão X
        if (e.target && e.target.matches('button.remove-embalagem')) {
          e.preventDefault();
          e.stopPropagation();
          const btn = e.target;
          const id = btn.getAttribute('data-id');
          embalagensSelecionadas = embalagensSelecionadas.filter(eid => eid !== id);
          renderEmbalagensSelect();
        }
      });
  }
  // Estiliza o botão salvar (garantia extra caso não esteja com a classe)
  const btnSalvar = formNova.querySelector('button[type="submit"]');
  if (btnSalvar) btnSalvar.classList.add('save-btn');
  formNova.onsubmit = async function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formNova));
    // Coleta embalagens selecionadas
    const embalagem = embalagensSelecionadas.slice();
    const payload = {
      nome: data.nome,
      descricao: data.descricao,
      categoria: data.categoria,
      embalagem
    };
    await fetch('/variedades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    modal.classList.remove('active');
    carregarVariedades();
  };
}
