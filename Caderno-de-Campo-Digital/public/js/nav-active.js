// Marca o botão ativo do menu de navegação conforme o endereço da URL (classe 'active')
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-bar .nav-item');
    const path = window.location.pathname;
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (
        (link.getAttribute('href') === '/' && path === '/') ||
        (link.getAttribute('href') !== '/' && path.startsWith(link.getAttribute('href')))
      ) {
        link.classList.add('active');
      }
    });
  });
})();
