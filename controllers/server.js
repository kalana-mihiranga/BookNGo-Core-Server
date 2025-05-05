const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let events = [
  { id: 1, name: "Music Festival", date: "2025-06-15", location: "New York", description: "A grand music festival." },
  { id: 2, name: "Food Carnival", date: "2025-07-20", location: "Los Angeles", description: "A carnival with great food!" },
];

// Fetch all events
app.get("/events", (req, res) => {
  res.json(events);
});

// Add new event
app.post("/events", (req, res) => {
  const newEvent = { id: events.length + 1, ...req.body };
  events.push(newEvent);
  res.json(newEvent);
});

// Update event
app.put("/events/:id", (req, res) => {
  const { id } = req.params;
  const index = events.findIndex((e) => e.id == id);
  if (index !== -1) {
    events[index] = { ...events[index], ...req.body };
    res.json(events[index]);
  } else {
    res.status(404).json({ message: "Event not found" });
  }
});

// Delete event
app.delete("/events/:id", (req, res) => {
  const { id } = req.params;
  events = events.filter((e) => e.id != id);
  res.json({ message: "Event deleted" });
});

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
