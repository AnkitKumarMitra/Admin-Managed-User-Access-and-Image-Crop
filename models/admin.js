import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;