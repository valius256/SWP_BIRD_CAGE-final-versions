const express = require("express");
const ProductController = require("../controllers/ProductController")

const productRouter = express.Router();
productRouter.get("/", ProductController.getAllProducts);
productRouter.get("/cate/:code", ProductController.getProductsByCategory);
productRouter.get("/img/:code", ProductController.getImgsOfProduct)

productRouter.get("/search/:name", ProductController.getProductByName)
productRouter.post("/add", ProductController.getNewProductToDB);
productRouter.post("/update", ProductController.updateProduct);
productRouter.get("/rating/:id", ProductController.getRatingByProductId);
productRouter.post("/rating", ProductController.addRating);
productRouter.post("/paging/category", ProductController.paging);
productRouter.post("/filter/", ProductController.filterProduct);
productRouter.post("/paging/search", ProductController.pagingSearchBar);

productRouter.get("/:id", ProductController.getProductById);
productRouter.delete("/:id", ProductController.deleteProduct);






module.exports = productRouter;