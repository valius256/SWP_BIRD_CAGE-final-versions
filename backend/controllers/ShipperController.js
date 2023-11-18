const Order = require("../models/Shipper");


const changeShippingState = async(req, res) => {
    try {
        const orderId = req.body.orderId;
        const status = req.body.status;
        await Order.changeShippingState(orderId, status);
        res.json({ message: "done" });
    }catch (e) {
        res.status(500).json({message: e.message})
    }
}

module.exports = {
    changeShippingState
}