import express from 'express';
import morgan from 'morgan';
import handlebars from 'express-handlebars';
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import Handlebars from "handlebars";
import { Server } from 'socket.io';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import { productsRouter } from './routes/products.routes.js';
import { cartRouter } from './routes/cart.routes.js';
import { viewsRoutes } from './routes/views.routes.js';
import { __dirname } from "./dirname.js";
import { productModel } from './models/product.model.js'; 

dotenv.config();
const app = express();
const PORT = 8000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configuración de Handlebars
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "main",
        handlebars: allowInsecurePrototypeAccess(Handlebars),
    })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Iniciar el servidor Express
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Configurar WebSockets
export const io = new Server(server, {
    cors: { origin: "*" } 
});

io.on("connection", async (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    try {
        const products = await productModel.find();
        socket.emit("init", products);
    } catch (error) {
        console.error("Error al obtener productos:", error.message);
    }
});

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conexión exitosa a MongoDB"))
    .catch((error) => console.log("Error al conectar a MongoDB:", error));

// Rutas
app.use("/", viewsRoutes);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);