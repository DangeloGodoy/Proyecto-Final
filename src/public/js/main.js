const socket = io(); 

const productList = document.getElementById("products");

socket.on("init", (products) => {
    products.forEach((product) => {
        const li = createProduct(product);
        productList.appendChild(li);
    });
});

socket.on("new-product", (product) => {
    const li = createProduct(product);
    productList.appendChild(li);
});

function createProduct(product) {
    const li = document.createElement("li");
    li.innerHTML = `
        <strong>${product.title}</strong>: ${product.price} 
    `;
    li.className = "list-group-item"

    return li
}