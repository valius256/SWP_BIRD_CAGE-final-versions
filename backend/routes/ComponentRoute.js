const express = require("express");
const ComponentController = require("../controllers/ComponentController");

const ComponentRouter = express();

ComponentRouter.get("/getAllComponent", ComponentController.getAllComponent);
ComponentRouter.get("/getAllComponentByCate/:CateID", ComponentController.getComponentByCate)
ComponentRouter.post("/filterComponent", ComponentController.filterComponent)
ComponentRouter.post("/new", ComponentController.addNewComponent)
ComponentRouter.post("/update", ComponentController.updateComponent)
ComponentRouter.get("/cate/:id", ComponentController.getCateByComponent)
ComponentRouter.delete("/:id", ComponentController.deleteComponent);
ComponentRouter.get("/:id", ComponentController.getAComponent);


module.exports = ComponentRouter