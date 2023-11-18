const express = require("express");
const UserController = require("../controllers/UserController");

const userRouter = express.Router();
userRouter.get("/", UserController.getAllUser);
userRouter.post("/new", UserController.newUser);
userRouter.get("/update", UserController.updateUser);
userRouter.get("/:email", UserController.getUserByEmail);
userRouter.post("/replyFeedBack", UserController.replyFeedBack);
userRouter.post("/filter", UserController.filterUser);
userRouter.post("/updatePoint", UserController.getPointForUser);
userRouter.post("/addVoucher", UserController.addVoucher);
userRouter.get("/getVoucher/:UserID", UserController.getVoucherByUserID);
userRouter.post("/exchangePoint", UserController.exchangePoint);
userRouter.post("/replyFeedback", UserController.replyFeedBack);
userRouter.post("/addNotifications", UserController.addNotifications);
userRouter.post("/updateVoucher", UserController.updateVoucher);
userRouter.get("/loadNotifications/:id", UserController.loadNotifications);


module.exports = userRouter;