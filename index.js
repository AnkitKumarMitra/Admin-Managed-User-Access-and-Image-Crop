import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import Admin from './models/admin.js';
import User from './models/user.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
const dbURI = process.env.DB_URI;

mongoose.set('strictQuery', false);
app.use(bodyParser.urlencoded({ extended: true }));

const connectToDatabase = async () => {
    try {
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB database');
    } catch (error) {
        console.error(error);
    }
};

app.set('view engine', 'ejs');

app.use(express.static("public"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/profiles');
    },
    filename: (req, file, cb) => {
        const userId = req.body.id || 'unknownUser';
        const fileName = `uid_${userId}${path.extname(file.originalname)}`;
        cb(null, fileName);
    },
});

// Initialize multer with storage configuration
const upload = multer({ storage });

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/user-login", (req, res) => {
    res.render("user-login.ejs");
});

app.post("/adminlogin", async (req, res) => {
    try {
        console.log(req.body)
        const { userId, password } = req.body;
        if (!userId || !password) {
            return res.status(400).send("User ID and password are required");
        }
        const admin = await Admin.findOne({ userId, password });
        if (admin) {
            res.render("user-management.ejs");
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/registerUser", async (req, res) => {
    try {
        const { createUserId, createPassword } = req.body;

        if (!createUserId || !createPassword) {
            return res.status(400).send("User ID and password are required");
        }

        const user = new User({ userId: createUserId, password: createPassword });

        const result = await user.save();

        res.render("user-login.ejs");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/userlogin", async (req, res) => {
    try {
        console.log(req.body);
        const { userId, password } = req.body;

        if (!userId || !password) {
            return res.status(400).send("User ID and password are required");
        }

        const user = await User.findOne({ userId, password });

        if (!user) {
            return res.status(401).send("Invalid user ID or password");
        }

        const status = user.imgSrc !== 'uid_0000.png';

        res.render("upload-photo.ejs", { id: req.body.userId, status, user: user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/upload", upload.single('photo'), async (req, res) => {
    console.log(req.body);
    try {
        const userId = req.body.id;
        const userName = req.body.name;
        const photoFileName = `uid_${userId}${path.extname(req.file.originalname)}`;

        await User.findOneAndUpdate({ userId }, { name: userName, imgSrc: photoFileName });

        const user = await User.findOne({ userId });
        const status = user.imgSrc !== 'uid_0000.png';

        res.render("upload-photo.ejs", { status, user: user, id: userId });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/admin-dashboard", async (req, res) => {
    try {
        const user1 = req.body.user1;
        const user2 = req.body.user2;

        if (!user1 || !user2) {
            return res.status(400).send("Both user IDs are required");
        }

        const userDetails1 = await User.findOne({ userId: user1 });
        const userDetails2 = await User.findOne({ userId: user2 });

        res.render("admin-panel.ejs", { userDetails1, userDetails2 });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/approveUser/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        await User.findOneAndUpdate({ userId }, { isApproved: true });
        res.json({ success: true, message: 'User approved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.delete('/deleteUser/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        await User.deleteOne({ userId });

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


/* app.get("/add-Admin", (req, res) => {
    const admin = new Admin({
        userId: '0002',
        password: 123456
    });
    admin.save()
    .then((result)=>{
        res.send(result);
    })
    .catch((err) => {
        console.error(err);
    });
}); */

app.post("/adminlogin", (req, res) => {

});

connectToDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Server Running at port: ${port}`);
    });
});