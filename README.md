# Test Adequacy Activity

## Introduction

The learning outcomes of this activity are as follows:
- Understand the purpose of mocking in unit testing
- Learn how to measure test adequacy

To help achive the learning outcomes, we define a simple REST web server using Express and Typescript. The server connects to a MongoDB database and interacts with it thru an object data modeling library 
Mongoose. Unit tests are written in jest to verify the behavior of the REST endpoints. Stryker, a mutation testing tool, is used to measure test adequacy.


## Setup

Before proceeding you will need to install the following:

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

## For You To Do

A GET endpoint for "books/recent" has been defined in `routes/bookRouter.ts`. Read the comment for this endpoint and the function
to understand what this endpoint is doing. Next read the 
corresponding jest test in `__tests/bookRouter.recent.test.ts`. In the test note how the mongoose schema and the corresponding database queries
have been mocked. Think about why they were mocked. If the queries are 
mocked then what is the purpose of the test? Discuss this in your group.

The next step is to run the test using the following command:

`npm run test -- src/__tests__/bookRouter.recent.test.ts`

The test should pass. That is great! However, how do we know we have
written enough tests. This is where the stryker mutation tool is useful.
It will generate incorrect mutants automatically and if our tests
are good enough they will fail rightly fail against those mutants. So,
the next step is to run stryker on this test using the command:

`npm run stryker`

Running this command will generate a report in `reports/mutation/mutation.html`. Open the html file in a browser. Inspect the 
mutation report for the `bookRouter.ts` file. The report will show
you the following:

- Killed. The number of mutants killed by your tests. This is good. 
- Survived. The number of mutants that your tests were unable to kill. This means your existing tests are weak. Strengthen them.
- No Coverage. The number of mutants which were not executed by your tests. This implies have untested code. Write new tests or remove dead code.

Ideally your tests should kill all mutants. But this may not be possible due to some mutants being behaviorally equivalent. When you are unable to kill a mutant, think hard. Do you have code
that could be re-written or re-designed? Do you have redundant or dead code that could be removed? Or maybe the mutant is simply not possible given your input space. 

Work with your group to pick at least one survived mutant and one
no coverage mutant. Focus on the GET endpoint for "books/recent". Write tests to kill them.

