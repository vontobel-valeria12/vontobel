
  document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".buttontoggle");
    const menu = document.querySelector(".seitenmenü");

    toggleButton.addEventListener("click", function () {
      menu.classList.toggle("ativo");
    });
  });

