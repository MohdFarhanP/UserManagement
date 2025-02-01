import User from "../models/User.js";
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
};
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
export const createUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const user = await User.create({ userName, email, password });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
