# Test Adequacy Activity

## Introduction

We define a simple REST web server using Express and Typescript. The server connects to a MongoDB database and interacts with it thru an object data modeling library 
Mongoose. Unit tests are written in jest to verify the behavior of the REST endpoints. Stryker, a mutation testing tool, is used to measure test adequacy.


## Setup

Before proceeding, you will need to install the following:

- Node.js (vs20 or later). Download [here](https://nodejs.org/en/download)
- npm package manager. Comes bundled with Node.js

Verify that installation was successful by running the following commands from a terminal:

```bash
node --version
npm --version
```

Both commands should print a version number (e.g., v24.3.0)

Once you have setup the required software. Setup the dependencies for this project by running the following command. For all subsequent commands we will assume you are in the current directory.

```bash
npm install
```

If for some reason the above command fails then do the following:

- Delete `node_modules` directory if any
- Delete `package-lock.json` file
- Run the `npm install` command again

## Useful Project Commands

The following commands have been configured in `package.json`. You can run them from a terminal.

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the server using ts-node (no build step necessary) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled output (Build step necessary) |
| `npm test` | Run all Jest tests |
| `npm run test -- /path/to/test/file` | Run a specific test file |
| `npm run test:coverage` | Jest with coverage report |
| `npm run stryker` | Run Stryker mutation testing |

## Project Structure

```
src/
├── models/         # Mongoose Schemas
├── routes/         # REST endpoints
├── app.ts          # Express route definitions and middlewares
├── index.ts        # Server entry point (not tested directly)
└── __tests__/      # Jest tests
```

## Stryker Thresholds

The following table defines sample threshold values for mutation test 
scores. These vary depending on the project and what you deem as core
application logic that needs to be tested thorougly. Adjust them in `stryker.config.mjs` accordingly.

| Level | Score |
|---|---|
| High (green) | ≥ 80% |
| Low (yellow) | ≥ 60% |
| Break (fail CI) | < 50% |

Running the run stryker command will generate a report in `reports/mutation/mutation.html`.

# For You To Do

Do the activity in [activity.md](activity.md)

