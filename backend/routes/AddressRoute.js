const express = require("express");
const AddressController = require("../controllers/AddressController");

const router = express.Router();
router.post("/new", AddressController.newAddress);
router.post("/edit", AddressController.updateAddress);
router.delete("/delete/:id", AddressController.deleteAddress);
router.get("/:code", AddressController.getAddressOfUser);

module.exports = router; 