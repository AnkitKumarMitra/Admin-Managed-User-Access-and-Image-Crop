import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: "-",
    },
    imgSrc: {
        type: String,
        default: "uid_0000.png",
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model('User', userSchema);

export default User;
