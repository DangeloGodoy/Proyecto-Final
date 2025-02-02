import { Router } from "express";

import { productModel } from "../models/product.model.js";

export const viewsRoutes = Router();

viewsRoutes.get("/", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const products = await productModel.paginate(
            {},
            { page: Number(page), limit: Number(limit) }
        );

        res.render("products", { products })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

viewsRoutes.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});