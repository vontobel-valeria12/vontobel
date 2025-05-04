function toggleMenu() {
  const menu = document.querySelector('.seitenmenü');
  const button = document.querySelector('.buttontoggle');
  menu.classList.toggle('ativo');
  button.classList.toggle('ativo');
}

const mensagemDiv = document.getElementById("mensagem-visitante");

const texto = [
  "Hallo, Willkommen",
  "Ihr Besucherzähler ist " + Math.floor(1000 + Math.random() * 9000) + ".", 
  "Merken Sie sich diese Zahl, um Ihr Geschenk zu erhalten:"
];
let linha = 0;
let letra = 0;

function schreiben() {
  if (linha < texto.length) {
    if (letra < texto[linha].length) {
      mensagemDiv.innerHTML += texto[linha].charAt(letra);
      letra++;
      setTimeout(schreiben, 50);
    } else {
      mensagemDiv.innerHTML += "<br>";
      linha++;
      letra = 0;
      setTimeout(schreiben, 300);
    }
  } else {
    // Esconde a mensagem após 5 segundos
    setTimeout(function () {
      mensagemDiv.style.display = 'none';
    }, 5000);
  }
}

mensagemDiv.innerHTML = "";
setTimeout(schreiben, 1000);

function toggleMenu() {
  var menu = document.querySelector('.menu');
  menu.classList.toggle('menu-active'); // Alterna a classe 'menu-active' para mostrar/ocultar o menu
}