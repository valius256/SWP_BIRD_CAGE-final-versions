const express = require("express");
const ShipperController = require("../controllers/ShipperController");
const shipperRoutes = express.Router();

shipperRoutes.post("/change", ShipperController.changeShippingState);


module.exports = shipperRoutes;
