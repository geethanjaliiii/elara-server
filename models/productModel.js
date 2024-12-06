const mongoose = require("mongoose");
const { isWhitelisted } = require("validator");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredient: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  discount: {
    type: Number,
    required: true,
    min: [0, "Discount cannot be negative"],
    max: [90, "Discount cannot exceed 90%"],
  },
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', default: null },
  skinType: {
    type: String,
    enum: [
      "normal",
      "dry",
      "oily",
      "combination",
      "sensitive",
      "All skin types",
    ],
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  sizes: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true,min:1,max:8000 },
      stock: { type: Number, required: true,min:0,max:1000 },
    },
  ],
  images: [{ type: String, required: true }],
  totalStock: {
    type: Number,
    default: 0,
  },
  isFeatured:{
    type:Boolean,
    default:false
  },
  isListed: {
    type: Boolean,
    default: true
  },
  reviews:[
    {
      name:{
        type:String,
      },
      rating:{
        type:Number
      },
      comment:{
        type:String,
      },
      createdAt:{
        type:Date,
        default:Date.now,
      }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


productSchema.pre("save", function (next) {
  //sum up total stock for each size
  this.totalStock = this.sizes.reduce((sum, size) => sum + size.stock, 0);
  next();
});

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Product", productSchema);
