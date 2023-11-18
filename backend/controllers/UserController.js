const User = require("../models/User");

const getAllUser = async (req, res) => {
    try {
        const response = await User.getAllUser();
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const response = await User.getUserByEmail(req.params.email);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const newUser = async (req, res) => {
    try {
        const name = req.query.name;
        const email = req.query.email;
        const picture = req.query.picture;
        res.json({ message: "done" });
        await User.newUser(name, email, picture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateUser = async (req, res) => {
    try {
        const name = req.query.name;
        const email = req.query.email;
        const phone = req.query.phone;
        const dob = req.query.dob;
        const response = await User.updateUser(name, email, phone, dob);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getPointForUser = async (req, res) =>{
    try {
        const id = req.body.id;
        const point = req.body.point;

        const updatedUser = await User.getPointForUser(id, point);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const filterUser = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const dob = req.body.dob;
        const role = req.body.role;
        const status = req.body.status;
        const lower_point = req.body.lower_point;
        const upper_point = req.body.upper_point;
        const create = req.body.create;
        const page = req.body.page;
        const response = await User.filterUser(name, email, phone, dob, lower_point, upper_point, create, status, role, page);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addVoucher = async(req, res) => {
    try{
        const UserID = req.body.UserID;
        const discount = req.body.discount;

        const response = await User.addVoucher(UserID, discount);
        res.status(200).json({message: "success"});
    }catch (error) {
        res.status(500).json({message: error.message});
    }

}

const updateVoucher = async (req, res) => {
    try {
        const Id = req.body.Id;

        await User.updateVoucher(Id);
        res.status(200).json({ message: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


const getVoucherByUserID = async(req, res) => {
    try {
        const userID= req.params.UserID;

        const response = await User.getVoucherByUserID(userID);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const exchangePoint = async (req, res) => {
    try {
        const userID = req.body.UserID;
        const point = req.body.point;

        const response = await User.exchangePoint(userID, point);
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const replyFeedBack = async (req, res) => {
    try {
        const id = req.body.id;
        const ReplyContent = req.body.ReplyContent;
        const Replier = req.body.Replier;

        const response = await User.replyFeedBack(id, ReplyContent, Replier);
        res.status(200).json({message: "success"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }

}

const addNotifications = async (req, res) => {
    try {
        const content = req.body.content;
        const userId = req.body.userId;

        const response = await User.addNotifications(content, userId);
        res.status(200).json({message: "success"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const loadNotifications = async (req, res) => {
    try {
        const id = req.params.id;

        const response = await User.loadNotifications(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({message: error.message});
    }

}
module.exports = {
    getAllUser,
    getUserByEmail,
    newUser,
    updateUser,
    getPointForUser,
    filterUser,
    addVoucher,
    getVoucherByUserID,
    exchangePoint,
    replyFeedBack,
    addNotifications,
    loadNotifications,
    updateVoucher
};