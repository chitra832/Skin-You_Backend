const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect to MongoDB
mongoose.connect("mongodb+srv://skinyou:skinyou@cluster0.oniav8n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    query: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

// API endpoint to save appointment
app.post("/api/appointments", async (req, res) => {
    const { name, email, query, phone, message } = req.body;
    try {
        const newAppointment = new Appointment({ name, email, query, phone, message });
        await newAppointment.save();
        res.status(201).json({ message: "Appointment booked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving appointment", error });
    }
});

// Route to display appointments in a table
app.get("/appointments", async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.render("appointments", { appointments });
    } catch (error) {
        res.status(500).send("Error fetching appointments");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
