import { Router } from 'express';
import mongoose from 'mongoose';
import { io } from '../server.js';

import { productModel } from '../models/product.model.js';

export const productsRouter = Router();

// -----------------
// GET /api/products
// -----------------

productsRouter.get("/", async (req, res) => {
    const { page = 1, limit = 10, category, status, sort } = req.query;

    try {
        let filter = {};

        if (category) filter.category = new RegExp(`^${category}$`, "i");
        if (status !== undefined) filter.status = status === "true";

        let sortQuery = {};
        if (sort) {
            if (sort === "asc") sortQuery = 1;
            else if (sort === "desc") sortQuery = -1;
        }
        
        const products = await productModel.paginate(
            filter,
            { 
                page: Number(page), 
                limit: Number(limit),
                sort: sortQuery
            }
        );

        res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: `Error al obtener los productos: ${error.message}` })
    }
});

// -----------------
// GET /api/product/:id
// -----------------

productsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Debe proporcionar un ID valido" });
        }

        const product = await productModel.findById(id)

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: `Error al obtener el producto: ${error.message}` });
    }
});

// -----------------
// POST /api/product
// -----------------

productsRouter.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: "Faltan campos por completar o son inválidos" });
    }

    try {
        const product = await productModel.create({
            title,
            description,
            code,
            price,
            status: status ?? true,
            stock,
            category,
            thumbnails: thumbnails ?? []
        })

        io.emit("new-product", { title, price })

        return res.status(201).json({ message: "Producto creado", product });
    } catch (error) {
        return res.status(500).json({ message: `Error al crear el producto: ${error.message}` });
    }
})

// -----------------
// PUT /api/product/:id
// -----------------

productsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Debe proporcionar un ID válido" });
    }

    if (!title && !description && !code && !price && !status && !stock && !category && !thumbnails) {
        return res.status(400).json({ message: "Debe proporcionar al menos un campo para actualizar" });
    }

    try {
        const product = await productModel.findByIdAndUpdate(
            id,
            { 
                $set: { title, description, code, price, status, stock, category, thumbnails } 
            },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        return res.status(200).json({ message: "Producto actualizado", product });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// -----------------
// DELETE /api/product/:id
// -----------------

productsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Debe proporcionar un ID válido" });
    }

    try {
        const product = await productModel.findByIdAndDelete(id);

        if (!product) {
            return res.status(400).json({ message: "Producto no encontrado" });
        }

        return res.status(200).json({ message: "Producto eliminado" });
    } catch (error) {
        return res.status(500).json({ message: `Error al eliminar el producto: ${error.message}` });
    }
});