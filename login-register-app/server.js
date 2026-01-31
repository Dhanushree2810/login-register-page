const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");
require("dotenv").config();


const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static(path.join(__dirname, "public")));

// database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// register
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        email,
        password: hashedPassword
    });

    await user.save();
    res.send("User Registered Successfully");
});

// login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("Wrong password");

    res.send("Login successful");
});

// server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
