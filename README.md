# SportZone Sweden

A football website and REST API project focused on match information, team details, league standings, and API test automation.

**Repository:** [PRASADSQA/sportzone-sweden](https://github.com/PRASADSQA/sportzone-sweden)

## Overview

SportZone Sweden is a Node.js and Express application that provides a web interface and REST API for football-related information. The project includes API endpoints for retrieving match data, managing matches, listing teams, and viewing league standings.

A Postman collection is included to validate API functionality through automated requests and response assertions.

## Features

- **Web application:** Static website served through Express.
- **REST API:** Endpoints for matches, teams, standings, and health checks.
- **Match management:** Create, retrieve, update, and delete matches.
- **API testing:** Postman collection organized into folders and test cases.
- **Automated assertions:** Validate HTTP status codes, response bodies, data fields, and API behavior.
- **Command-line test execution:** Run the Postman collection using Newman.
- **Version control:** Project source code and test assets maintained in GitHub.

## Technology Stack

| Technology | Purpose |
|---|---|
| JavaScript | Application and test scripting |
| Node.js | JavaScript runtime |
| Express.js | Web server and REST API |
| Postman | API testing and request management |
| Newman | Command-line API test execution |
| npm | Package management and scripts |
| Git and GitHub | Version control and source hosting |

## Project Structure

```text
sportzone-sweden/
├── public/                         # Website files
├── postman/                        # Postman collections
│   └── sportzone-collection.json   # API test collection
├── .github/
│   └── workflows/                  # CI workflows, if configured
├── server.js                       # Express server and API routes
├── package.json                    # Dependencies and npm scripts
├── package-lock.json               # Locked dependency versions
├── .gitignore                      # Excluded files
└── README.md                       # Project documentation
```

The exact filenames inside `postman/` may differ depending on the exported collection name.

## Getting Started

### Prerequisites

Install the following software before running the project:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/) for interactive API testing

### 1. Clone the repository

```bash
git clone https://github.com/PRASADSQA/sportzone-sweden.git
cd sportzone-sweden
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Start the application

```bash
npm start
```

The application runs locally on port `3000` by default.

- Website: http://localhost:3000
- API health check: http://localhost:3000/api/health
- All matches: http://localhost:3000/api/matches
- Teams: http://localhost:3000/api/teams
- League standings: http://localhost:3000/api/standings

Keep the server terminal open while running API tests.

## REST API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check API health |
| GET | `/api/matches` | Retrieve all matches |
| GET | `/api/matches/:id` | Retrieve a match by ID |
| POST | `/api/matches` | Create a match |
| PUT | `/api/matches/:id` | Update a match |
| DELETE | `/api/matches/:id` | Delete a match |
| GET | `/api/teams` | Retrieve all teams |
| GET | `/api/standings` | Retrieve league standings |

The API uses JSON for request and response bodies where applicable. Match creation and update requests are validated by the server.

## API Testing with Postman

The Postman collection is organized into folders to make test execution and maintenance easier.

The test suite covers:

- API health checks
- Retrieving all matches
- Retrieving a match by ID
- Handling missing matches
- Creating matches
- Updating existing matches
- Deleting matches
- Verifying deleted matches
- Retrieving teams
- Retrieving league standings

Tests use scripts and variables to support reusable requests and dynamically generated test data.

### Configure the environment

In Postman, select or create an environment named `SportZone Local`.

Set the following variable:

| Variable | Value |
|---|---|
| `baseUrl` | `http://localhost:3000` |

Import the exported collection from the `postman/` directory into Postman before executing the tests.

### Run the tests in Postman

1. Start the application using `npm start`.
2. Select the `SportZone Local` environment.
3. Open the imported SportZone Sweden collection.
4. Run the requests individually or use the Collection Runner.
5. Review the test results and investigate any failed assertions.

For tests that create, update, or delete data, execute requests in the appropriate order.

## Run API Tests from the Command Line

The project includes a Newman test script in `package.json`.

With the application running in one terminal, open a second terminal in the project directory and run:

```bash
npm run test:postman
```

If your npm script does not already supply the base URL, update it to pass the local API URL and ensure the collection filename matches the actual exported file:

```json
{
  "scripts": {
    "start": "node server.js",
    "test:postman": "newman run postman/sportzone-collection.json --env-var baseUrl=http://127.0.0.1:3000"
  }
}
```

Newman runs the collection and reports passed and failed assertions in the terminal.

## Notes

- The application currently stores match, team, and standings data in memory. Changes to match data may be lost when the server restarts.
- The standings currently use sample data and are not automatically recalculated when matches change.
- Use only local or otherwise authorized environments for testing destructive operations such as DELETE.

## Project Goals

This repository demonstrates practical experience with REST API development, structured API testing, reusable test scripts, test data management, and command-line test execution.

## Maintainer

**PRASADSQA**

GitHub: [https://github.com/PRASADSQA](https://github.com/PRASADSQA)

---

*This README will be maintained as the application and its testing capabilities evolve.*
