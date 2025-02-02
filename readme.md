# Primera Entrega - Backend I

Este es un proyecto básico de backend desarrollado con **Node.js** y **Express.js** como parte del curso **Programador Full Stack** en CoderHouse.

## 🚀 Características del Proyecto

- **Gestión de Productos**:
  - Crear, obtener, actualizar y eliminar productos.
  - Los productos se almacenan en un archivo JSON (`products.json`).

- **Gestión de Carritos**:
  - Crear un carrito con un array de productos.
  - Agregar productos al carrito, incluyendo la validación de su existencia en `products.json`.
  - Incrementar la cantidad de un producto si ya existe en el carrito.
  - Los carritos se almacenan en un archivo JSON (`carts.json`).

- **API RESTful**:
  - Rutas organizadas para productos y carritos.
  - JSON utilizado como formato de respuesta.

---

## 🛠️ Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/DangeloGodoy/Primera-Entrega.git
   cd Primera-Entrega
   ```

2. Instala las dependencias:
    ```bash
    npm install
    ```

3. Inicia el servidor:
    ```bash
    npm run dev
    ```

4. El servidor estará corriendo en http://localhost:8000

## 📂 Estructura de Carpetas

```plaintext
Primera Entrega/
├── src/
│   ├── db/
│   │   ├── products.json   # Archivo que almacena los productos
│   │   └── carts.json      # Archivo que almacena los carritos
│   ├── routes/
│   │   ├── products.routes.js   # Rutas para productos
│   │   └── cart.routes.js       # Rutas para carritos
│   ├── services/
│   │   ├── product.service.js   # Lógica de negocio para productos
│   │   └── cart.service.js      # Lógica de negocio para carritos
│   └── server.js                # Configuración principal del servidor
├── package.json
├── package-lock.json
└── README.md
```
## 🛣️ Rutas de la API

- **Productos**
    - **GET** /api/products
        - Obtiene todos los productos.

    - **GET** /api/products/:pid
        - Obtiene un producto por su ID.

    - **POST** /api/products
        - Crea un nuevo producto.
        - Requiere los siguientes campos:
            ```json
            {
                "title": "string",
                "description": "string",
                "price": "number",
                "stock": "number",
                "category": "string",
                "code": "string"
            }
            ```

    - **PUT** /api/products/:pid
        - Actualiza un producto por su ID.

    - **DELETE** /api/products/:pid
        - Elimina un producto por su ID.

- **Carritos**
    - **POST** /api/carts
	    - Crea un nuevo carrito vacío.
	- **GET** /api/carts/:cid
	    - Obtiene los detalles de un carrito por su ID.
	- **POST** /api/carts/:cid/product/:pid
	    - Agrega un producto al carrito.
	    - Si el producto ya existe, incrementa su cantidad.

## Versión 2.0

Se agregar el sistema de WebSocket para la actualización de productos disponibles en la tienda, además, se agregar un motor de plantillas mediante Handlebars para la generación de HTLM dinamico.

Se crean las siguientes paginas.
- http://localhost:8000/
    - Se utiliza para obtener los productos creados en la BD

- http://localhost:8000/realtimeproducts
    - Se utiliza para visualizar los nuevos productos creados