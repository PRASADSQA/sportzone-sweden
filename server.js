const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ============================================
// INITIAL DATA
// ============================================

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

// Automatically generate the next match ID.
let nextMatchId =
    Math.max(0, ...matches.map(match => match.id)) + 1;

// ============================================
// COMMON VALIDATION
// ============================================

function validateMatchData(body) {
    const {
        homeTeam,
        awayTeam,
        date,
        status
    } = body;

    if (
        typeof homeTeam !== "string" ||
        !homeTeam.trim() ||
        typeof awayTeam !== "string" ||
        !awayTeam.trim()
    ) {
        return "Home team and away team must be non-empty strings";
    }

    if (homeTeam.trim() === awayTeam.trim()) {
        return "Home team and away team must be different";
    }

    if (
        typeof date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) ||
        new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date
    ) {
        return "Date must be a valid date in YYYY-MM-DD format";
    }

    if (!["scheduled", "finished"].includes(status)) {
        return "Status must be scheduled or finished";
    }

    return null;
}

function validateScores(body) {
    const { status, homeScore, awayScore } = body;

    if (status === "scheduled") {
        if (homeScore !== null || awayScore !== null) {
            return "Scheduled matches must have null scores";
        }

        return null;
    }

    if (
        !Number.isInteger(homeScore) ||
        homeScore < 0 ||
        !Number.isInteger(awayScore) ||
        awayScore < 0
    ) {
        return "Finished matches require non-negative integer scores";
    }

    return null;
}

function findMatchById(id) {
    return matches.find(match => match.id === id);
}

// ============================================
// HEALTH CHECK
// ============================================

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

// ============================================
// GET ALL MATCHES
// ============================================

app.get("/api/matches", (req, res) => {
    res.status(200).json(matches);
});

// ============================================
// GET MATCH BY ID
// ============================================

app.get("/api/matches/:id", (req, res) => {
    const matchId = Number(req.params.id);

    if (
        !/^\d+$/.test(req.params.id) ||
        !Number.isSafeInteger(matchId) ||
        matchId <= 0
    ) {
        return res.status(400).json({
            error: "Match ID must be a positive integer"
        });
    }

    const match = findMatchById(matchId);

    if (!match) {
        return res.status(404).json({
            error: "Match not found"
        });
    }

    return res.status(200).json(match);
});

// ============================================
// POST - CREATE A MATCH
// ============================================

app.post("/api/matches", (req, res) => {
    const validationError = validateMatchData(req.body);

    if (validationError) {
        return res.status(400).json({
            error: validationError
        });
    }

    const scoreError = validateScores(req.body);

    if (scoreError) {
        return res.status(400).json({
            error: scoreError
        });
    }

    const match = {
        id: nextMatchId++,
        homeTeam: req.body.homeTeam.trim(),
        awayTeam: req.body.awayTeam.trim(),
        homeScore: req.body.homeScore,
        awayScore: req.body.awayScore,
        date: req.body.date,
        status: req.body.status
    };

    matches.push(match);

    return res.status(201).json(match);
});

// ============================================
// PUT - UPDATE AN EXISTING MATCH
// ============================================

app.put("/api/matches/:id", (req, res) => {
    const matchId = Number(req.params.id);

    if (
        !/^\d+$/.test(req.params.id) ||
        !Number.isSafeInteger(matchId) ||
        matchId <= 0
    ) {
        return res.status(400).json({
            error: "Match ID must be a positive integer"
        });
    }

    const match = findMatchById(matchId);

    if (!match) {
        return res.status(404).json({
            error: "Match not found"
        });
    }

    const validationError = validateMatchData(req.body);

    if (validationError) {
        return res.status(400).json({
            error: validationError
        });
    }

    const scoreError = validateScores(req.body);

    if (scoreError) {
        return res.status(400).json({
            error: scoreError
        });
    }

    // Update the existing match while preserving its ID.
    match.homeTeam = req.body.homeTeam.trim();
    match.awayTeam = req.body.awayTeam.trim();
    match.homeScore = req.body.homeScore;
    match.awayScore = req.body.awayScore;
    match.date = req.body.date;
    match.status = req.body.status;

    return res.status(200).json(match);
});

// ============================================
// DELETE - REMOVE A MATCH
// ============================================

app.delete("/api/matches/:id", (req, res) => {
    const matchId = Number(req.params.id);

    if (
        !/^\d+$/.test(req.params.id) ||
        !Number.isSafeInteger(matchId) ||
        matchId <= 0
    ) {
        return res.status(400).json({
            error: "Match ID must be a positive integer"
        });
    }

    const matchIndex = matches.findIndex(
        match => match.id === matchId
    );

    if (matchIndex === -1) {
        return res.status(404).json({
            error: "Match not found"
        });
    }

    const [deletedMatch] = matches.splice(matchIndex, 1);

    return res.status(200).json({
        message: "Match deleted successfully",
        id: deletedMatch.id
    });
});

// ============================================
// GET ALL TEAMS
// ============================================

app.get("/api/teams", (req, res) => {
    res.status(200).json(teams);
});

// ============================================
// GET STANDINGS
// ============================================

app.get("/api/standings", (req, res) => {
    res.status(200).json(standings);
});

// ============================================
// INVALID API ENDPOINT
// ============================================

app.use("/api", (req, res) => {
    res.status(404).json({
        error: "API endpoint not found"
    });
});

// ============================================
// HANDLE INVALID JSON
// ============================================

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            error: "Invalid JSON request body"
        });
    }

    return next(err);
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(
        `SportZone Sweden is running at http://localhost:${PORT}`
    );
});