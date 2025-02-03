import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartSchema = new Schema({
    products: {
        type: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'product' },
                quantity: { type: Number },
                _id: false
            }
        ],
        default: []
    }
}, { versionKey: false });

cartSchema.plugin(mongoosePaginate);

export const cartModel = model("cart", cartSchema);