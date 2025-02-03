import { Router } from "express";
import mongoose from "mongoose";
import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";

export const cartRouter = Router();

// -----------------
// POST /api/cart
// -----------------

cartRouter.post("/", async (req, res) => {
    try {
        const cart = await cartModel.create(req.body);
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
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).json({ message: "Debe proporcionar un ID valido" });
        }

        const cart = await cartModel.findById(cid).populate("products.product");
    
        if (!cart) {
            return res.status(404).json({ message: "El carrito no existe" });
        }

        return res.status(200).json(cart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

// -----------------
// POST /api/cart/:cid/product/:pid
// -----------------

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ message: "El ID del carrito o producto es inválido" });
        }

        const cart = await cartModel.findById(cid);     
        if (!cart) {
            return res.status(404).json({ message: "El carrito no existe" });
        }

        const existingProduct = await productModel.findById(pid);
        if (!existingProduct) {
            return res.status(404).json({ message: "El producto no existe" });
        }

        cart.products = cart.products || [];

        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === pid);

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 })
        }

        await cart.save();

        return res.status(201).json({ message: "Producto agregado al carrito", cart });
    } catch (error) {
        return res.status(500).json({ message: `Error al agregar el producto: ${error.message}` });
    }
});

// -----------------
// PUT /api/cart/:cid/product/:pid
// -----------------

cartRouter.put("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ message: "El ID del carrito o producto es inválido" });
        }

        if (quantity === undefined || quantity <= 0) {
            return res.status(400).json({ message: "La cantidad debe ser mayor a 0" });
        }

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: "El carrito no existe" });
        }

        const existingProduct = await productModel.findById(pid);
        if (!existingProduct) {
            return res.status(404).json({ message: "El producto no existe" });
        }

        cart.products = cart.products || [];

        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === pid);

        if (existingProductIndex === -1) {
            return res.status(404).json({ message: "El producto no está en el carrito" });
        }

        cart.products[existingProductIndex].quantity = quantity;

        await cart.save();

        return res.status(200).json({ message: "Cantidad actualizada", cart });
    } catch (error) {
        return res.status(500).json({ message: `Error al actualizar la cantidad: ${error.message}` });
    }
});

// -----------------
// DELETE /api/cart/:cid/product/:pid
// -----------------

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ message: "El ID del carrito o del producto es inválido" });
        }

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: "El carrito no existe" });
        }

        cart.products = cart.products || [];

        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === pid);

        if (existingProductIndex === -1) {
            return res.status(404).json({ message: "El producto no está en el carrito" });
        }

        cart.products.splice(existingProductIndex, 1);

        await cart.save();

        return res.status(200).json({ message: "Producto eliminado correctamente", cart });
    } catch (error) {
        return res.status(500).json({ message: `Error al eliminar el producto: ${error.message}` });
    }
});

// -----------------
// DELETE /api/cart/:cid
// -----------------

cartRouter.delete("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).json({ message: "El ID del carrito es inválido" });
        }

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: "El carrito no existe" });
        }

        cart.products = [];

        await cart.save();

        return res.status(200).json({ message: "Se elimino la totalidad de productos", cart });
    } catch (error) {
        return res.status(500).json({ message: `Error al eliminar los productos del carrito: ${error.message}` });
    }
});