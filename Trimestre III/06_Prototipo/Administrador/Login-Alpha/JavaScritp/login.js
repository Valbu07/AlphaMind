document.addEventListener('DOMContentLoaded', function() {
    var loginForm = document.getElementById('loginForm');
  
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault(); 
      window.location.href = '../Reportes-AlphaMind/Reportes.html';
    });
  });
  