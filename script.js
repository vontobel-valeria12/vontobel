// Inicializa o carrinho
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Função para atualizar o número de itens no carrinho
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);
}

// Função para adicionar um produto ao carrinho
function addToCart(id, name, price) {
    const existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${name} Es wurde Ihrem Warenkorb hinzugefügt!`);
}

// Atualiza o contador de itens no carrinho
updateCartCount();
 
document.addEventListener("DOMContentLoaded", function () {
    const menu = document.querySelector(".seitenmenü");
    const botaoToggle = document.querySelector(".buttontoggle");

    botaoToggle.addEventListener("click", function () {
        menu.classList.toggle("ativo");
        botaoToggle.classList.toggle("ativo");
    });
});
