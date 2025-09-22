// Utilitário para exibir mensagens de erro abaixo dos campos
function setFieldError(input, message) {
  let error = input.parentElement.querySelector('.field-error');
  if (!error) {
    error = document.createElement('div');
    error.className = 'field-error';
    input.parentElement.appendChild(error);
  }
  error.textContent = message || '';
  error.style.display = message ? 'block' : 'none';
}

// Limpa todas as mensagens de erro do formulário
function clearFormErrors(form) {
  form.querySelectorAll('.field-error').forEach(e => e.remove());
}

// Validação do formulário de perfil do usuário
function validateUserForm(form) {
  let valid = true;
  clearFormErrors(form);
  // Telefone Celular obrigatório: 11 dígitos (formato (99) 99999-9999)
  const telCel = form.telefoneCel;
  const celDigits = telCel.value.replace(/\D/g, '');
  if (!telCel.value.trim() || celDigits.length !== 11) {
    setFieldError(telCel, 'Celular deve ter 11 dígitos: (99) 99999-9999');
    valid = false;
  }
  // Telefone Residencial opcional, mas se preenchido, deve ter 10 dígitos (formato (99) 9999-9999)
  const telRes = form.telefoneRes;
  const resDigits = telRes.value.replace(/\D/g, '');
  if (telRes.value && resDigits.length > 0 && resDigits.length !== 10) {
    setFieldError(telRes, 'Residencial deve ter 10 dígitos: (99) 9999-9999');
    valid = false;
  }
return valid;
}

// Máscara automática para telefones (corrigida, agora global)
function aplicarMascaraTelefone(input, tipo) {
  function formatar(v) {
    v = v.replace(/\D/g, '');
    if (tipo === 'celular') {
      v = v.slice(0, 11);
      if (v.length > 6) return `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      if (v.length > 2) return `(${v.slice(0,2)}) ${v.slice(2)}`;
      if (v.length > 0) return `(${v}`;
      return '';
    } else {
      v = v.slice(0, 10);
      if (v.length > 6) return `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
      if (v.length > 2) return `(${v.slice(0,2)}) ${v.slice(2)}`;
      if (v.length > 0) return `(${v}`;
      return '';
    }
  }
  function aplicar(e) {
    const pos = input.selectionStart;
    const antes = input.value;
    input.value = formatar(input.value);
    // Ajusta o cursor para o final
    if (document.activeElement === input) {
      let diff = input.value.length - antes.length;
      input.setSelectionRange(pos + diff, pos + diff);
    }
  }
  input.addEventListener('input', aplicar);
  input.addEventListener('blur', aplicar);
  input.addEventListener('paste', function(e) {
    setTimeout(aplicar, 0);
  });
}

// Validação do formulário de endereço
function validateEnderecoForm(form) {
  let valid = true;
  clearFormErrors(form);
  const requiredFields = ['rua','numero','cep','bairro','cidade','estado'];
  requiredFields.forEach(name => {
    const input = form[name];
    if (!input.value.trim()) {
      setFieldError(input, 'Campo obrigatório.');
      valid = false;
    }
  });
  // CEP: só números, 8 dígitos
  const cep = form.cep;
  if (cep && !/^\d{8}$/.test(cep.value.replace(/\D/g, ''))) {
    setFieldError(cep, 'CEP deve ter 8 dígitos numéricos.');
    valid = false;
  }
  // Estado: 2 letras
  const estado = form.estado;
  if (estado && !/^([A-Za-z]{2})$/.test(estado.value.trim())) {
    setFieldError(estado, 'UF deve ter 2 letras.');
    valid = false;
  }
  return valid;
}

// Carrega dados do usuário e preenche o formulário
document.addEventListener('DOMContentLoaded', async function() {
  const token = localStorage.getItem('token');
  if (!token) return (window.location.href = '/login');
  let usuario;
  try {
    const resp = await fetch('/usuarios/me', { headers: { 'Authorization': 'Bearer ' + token } });
    if (!resp.ok) throw new Error();
    usuario = await resp.json();
  } catch {
    localStorage.removeItem('token');
    return (window.location.href = '/login');
  }

  preencherPerfil(usuario);
  renderizarEnderecos(usuario.endereco || []);
  setupEventos(token);
  // Aplica máscara nos campos de telefone
  const telCel = document.querySelector('[name="telefoneCel"]');
  if (telCel) aplicarMascaraTelefone(telCel, 'celular');
  const telRes = document.querySelector('[name="telefoneRes"]');
  if (telRes) aplicarMascaraTelefone(telRes, 'residencial');
  // Aplica máscara nos campos de endereço
  document.querySelectorAll('input[name="cep"]').forEach(el => aplicarMascaraCEP(el));
  document.querySelectorAll('input[name="estado"]').forEach(el => aplicarMascaraUF(el));

  // Dispara evento input para garantir máscara dinâmica mesmo com valor inicial
  if (telCel) telCel.dispatchEvent(new Event('input', { bubbles: true }));
  if (telRes) telRes.dispatchEvent(new Event('input', { bubbles: true }));
});

// Preenche o formulário de perfil com os dados do usuário
function preencherPerfil(usuario) {
  ['nome','cpf','email','telefoneCel','telefoneRes'].forEach(campo => {
    const el = document.querySelector(`[name="${campo}"]`);
    if (el) {
      if (campo === 'telefoneCel' && usuario[campo]) {
        el.value = usuario[campo];
        if (typeof aplicarMascaraTelefone === 'function') el.value = aplicarMascaraTelefone_formatar(el.value, 'celular');
      } else if (campo === 'telefoneRes' && usuario[campo]) {
        el.value = usuario[campo];
        if (typeof aplicarMascaraTelefone === 'function') el.value = aplicarMascaraTelefone_formatar(el.value, 'residencial');
      } else if (campo === 'cpf' && usuario[campo]) {
        if (typeof aplicarMascaraCPF_formatar === 'function') {
          el.value = aplicarMascaraCPF_formatar(usuario[campo]);
        } else {
          el.value = usuario[campo];
        }
      } else {
        el.value = usuario[campo] || '';
      }
    }
  });

}

// Função utilitária para formatar telefone (usada no preenchimento inicial)
function aplicarMascaraTelefone_formatar(v, tipo) {
  v = (v || '').replace(/\D/g, '');
  if (tipo === 'celular') {
    v = v.slice(0, 11);
    if (v.length > 6) return `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    if (v.length > 2) return `(${v.slice(0,2)}) ${v.slice(2)}`;
    if (v.length > 0) return `(${v}`;
    return '';
  } else {
    v = v.slice(0, 10);
    if (v.length > 6) return `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
    if (v.length > 2) return `(${v.slice(0,2)}) ${v.slice(2)}`;
    if (v.length > 0) return `(${v}`;
    return '';
  }
}

// Função para formatar CPF (usada no preenchimento inicial)
function aplicarMascaraCPF_formatar(v) {
  v = (v || '').replace(/\D/g, '').slice(0,11);
  if (v.length > 6) return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9,11)}`;
  if (v.length > 3) return `${v.slice(0,3)}.${v.slice(3)}`;
  if (v.length > 0) return `(${v}`;
  return '';
}

// Auto formatação para campos de endereço
function aplicarMascaraCEP(input) {
  function formatar(v) {
    v = v.replace(/\D/g, '').slice(0,8);
    if (v.length > 5) return v.slice(0,5)+'-'+v.slice(5);
    return v;
  }
  function aplicar(e) {
    const pos = input.selectionStart;
    const antes = input.value;
    input.value = formatar(input.value);
    if (document.activeElement === input) {
      let diff = input.value.length - antes.length;
      input.setSelectionRange(pos + diff, pos + diff);
    }
  }
  input.addEventListener('input', aplicar);
  input.addEventListener('blur', aplicar);
  input.addEventListener('paste', function(e) { setTimeout(aplicar, 0); });
}
function aplicarMascaraUF(input) {
  input.addEventListener('input', function() {
    input.value = input.value.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0,2);
  });
}
function renderizarEnderecos(enderecos) {
  const lista = document.getElementById('enderecos-list');
  if (!lista) return;
  lista.innerHTML = '';
  enderecos.forEach((end, idx) => {
    const card = document.createElement('div');
    card.className = 'endereco-card';
    card.innerHTML = `
      <div class="endereco-resumo">
        <span>${end.rua}, ${end.numero}</span>
        <span>${end.bairro} - ${end.cidade}</span>
        <span class="expand-indicator">&#9654;</span>
      </div>
      <form class="endereco-form">
        <div class="form-group"><label>Rua:</label><input type="text" name="rua" value="${end.rua||''}" required></div>
        <div class="form-group"><label>Número:</label><input type="text" name="numero" value="${end.numero||''}" required maxlength="5"></div>
        <div class="form-group"><label>CEP:</label><input type="text" name="cep" value="${end.cep||''}" required></div>
        <div class="form-group"><label>Bairro:</label><input type="text" name="bairro" value="${end.bairro||''}" required maxlength="40"></div>
        <div class="form-group"><label>Cidade:</label><input type="text" name="cidade" value="${end.cidade||''}" required maxlength="40"></div>
        <div class="form-group"><label>Estado:</label><input type="text" name="estado" value="${end.estado||''}" required maxlength="2"></div>
        <div style="display:flex; gap:10px;">
          <button type="submit" class="salvar-endereco-btn">Salvar Endereço</button>
          <button type="button" class="remover-endereco-btn" style="background:#e53935;color:#fff;">Remover</button>
        </div>
      </form>
    `;
    lista.appendChild(card);
  });
}

function setupEventos(token) {
  // Expansão dos cards ao clicar em qualquer parte do card
  document.querySelectorAll('.endereco-card').forEach(card => {
    card.onclick = function(e) {
      // Evita conflito com botões ou formulários internos
      if (e.target.tagName === 'BUTTON' || e.target.closest('form')) return;
      document.querySelectorAll('.endereco-card.expanded').forEach(outro => {
        if (outro !== card) outro.classList.remove('expanded');
      });
      card.classList.toggle('expanded');
    };
  });
  // Botão novo endereço
  const addBtn = document.getElementById('adicionar-endereco-btn');
  const novoForm = document.getElementById('novo-endereco-form');
  if (addBtn && novoForm) {
    addBtn.onclick = e => {
      e.preventDefault();
      novoForm.style.display = novoForm.style.display === 'block' ? 'none' : 'block';
    };
    novoForm.onsubmit = async function(e) {
      e.preventDefault();
      if (!validateEnderecoForm(novoForm)) return;
      const data = Object.fromEntries(new FormData(novoForm));
      const resp = await fetch('/usuarios/me/endereco', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(data)
      });
      if (resp.ok) {
        alert('Endereço adicionado!');
        location.reload();
      } else {
        const result = await resp.json().catch(() => ({}));
        alert(result.error || result.message || 'Erro ao adicionar endereço.');
      }
    };
  }
  // Atualizar e remover endereço
  document.querySelectorAll('.endereco-form').forEach((form, idx) => {
    if (form.id === 'novo-endereco-form') return;
    // Atualizar
    form.querySelector('.salvar-endereco-btn').onclick = async function(e) {
      e.preventDefault();
      if (!validateEnderecoForm(form)) return;
      const data = Object.fromEntries(new FormData(form));
      const resp = await fetch(`/usuarios/me/endereco/${idx}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(data)
      });
      if (resp.ok) {
        const usuarioAtualizado = await fetch('/usuarios/me', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json());
        renderizarEnderecos(usuarioAtualizado.endereco || []);
        setupEventos(token);
        alert('Endereço atualizado!');
      } else {
        alert('Erro ao atualizar endereço.');
      }
    };
    // Remover
    form.querySelector('.remover-endereco-btn').onclick = async function(e) {
      e.preventDefault();
      if (!confirm('Tem certeza que deseja remover este endereço?')) return;
      const resp = await fetch(`/usuarios/me/endereco/${idx}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (resp.ok) {
        const usuarioAtualizado = await fetch('/usuarios/me', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json());
        renderizarEnderecos(usuarioAtualizado.endereco || []);
        setupEventos(token);
        alert('Endereço removido!');
      } else {
        alert('Erro ao remover endereço.');
      }
    };
  });
  // Atualizar perfil
  const perfilForm = document.getElementById('perfil-form');
  if (perfilForm) {
    perfilForm.onsubmit = async function(e) {
      e.preventDefault();
      if (!validateUserForm(perfilForm)) return;
      const data = {
        telefoneCel: perfilForm.telefoneCel.value,
        telefoneRes: perfilForm.telefoneRes.value
      };
      const resp = await fetch('/usuarios/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(data)
      });
      if (resp.ok) alert('Perfil atualizado!');
      else alert('Erro ao atualizar perfil.');
    };
  }
}
