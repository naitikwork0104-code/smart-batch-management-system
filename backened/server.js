import dns from 'dns';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { authenticate } from './middleware/authmiddleware.js';
import Student from './models/Student.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/auth/login', (req, res) => {

    const { userId, passwd } = req.body;

    console.log("Received User ID:", userId);
    

    if (
        userId === process.env.ADMIN_USER_ID &&
        passwd === process.env.ADMIN_PASSWD
    ) {

        const token = jwt.sign(
            { userId: userId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({
            message: "Login successful",
            token: token
        });
    }

    return res.status(401).json({
        message: "Invalid user ID or password"
    });
});
app.get('/api/dashboard', authenticate, (req, res) => {

    res.json({
        message: "Welcome to dashboard",
        user: req.user
    });

});
app.post('/api/students', authenticate, async (req, res) => {

    try {

        const student = new Student(req.body);

        const savedStudent = await student.save();

        res.status(201).json({
            message: "Student created successfully",
            student: savedStudent
        });

    } catch (error) {

        res.status(400).json({
            message: "Failed to create student",
            error: error.message
        });

    }

});
app.get('/api/students', authenticate, async (req, res) => {

    try {

        const students = await Student.find();

        res.json({
            students: students
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch students",
            error: error.message
        });

    }

});
app.get('/api/students/:id', authenticate, async (req, res) => {

    try {

        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            student: student
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch student",
            error: error.message
        });

    }

});
app.put('/api/students/:id', authenticate, async (req, res) => {

    try {

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student updated successfully",
            student: student
        });

    } catch (error) {

        res.status(400).json({
            message: "Failed to update student",
            error: error.message
        });

    }

});
app.delete('/api/students/:id', authenticate, async (req, res) => {

    try {

        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete student",
            error: error.message
        });

    }

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});