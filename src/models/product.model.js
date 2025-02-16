import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },  
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], required: true }
});

productSchema.plugin(mongoosePaginate);
productSchema.index({ category: 1, status: 1 });


export const productModel = model("product", productSchema);