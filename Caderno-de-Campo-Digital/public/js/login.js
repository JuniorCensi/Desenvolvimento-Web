// JS para manipular o formulário de login
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.login-form');
  if (!form) return;

  // Captura submit do formulário
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const emailOuCpf = form.emailOuCpf.value;
    const senha = form.senha.value;
    try {
      const resp = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOuCpf, senha })
      });
      const data = await resp.json();
      if (resp.ok && data.token) {
        localStorage.setItem('token', data.token);
        // Salva o token como cookie para navegação protegida
        document.cookie = `Authorization=Bearer ${data.token}; path=/; SameSite=Strict`;
        window.location.href = '/';
      } else {
        exibirErro(data.message || data.error || 'Erro ao fazer login.');
      }
    } catch (err) {
      exibirErro('Erro de conexão.');
    }
  });

  // Função para exibir mensagens de erro
  function exibirErro(msg) {
    let erroDiv = document.querySelector('.login-error');
    if (!erroDiv) {
      erroDiv = document.createElement('div');
      erroDiv.className = 'login-error';
      form.parentNode.insertBefore(erroDiv, form);
    }
    erroDiv.textContent = msg;
  }
});
