const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Load data
let data = { events: [] };

if (fs.existsSync("data.json")) {
  data = JSON.parse(fs.readFileSync("data.json"));
}

// Save data
function saveData() {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

// Get all events
app.get("/events", (req, res) => {
  res.json(data.events);
});

// Create event (Admin)
app.post("/events", (req, res) => {
  const event = {
    id: Date.now(),
    ...req.body,
    participants: []
  };
  data.events.push(event);
  saveData();
  res.json(event);
});

// Register student
app.post("/register/:id", (req, res) => {
  const event = data.events.find(e => e.id == req.params.id);
  if (!event) return res.status(404).send("Event not found");

  event.participants.push(req.body.name);
  saveData();
  res.json(event);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
