// Função para buscar produtos e adicionar ao carrinho
function loadProducts() {
    fetch("https://api.mercadolibre.com/sites/MLB/search?q=notebooks&limit=13")
        .then(response => response.json())
        .then(data => {
            const productsContainer = document.querySelector("#products-container");
            productsContainer.innerHTML = ""; // Limpa o container antes de adicionar novos produtos
            data.results.forEach(product => {
                const col = document.createElement("div");
                col.classList.add("col-3"); // Adiciona classe 'col-3' para o layout do Bootstrap
                col.innerHTML = `
                    <div class="card mb-4">
                        <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">R$ ${product.price.toFixed(2)}</p>
                            <button class="btn btn-primary" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-thumbnail="${product.thumbnail}">Adicionar ao Carrinho</button>
                        </div>
                    </div>
                `;
                const btn = col.querySelector(".btn-primary");
                btn.addEventListener("click", () => {
                    addToCart({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        thumbnail: product.thumbnail
                    });
                });
                productsContainer.append(col);
            });
        })
        .catch(error => console.error('Erro ao buscar produtos:', error));
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Produto adicionado ao carrinho");
    window.location.href = "cart.html"; // Redireciona para a página do carrinho
}

function displayCartItems() {
    let total = 0;
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length > 0) {
        cart.forEach(product => {
            total += product.price;
            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}" style="width: 100px; height: auto;" />
                <h4>${product.title}</h4>
                <p>R$ ${product.price.toFixed(2)}</p>
                <button class="btn btn-danger" onclick="removeCart('${product.id}')">Remover</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        const totalPriceElement = document.createElement("h3");
        totalPriceElement.textContent = `Total: R$ ${total.toFixed(2)}`;
        cartItemsContainer.appendChild(totalPriceElement);

        const checkoutButton = document.createElement("button");
        checkoutButton.classList.add("btn", "btn-success");
        checkoutButton.textContent = "Avançar para pagamento";
        checkoutButton.onclick = redirectToPayment;
        cartItemsContainer.appendChild(checkoutButton);
    } else {
        cartItemsContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
    }
}

function checkout() {
    localStorage.setItem("clearCartAfterPayment", "true");
    window.location.href = "pagamentos.html";
}

function removeCart(id) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const newCart = cart.filter(product => product.id !== id);
    localStorage.setItem("cart", JSON.stringify(newCart));
    alert("Produto removido");
    displayCartItems();
}

function redirectToPayment() {
    window.location.href = "pagamentos.html";
}

function checkPaymentStatus() {
    if (localStorage.getItem("clearCartAfterPayment") === "true") {
        localStorage.removeItem("cart");
        localStorage.removeItem("clearCartAfterPayment");
        alert("Carrinho limpo após o pagamento");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.endsWith("index.html")) {
        loadProducts();
    }

    if (window.location.pathname.endsWith("cart.html")) {
        displayCartItems();
    }

    if (window.location.pathname.endsWith("pagamentos.html")) {
        checkPaymentStatus();
    }
});
