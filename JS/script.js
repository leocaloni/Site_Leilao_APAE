const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnLogin-popup");
const iconClose = document.querySelector(".icon-close");


registerLink.addEventListener("click", () => {
  wrapper.classList.add("active");
});

loginLink.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

btnPopup.addEventListener("click", () => {
  wrapper.classList.add("active-popup");
});

iconClose.addEventListener("click", () => {
  wrapper.classList.remove("active-popup");
});


// script para digitar valor do lance

document.addEventListener("DOMContentLoaded", function () {
  const valorInput = document.getElementById("valor");

  if (!valorInput.value.trim() || valorInput.value === "R$") {
    valorInput.value = "R$ ";
  }

  valorInput.addEventListener("focus", function () {
    if (!valorInput.value.trim() || valorInput.value === "R$") {
      valorInput.value = "R$ ";
    }
  });

  valorInput.addEventListener("blur", function () {
    if (!valorInput.value.trim()) {
      valorInput.value = "R$ ";
    }
  });

  valorInput.addEventListener("input", function () {
    valorInput.value = valorInput.value.replace(/[^\d,\.]/g, "");

    if (!valorInput.value.includes("R$")) {
      valorInput.value = "R$ " + valorInput.value;
    }
  });
});

//manter o login

document.addEventListener("DOMContentLoaded", function () {
  const userGreeting = document.getElementById('user-greeting');
  const logoutButton = document.getElementById('logout-button');
  const btnLogin = document.querySelector('.btnLogin-popup');

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  console.log('Usuario logado:', usuarioLogado);

  if (usuarioLogado) {
      userGreeting.textContent = `Olá, ${usuarioLogado.nome}!`;
      userGreeting.classList.remove('d-none');
      logoutButton.classList.remove('d-none');
      btnLogin.style.display = 'none';
  }
});





