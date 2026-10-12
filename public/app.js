const matchesList = document.getElementById("matchesList");
const standingsBody = document.getElementById("standingsBody");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const teamSearch = document.getElementById("teamSearch");

let allMatches = [];

async function loadMatches() {
  try {
    const response = await fetch("/api/matches");

    if (!response.ok) {
      throw new Error(`Matches request failed: ${response.status}`);
    }

    allMatches = await response.json();

    renderMatches(allMatches);
    loadingMessage.hidden = true;
  } catch (error) {
    loadingMessage.hidden = true;
    errorMessage.textContent = "Unable to load matches. Please try again.";
    errorMessage.hidden = false;

    console.error(error);
  }
}

function renderMatches(matches) {
  matchesList.replaceChildren();

  if (matches.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No matches found.";
    matchesList.appendChild(message);
    return;
  }

  for (const match of matches) {
    const card = document.createElement("article");
    card.className = "match-card";

    const title = document.createElement("h3");
    title.textContent = `${match.homeTeam} vs ${match.awayTeam}`;

    const date = document.createElement("p");
    date.textContent = `Date: ${match.date}`;

    const score = document.createElement("p");
    score.className = "match-score";

    score.textContent =
      match.homeScore === null || match.awayScore === null
        ? "Not started"
        : `${match.homeScore} - ${match.awayScore}`;

    const status = document.createElement("p");
    status.className = "match-status";
    status.textContent = match.status;

    const details = document.createElement("a");
    details.href = `/api/matches/${match.id}`;
    details.textContent = `View match data (${match.id})`;

    card.append(title, date, score, status, details);
    matchesList.appendChild(card);
  }
}

async function loadStandings() {
  try {
    const response = await fetch("/api/standings");

    if (!response.ok) {
      throw new Error(`Standings request failed: ${response.status}`);
    }

    const standings = await response.json();

    standingsBody.replaceChildren();

    for (const team of standings) {
      const row = document.createElement("tr");

      for (const value of [
        team.position,
        team.team,
        team.played,
        team.points
      ]) {
        const cell = document.createElement("td");
        cell.textContent = String(value);
        row.appendChild(cell);
      }

      standingsBody.appendChild(row);
    }
  } catch (error) {
    console.error("Unable to load standings:", error);
  }
}

teamSearch.addEventListener("input", () => {
  const searchText = teamSearch.value.trim().toLowerCase();

  const filteredMatches = allMatches.filter((match) => {
    return (
      match.homeTeam.toLowerCase().includes(searchText) ||
      match.awayTeam.toLowerCase().includes(searchText)
    );
  });

  renderMatches(filteredMatches);
});

loadMatches();
loadStandings();