const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const matches = [
  {
    id: 101,
    homeTeam: "Stockholm FC",
    awayTeam: "Malmo United",
    homeScore: 2,
    awayScore: 1,
    date: "2026-10-12",
    status: "finished"
  },
  {
    id: 102,
    homeTeam: "Gothenburg Stars",
    awayTeam: "Uppsala Athletic",
    homeScore: null,
    awayScore: null,
    date: "2026-10-14",
    status: "scheduled"
  },
  {
    id: 103,
    homeTeam: "Malmo United",
    awayTeam: "Gothenburg Stars",
    homeScore: 1,
    awayScore: 1,
    date: "2026-10-16",
    status: "finished"
  }
];

const teams = [
  { id: 1, name: "Stockholm FC" },
  { id: 2, name: "Malmo United" },
  { id: 3, name: "Gothenburg Stars" },
  { id: 4, name: "Uppsala Athletic" }
];

const standings = [
  { position: 1, team: "Stockholm FC", played: 10, points: 25 },
  { position: 2, team: "Malmo United", played: 10, points: 22 },
  { position: 3, team: "Gothenburg Stars", played: 10, points: 18 },
  { position: 4, team: "Uppsala Athletic", played: 10, points: 12 }
];

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/matches", (req, res) => {
  res.json(matches);
});

app.get("/api/matches/:id", (req, res) => {
  const matchId = Number(req.params.id);

  if (!Number.isInteger(matchId)) {
    return res.status(400).json({
      error: "Match ID must be an integer"
    });
  }

  const match = matches.find((item) => item.id === matchId);

  if (!match) {
    return res.status(404).json({
      error: "Match not found"
    });
  }

  res.json(match);
});

app.get("/api/teams", (req, res) => {
  res.json(teams);
});

app.get("/api/standings", (req, res) => {
  res.json(standings);
});

app.use("/api", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found"
  });
});

app.listen(PORT, () => {
  console.log(`SportZone Sweden is running at http://localhost:${PORT}`);
});