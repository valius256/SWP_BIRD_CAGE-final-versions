const express = require("express");
const OrderController = require("../controllers/OrderController");

const OrderRouter = express.Router();

// no parameter
OrderRouter.route("/").get(OrderController.getAllOrder);

OrderRouter.route("/pieChartData").get(OrderController.pieChartData);



OrderRouter.post("/addordertodb", OrderController.addOrderToDB);

OrderRouter.get("/list/:id", OrderController.getOrderItemByOrderID);

OrderRouter.get("/user/:id", OrderController.getOrderByUserId);

OrderRouter.get("/user2/:id", OrderController.getOrderByUserId2);

OrderRouter.get("/paidstatus/:id", OrderController.changeStatus_Paid);

OrderRouter.get("/loadUnseen/:id", OrderController.loadUnSeen);

OrderRouter.patch("/changeToSeen", OrderController.changeToSeen);

OrderRouter.get("/getCustomComponentImageByOrderID", OrderController.getCustomComponentImageByOrderID);

OrderRouter.post("/addCustomProduct", OrderController.addCustomProduct);

OrderRouter.get("/:id", OrderController.getOrderById);

module.exports = OrderRouter;

