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

  // Adicionar "R$" inicialmente
  if (!valorInput.value.trim() || valorInput.value === "R$") {
    valorInput.value = "R$ ";
  }

  // Adicionar "R$" quando o campo estiver em foco
  valorInput.addEventListener("focus", function () {
    if (!valorInput.value.trim() || valorInput.value === "R$") {
      valorInput.value = "R$ ";
    }
  });

  // Adicionar "R$" quando o campo perder o foco, se estiver vazio
  valorInput.addEventListener("blur", function () {
    if (!valorInput.value.trim()) {
      valorInput.value = "R$ ";
    }
  });

  // Permitir apenas números, vírgula e ponto decimal
  valorInput.addEventListener("input", function () {
    valorInput.value = valorInput.value.replace(/[^\d,\.]/g, "");

    // Adicionar "R$" durante a digitação se necessário
    if (!valorInput.value.includes("R$")) {
      valorInput.value = "R$ " + valorInput.value;
    }
  });
});




