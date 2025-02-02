import { Router } from "express";
import { cartService } from "../services/cart.service.js";

export const cartRouter = Router();

// -----------------
// POST /api/cart
// -----------------

cartRouter.post("/", async (req, res) => {
    try {
        const cart = await cartService.createCart();
        return res.status(201).json(cart);
    } catch (error) {
        return res.status(500).json({ message: `Error al crear el carrito: ${error.message}` });
    }
})

// -----------------
// GET /api/cart/:cid
// -----------------

cartRouter.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    
    try {    
        const cart = await cartService.getByCid({ cid });
    
        if (!cart) {
            return res.status(404).json({ message: "El carrito no existe" });
        }

        return res.status(200).json(cart);
    } catch (error) {
        return res.status(500).json({ message: `Error al obtener el carrito: ${error.message}` });
    }
})

// -----------------
// POST /api/cart/:cid/product/:pid
// -----------------

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartService.addProductCart({ cid, pid });
        return res.status(201).json({ message: "Producto agregado al carrito", cart });
    } catch (error) {
        return res.status(500).json({ message: `Error al agregar el producto: ${error.message}` });
    }
})