# Natours - Agile Lab Project Documentation

## Sprint 0: Planning

### Personal Context & Starting Point

**Date Started:** December 03, 2026
**Expected Completion:** February 18, 2026

**My Background with This Project:**

- I've worked with the Natours project before in a tutorial, so I'm familiar with the codebase structure
- My weakest area is testing - I understand the concept but struggle with writing good tests
- I've used Git before but never properly set up GitHub Actions
- I want to use this project to finally understand CI/CD properly

**What I Want to Learn:**

1. How to write tests that actually catch bugs (not just dummy tests)
2. How to set up automated pipelines without following a tutorial step-by-step
3. How to structure a project so it's actually maintainable
4. What "monitoring" really means for a small project

---

### 1. Product Vision

**Natours** is a tour booking platform that enables adventure travelers to discover, explore, and book exciting nature tours. For this lab, I'm focusing on the **backend API** with:

- Tour management (CRUD operations)
- User authentication
- Booking functionality
- Stripe payment
- Map integration
- Real DevOps practices applied throughout

_Note: I'm intentionally keeping scope small so I can focus on Agile/DevOps practices rather than building features._

---

### 2. Initial Product Backlog

#### Priority Legend

**High** - Must have for core functionality
**Medium** - Important but can wait
**Low** - Nice to have

---

#### User Story #1: Automated Testing Suite

**Priority: High | Story Points: 5**

**As a** developer
**I want** automated tests to run on every code push
**So that** I can catch bugs early and ensure code quality

**Acceptance Criteria:**

- Unit tests are written for at least 3 critical functions
- Tests run automatically in CI/CD pipeline
- Test coverage report is generated
- Pipeline fails if tests fail

**My Implementation Notes:**

- Need to learn Jest syntax properly
- Plan to test: tour model validation, API response format, error handling
- Concern: How to test database interactions without affecting real data?
- Research needed: MongoDB memory server vs mocking

**Questions I Have:**

- Should I aim for 100% coverage or just critical paths?
- How do I test file uploads?

---

#### User Story #2: CI/CD Pipeline Setup

**Priority: High | Story Points: 8**

**As a** developer
**I want** an automated CI/CD pipeline
**So that** code is automatically tested and deployment-ready

**Acceptance Criteria:**

- GitHub Actions workflow file is configured
- Pipeline runs on push to main branch
- Linting checks are included
- Build process completes successfully
- Pipeline status is visible in repository

**My Implementation Plan:**

```
Week 1 Goals:
- Day 1-2: Research GitHub Actions syntax
- Day 3: Create basic workflow file
- Day 4: Test with simple "hello world" commit
- Day 5: Add linting and build steps
- Weekend: Debug any issues
```

**Resources Bookmarked:**

- GitHub Actions documentation
- "CI/CD for Node.js" tutorial I found
- Stack Overflow threads about MongoDB in CI

**Potential Problems I Foresee:**

- YAML syntax errors (always happens)
- Environment variables not working in CI
- Tests passing locally but failing in CI

---

#### User Story #3: Health Monitoring Endpoint

**Priority: Medium | Story Points: 3**

**As a** DevOps engineer
**I want** a health check endpoint
**So that** I can monitor if the application is running correctly

**Acceptance Criteria:**

- GET /api/v1/health returns server status
- Response includes timestamp and status code 200
- Endpoint is accessible without authentication
- Response includes basic system info

**Why This Matters to Me:**

- First time implementing monitoring
- Will help me understand what "observability" means
- Simple win to build confidence

**Implementation Sketch:**

```javascript
// Pseudo-code I'll work from
health endpoint {
  status: 'ok',
  timestamp: new Date(),
  uptime: process.uptime(),
  environment: process.env.NODE_ENV
}
```

---

#### User Story #4: Error Logging & Monitoring

**Priority: Medium | Story Points: 5**

**As a** developer
**I want** comprehensive error logging
**So that** I can track and debug issues in production

**Acceptance Criteria:**

- All errors logged with timestamp and stack trace
- Logs include request context
- Different log levels implemented
- Logs written to files in production

**Research Needed:**

- Compare Winston vs Morgan vs Pino
- Log rotation? (maybe overkill for this project)
- Should I log to console or files?

**Decision to Make Later:**
Start with simple console.log for Sprint 1, implement proper logging in Sprint 2 based on what I learn.

---

#### User Story #5: Tour API Documentation

**Priority: Low | Story Points: 3**

**As a** API consumer
**I want** clear API documentation
**So that** I can understand how to interact with the endpoints

**Acceptance Criteria:**

- README.md includes API documentation
- Each endpoint has description, method, sample response
- Authentication requirements stated
- Example curl commands provided

**Personal Note:**
I always skip documentation in my projects, but I know it's important. Making this a formal user story so I don't forget.

---

#### User Story #6: Input Validation Tests

**Priority: Medium | Story Points: 5**

**As a** developer
**I want** comprehensive input validation tests
**So that** the API rejects invalid data correctly

**Acceptance Criteria:**

- Tests verify required fields validation
- Tests verify data type validation
- Tests verify malformed requests return appropriate errors
- Tests cover at least 2 controllers

**Dependency:** Depends on User Story #1 (testing suite)

---

#### User Story #7: Environment Configuration Documentation

**Priority: Medium | Story Points: 2**

**As a** new developer
**I want** clear setup documentation
**So that** I can run the project locally without confusion

**Acceptance Criteria:**

- README.md has prerequisites section
- Environment variables documented with examples
- Step-by-step setup instructions
- Common troubleshooting tips

**Personal Note:**
I've wasted hours on projects with bad docs. Making sure mine is good.

---

#### User Story #8: Database Integration Tests

**Priority: Medium | Story Points: 5**

**As a** developer
**I want** tests that verify database operations
**So that** I know my data layer is working correctly

**Acceptance Criteria:**

- Tests for creating tours in database
- Tests for querying tours
- Tests for updating and deleting
- Database cleans up after tests

**Technical Spike Needed:**
Research MongoDB memory server vs test containers vs mocking. Currently leaning toward mongodb-memory-server.

---

### 3. Definition of Done (My Personal Version)

A user story is "Done" when **I** am confident it meets these criteria:

#### The "Does It Actually Work?" Check

- [ ] I've tested it manually at least 3 times with different inputs
- [ ] It works on my machine (obviously) but I've also tested edge cases
- [ ] No crashes or unhandled errors

#### The "Future Me" Check

- [ ] Code is commented where it's not obvious
- [ ] Variable/function names make sense (I won't curse myself later)
- [ ] I could explain this code to someone in 2 minutes

#### The "Professional" Check

- [ ] Tests pass (npm test runs clean)
- [ ] No console.logs left (unless it's the logging feature)
- [ ] Git commit message explains WHY, not just WHAT
- [ ] CI pipeline actually ran and passed on GitHub

#### The "Lab Requirements" Check

- [ ] All acceptance criteria from user story are met
- [ ] Documentation updated if needed
- [ ] No known bugs (or if there are, they're documented)

**Personal Note:** The "professional" check is hardest for me. I tend to commit with messages like "fixed stuff" or "update". Need to be better about this.

---

### 4. Technical Stack Decisions

```
Backend: Node.js + Express (familiar)
Database: MongoDB + Mongoose (familiar)
Testing: Jest + Supertest (learning)
CI/CD: GitHub Actions (new)
Logging: Winston (leaning toward this) but Morgan (I'm familiar)
Environment: Node v24+ (whatever my laptop has)
```

**Why These Choices:**

- Node/Express/MongoDB: I've used them before, so I can focus on DevOps practices
- GitHub Actions: Built into GitHub, no extra setup
- Jest: Most popular, good community support

---

### 5. Sprint 1 Planning

#### Sprint Goal

**"Establish DevOps foundation with working CI/CD pipeline and automated tests"**

#### Why This Goal?

Sprint 1 requirements specifically ask for CI/CD and testing. This sets up everything else.

#### Sprint 1 Backlog

| Story     | Description                | Points | Dependencies | My Confidence |
| --------- | -------------------------- | ------ | ------------ | ------------- |
| #2        | CI/CD Pipeline Setup       | 8      | None         | Medium        |
| #1        | Automated Testing Suite    | 5      | None         | Low           |
| #3        | Health Monitoring Endpoint | 3      | None         | High          |
| **Total** |                            | **16** |              |               |

#### Sprint 1 Task Breakdown

**Story #2: CI/CD Pipeline Setup (8 points)**

- [ ] Task 2.1: Create `.github/workflows` directory
- [ ] Task 2.2: Create `ci.yml` workflow file (copy template from docs)
- [ ] Task 2.3: Add Node.js setup step
- [ ] Task 2.4: Add dependency installation step
- [ ] Task 2.5: Add linting step (ESLint)
- [ ] Task 2.6: Add test step (even if tests don't exist yet)
- [ ] Task 2.7: Test with dummy commit
- [ ] Task 2.8: Debug any failures (there will be some)
- [ ] Task 2.9: Add status badge to README.md

**Story #1: Automated Testing Suite (5 points)**

- [ ] Task 1.1: Install Jest and Supertest
- [ ] Task 1.2: Configure Jest (package.json or jest.config.js)
- [ ] Task 1.3: Write first test (simple math function to verify setup)
- [ ] Task 1.4: Write test for tour model validation
- [ ] Task 1.5: Write test for GET /api/v1/tours endpoint
- [ ] Task 1.6: Run tests locally and debug
- [ ] Task 1.7: Verify tests run in CI

**Story #3: Health Monitoring Endpoint (3 points)**

- [ ] Task 3.1: Create routes/health.js
- [ ] Task 3.2: Implement GET /health endpoint
- [ ] Task 3.3: Add timestamp and status
- [ ] Task 3.4: Add basic system info (Node version, uptime)
- [ ] Task 3.5: Test manually with curl/Postman
- [ ] Task 3.6: Write a simple test for health endpoint

#### Sprint 1 Risks & Mitigation

| Risk                                    | Likelihood | Impact | Mitigation                                         |
| --------------------------------------- | ---------- | ------ | -------------------------------------------------- |
| Tests failing in CI but passing locally | High       | High   | Research CI environment differences early          |
| GitHub Actions syntax errors            | High       | Medium | Start with minimal workflow, add steps gradually   |
| Running out of time                     | Medium     | High   | Focus on core stories, defer non-critical tasks    |
| MongoDB connection issues in CI         | Medium     | High   | Research in-memory MongoDB options before Sprint 1 |

#### My Sprint 1 Commitments

- I will commit code at least once per coding session (no end-of-sprint dump)
- I will write meaningful commit messages
- I will update this document as I learn
- If I get stuck for >1 hour, I'll document the problem and try something else

---

### 6. Sprint 1 Review Preparation

**Success Looks Like:**

- Green checkmark on GitHub Actions for main branch
- At least 3 passing tests
- Health endpoint returns 200 with timestamp
- I can explain what each part does

**Failure Looks Like:**

- Pipeline not working
- No tests written
- Last-minute rush commit

---

### 7. Initial Thoughts for Sprint 2

I don't know exactly what I'll do in Sprint 2 yet - it depends on how Sprint 1 goes.

**Potential Directions:**

- If CI/CD was easy → Focus on logging and monitoring (Story #4)
- If testing went well → Add more tests (Story #6, #8)
- If I struggled → Simplify and focus on documentation (Story #5, #7)
- Need to show "improvement" from feedback, so I'll keep notes during Sprint 1

**Questions for My Future Self:**

- What was harder than expected?
- What would you do differently?
- What feedback would you give yourself?

---

### 8. Daily Log (To Be Updated During Sprint 1)

```
Sprint 1 Day 1 - [Date]:
- Started reading GitHub Actions docs
- Created project structure
- Initial commit with Express setup

Sprint 1 Day 2 - [Date]:
-

Sprint 1 Day 3 - [Date]:
-
```

---

### 9. Questions for My Instructor/Tutor

1. For monitoring/logging in Sprint 2, is simple file logging enough or should I look into external services?
2. How much test coverage is considered "good enough" for this lab?
3. Should I prioritize more tests or better documentation if I'm short on time?

---

## Self-Assessment Against Rubric (Pre-Sprint 0)

| Dimension           | Target                                             | My Current Status                     |
| ------------------- | -------------------------------------------------- | ------------------------------------- |
| Agile Practice      | Clear backlog, prioritization, acceptance criteria | Have all of these with personal notes |
| DevOps Practice     | CI/CD, tests, monitoring/logging                   | Planned but not implemented           |
| Delivery Discipline | No big-bang commits                                | Will track commits carefully          |
| Prototype Quality   | Working solution meets criteria                    | Not started                           |
| Reflection          | Meaningful improvement between sprints             | Will document lessons learned         |

**Areas I Need to Focus On:**

1. Actually sticking to my commit discipline
2. Not underestimating testing complexity
3. Documenting my thought process as I go
