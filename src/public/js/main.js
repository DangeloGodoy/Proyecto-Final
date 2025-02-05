document.addEventListener("DOMContentLoaded", () => {
    const goToCartBtn = document.getElementById("go-to-cart");
    const emptyCartBtn = document.getElementById("empty-cart");

    if (goToCartBtn) {
        goToCartBtn.addEventListener("click", () => {
            const cartId = localStorage.getItem("cartId");

            if (!cartId) {
                Toastify({
                    text: "No tienes un carrito activo.",
                    className: "info",
                }).showToast();
                return;
            }

            window.location.href = `/cart/${cartId}`;
        });
    }


    if (emptyCartBtn) {
        emptyCartBtn.removeEventListener("click", emptyCartHandler);
        emptyCartBtn.addEventListener("click", emptyCartHandler);
    }

    document.querySelectorAll(".remove-from-cart").forEach(button => {
        button.removeEventListener("click", removeFromCartHandler);
        button.addEventListener("click", removeFromCartHandler);
    });

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.removeEventListener("click", addToCartHandler);
        button.addEventListener("click", addToCartHandler);
    });
});

async function emptyCartHandler() {
    const cartId = localStorage.getItem("cartId");

    if (!cartId) {
        Toastify({
            text: "No tienes un carrito activo.",
            className: "info",
        }).showToast();
        return;
    }

    try {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Error al vaciar el carrito");

        Toastify({
            text: "Carrito vaciado con éxito!",
            className: "info",
        }).showToast();
        updateCartUI();
    } catch (error) {
        Toastify({
            text: "No se pudo vaciar el carrito. Intenta de nuevo.",
            className: "info",
        }).showToast();
    }
}

async function removeFromCartHandler(event) {
    const productId = event.target.getAttribute("data-product-id");
    const cartId = localStorage.getItem("cartId");

    if (!cartId) {
        Toastify({
            text: "No tienes un carrito activo.",
            className: "info",
        }).showToast();
        return;
    }

    try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Error al eliminar el producto del carrito");

        Toastify({
            text: "Producto eliminado del carrito!",
            className: "info",
        }).showToast();
        updateCartUI();
    } catch (error) {
        Toastify({
            text: "No se pudo eliminar el producto. Intenta de nuevo.",
            className: "info",
        }).showToast();
    }
};

async function addToCartHandler(event) {
    const productId = event.target.getAttribute("data-product-id");
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
        try {
            const createCart = await fetch("/api/carts", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            if (!createCart.ok) throw new Error("Error al crear el carrito");

            const newCart = await createCart.json();
            cartId = newCart._id;
            localStorage.setItem("cartId", cartId);
        } catch (error) {
            console.error("Error al crear el carrito:", error.message);
            return;
        }
    }

    try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Error al agregar el producto al carrito");

        Toastify({
            text: "Producto agregado al carrito!",
            className: "info",
        }).showToast();
    } catch (error) {
        console.error("No se pudo agregar el producto:", error.message);
    }
}

function updateCartUI() {
    fetch(`/api/carts/${localStorage.getItem("cartId")}`)
        .then(response => response.json())
        .then(cart => {
            const cartContainer = document.getElementById("cart-items");
            if (!cartContainer) return;

            cartContainer.innerHTML = "";

            cart.products.forEach(item => {
                cartContainer.innerHTML += `
                            <div class="col-md-4 p-3">
                                <div class="card" style="width: 18rem;">
                                    <div class="card-body">
                                        <h5 class="card-title">${item.product.title}</h5>
                                        <p class="card-text">${item.product.description}</p>
                                        <p class="card-text"><strong>Precio:</strong> ${item.product.price}</p>
                                        <p class="card-text"><strong>Stock:</strong> ${item.product.stock} unidades</p>
                                        <p class="card-text"><strong>Categoría:</strong> ${item.product.category}</p>
                                        <p class="card-text"><strong>Cantidad en carrito:</strong> ${item.quantity}</p>

                                        <p class="btn btn-danger remove-from-cart" data-product-id="${item.product._id}">
                                            Eliminar del carrito
                                        </p>
                                    </div>
                                </div>
                            </div>
                `;
            });

            document.querySelectorAll(".remove-from-cart").forEach(button => {
                button.removeEventListener("click", removeFromCartHandler);
                button.addEventListener("click", removeFromCartHandler);
            });
        })
        .catch(error => console.error("Error al actualizar el carrito:", error));
}