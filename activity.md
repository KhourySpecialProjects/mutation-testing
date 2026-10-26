# In-Class Activity: Measure Test Adequacy

## Goal

Find out whether your tests actually *catch bugs*, not just whether they *run the code*. You'll write unit tests, deliberately break the code, and see what your tests notice.

## Before you start

- Your team has picked a feature with little I/O and clear inputs and outputs (business logic, validation, a calculation).
- Your project builds on at least one laptop per pair.
- **Work on a throwaway branch.** Nothing from this activity's mutants should ever be merged.

```bash
git switch -c mutants/<your-name>
```

---

## Part 1: Set up a unit testing framework

*Skip this part if your project already has a working test setup.*

One person per team does the setup while others read the feature code.

| Stack      | Framework                  | Done when               |
|------------|----------------------------|-------------------------|
| TypeScript | Vitest or Jest             | A trivial test runs green |
| Java       | JUnit 5 (Maven or Gradle)  | A trivial test runs green |
| Python     | pytest                     | A trivial test runs green |

---

## Part 2: Write tests

Decide who is **Person A** and who is **Person B**.

**Person A:** Write unit tests for *your own* implementation of the chosen feature.

**Person B:** Read Person A's implementation, but **do not look at their tests**. Plan at least 3 mutants.

A good mutant follows three rules:

1. **One small change.** For example:
   - flip a comparison (`<` → `<=`, `==` → `!=`)
   - remove a negation (`!valid` → `valid`)
   - swap operands (`a - b` → `b - a`)
   - off-by-one in a loop bound or index
   - change a return value (`return total` → `return 0`)
   - delete a method or function call
2. **It must compile** (or pass the type checker).
3. **It must be plausible:** a bug a real person could write.

---

## Part 3: Run the mutants (20–32 min)

For each mutant, one at a time:

1. Person B applies the mutant.
2. Person A runs the full test suite.
3. Record the result in the table below.
4. Person B reverts the change before applying the next mutant.

| # | What changed (file, line, change) | Tests pass or fail? | Why? | Action needed |
|---|-----------------------------------|---------------------|------|---------------|
| 1 |                                   |                     |      |               |
| 2 |                                   |                     |      |               |
| 3 |                                   |                     |      |               |

**Vocabulary:** If at least one test fails, the mutant is **killed**. If all tests pass, the mutant **survived**.

---

## Part 4: Think, then fix

### If all tests passed (the mutant survived)

- Is that behavior *tested*, or only *executed*?
- Is an assertion too weak? (Checking "not null" instead of the actual value, or a count instead of the contents?)
- Is the mutant **equivalent**, meaning the program's behavior genuinely didn't change? If so, can you explain why?
- **Fix it:** Write a test that **fails on the mutant** and **passes on the original**. Check both directions.

### If tests failed (the mutant was killed)

- Which test failed? Was it the one you expected?
- Did it fail on an **assertion**, or on a **crash or exception**? Did the test catch the bug, or did the bug just blow something up?
- If many tests failed from one small change, what does that tell you about how your tests are structured?
- If a mutant didn't compile, the type checker "killed" it before any test ran. What does that tell you about where static types help, and where only tests can?

---

## Part 5: Set up a mutation testing tool

Install the tool for your stack and kick off a first run **scoped to the one file or class** you tested. Mutation testing is slow on a whole project.

| Stack      | Tool                                  | Scope it with                             | Link     |
|------------|---------------------------------------|-------------------------------------------|----------|
| TypeScript | StrykerJS + the runner plugin for your test framework | `--mutate src/<feature>.ts`               | https://stryker-mutator.io/docs/stryker-js/typescript-checker/ |
| Java       | PIT (Maven or Gradle plugin)          | `targetClasses`, `targetTests`            | https://pitest.org/quickstart/ |
| Python     | mutmut                                | `--paths-to-mutate <path>`                | https://mutmut.readthedocs.io/en/latest/#install-and-run |

**Follow-up:** Finish the run after class. Compare the tool's surviving mutants with the ones you made by hand. Did it find anything you missed?

---

## Questions to Ponder

1. Which of your mutants survived, and what test did you add to kill it?
2. Name one thing a coverage report would have told you that turned out to be misleading.
3. In one sentence: what does the mutation tool give you that hand-made mutants didn't?

---

## After class

- **Delete or abandon** the mutants branch. Do not merge it.
- **Keep the tests** that killed survivors. Move them to a regular branch and open a PR. They are real improvements to your test suite.
