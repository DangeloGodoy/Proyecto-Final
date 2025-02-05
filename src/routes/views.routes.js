import { Router } from "express";

import { productModel } from "../models/product.model.js";
import { cartModel } from "../models/cart.model.js";

export const viewsRoutes = Router();

viewsRoutes.get("/", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const products = await productModel.paginate(
            {},
            { page: Number(page), limit: Number(limit) }
        );

        res.render("products", { products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

viewsRoutes.get("/cart/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const productCart = await cartModel.findById(id).populate("products.product").lean();

        if (!productCart) {
            return res.status(404).render("notFound", { message: "Carrito no encontrado" });
        }

        res.render("cart", { productCart });
    } catch (error) {
        res.status(500).render("error", { message: "Error al cargar el carrito: " + error.message });
    }
});

viewsRoutes.get("/product/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await productModel.findById(id).lean();

        if (!product) {
            return res.status(404).render("notFound", { message: "Producto no encontrado" });
        }

        res.render("product", { product });
    } catch (error) {
        res.status(500).render("error", { message: "Error al cargar el producto: " + error.message });
    }
});