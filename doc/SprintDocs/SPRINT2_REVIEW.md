# Sprint 2 Review

**Date:** February 17, 2026  
**Sprint Goal:** Improve code quality with logging, additional tests, and complete documentation  
**Status:** Successfully Completed

---

## Stories Completed

### User Story #7: Environment Configuration Documentation (2 points)

**Status:** DONE

**What was delivered:**

- Comprehensive `.env.example` file with all environment variables
- Completely rewritten README.md with professional documentation
- Setup instructions for MongoDB Atlas, MailTrap, SendGrid, and Stripe
- Troubleshooting guide with common issues and solutions
- API endpoint documentation
- Project structure overview
- Testing guide

**Files Changed:**

- `.env.example` (new) - 39 lines
- `README.md` - Expanded from 10 lines to 425 lines

**Evidence - Environment Variables Documented:**

```bash
# All 18 environment variables documented:
NODE_ENV, PORT, DATABASE, DATABASE_PASSWORD
JWT_SECRET, JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN
EMAIL_FROM, MAILTRAP_*, SENDGRID_*
STRIPE_SECRET_KEY, WEBHOOK_SECRET
LOCAL_HOST_CLIENT
```

**README.md Sections:**

- Quick Start (5 steps from clone to running)
- Prerequisites with version requirements
- Installation instructions
- Environment variables table
- API key setup guides
- Testing instructions
- Project structure
- All 18 API endpoints documented
- Troubleshooting (6 common issues)
- Security notes

**Commit:** `1fd176a - docs: complete environment configuration documentation`

---

### User Story #4: Error Logging & Monitoring (5 points)

**Status:** DONE

**What was delivered:**

- Winston logging library integrated
- Structured logging with 5 log levels (error, warn, info, http, debug)
- Request logging middleware
- File logging for production (error.log + all.log)
- Log rotation (5MB max, 5 files)
- Replaced all `console.log` with structured logging
- Contextual metadata in all logs

**Files Changed:**

- `utils/logger.js` (new) - Winston configuration
- `utils/requestLogger.js` (new) - HTTP request logging middleware
- `server.js` - Replaced console logs with structured logging
- `app.js` - Integrated request logger middleware
- `controllers/errorController.js` - Structured error logging

**Logger Configuration:**

```javascript
Levels: error (0), warn (1), info (2), http (3), debug (4)
Console: Colored output with timestamps
Files: JSON format for parsing (production only)
Rotation: 5MB per file, 5 files max
```

**Logging Coverage:**

- Database connection events
- Server startup/shutdown
- All HTTP requests (method, URL, status, duration, IP)
- All errors with stack traces
- Uncaught exceptions
- Unhandled promise rejections
- SIGTERM signals

**Example Log Output:**

```
2026-02-17 15:30:42 [info]: DB connection successful!
2026-02-17 15:30:42 [info]: App running on port 3000 in development mode
2026-02-17 15:31:15 [http]: GET /api/v1/health 200 - 12ms - ::1
2026-02-17 15:32:03 [error]: API ERROR (PROD): Invalid tour ID
```

**Commit:** `85100b8 - feat: implement Winston logging and monitoring`

**Tests Still Passing:** 44/44 (logging doesn't break any functionality)

---

### User Story #6: Input Validation Tests (5 points)

**Status:** DONE

**What was delivered:**

- 26 new validation tests for Tour model
- Comprehensive coverage of all validation rules
- Tests for required fields, data types, ranges, enums, custom validators
- All tests passing

**Files Changed:**

- `__tests__/tourModel.test.js` (new) - 261 lines

**Test Breakdown:**

| Category                  | Tests  | Description                                 |
| ------------------------- | ------ | ------------------------------------------- |
| Required field validation | 6      | name, maxGroupSize, difficulty, price, etc. |
| Data type validation      | 4      | Numeric fields, string fields               |
| String length validation  | 4      | Name length (10-40 chars)                   |
| Enum validation           | 2      | Difficulty (easy/medium/difficult)          |
| Number range validation   | 3      | Ratings (1-5), price                        |
| Custom validation         | 2      | priceDiscount < price                       |
| Default values            | 3      | ratingsAverage, ratingsQuantity, createdAt  |
| Valid creation            | 2      | Complete valid tour, whitespace trimming    |
| **TOTAL**                 | **26** |                                             |

**Test Results:**

**Screenshot:** [test_passed.png](./dev-data/img/screenshots/test_passed.png) - Shows 44 tests passing

```
PASS __tests__/tourModel.test.js (26 tests)
  Tour Model Validation
    Required field validation (6 tests)
    Data type validation (4 tests)
    String length validation (4 tests)
    Enum validation (2 tests)
    Number range validation (3 tests)
    Custom validation - priceDiscount (2 tests)
    Default values (3 tests)
    Valid tour creation (2 tests)

Test Suites: 4 passed, 4 total
Tests:       44 passed, 44 total
```

**CI/CD Evidence:** [sprint_2_passed.png](./dev-data/img/screenshots/sprint_2_passed.png) - All pipeline checks passing

**Commit:** `34853c7 - test: add comprehensive tour model validation tests`

---

## Sprint 2 Metrics

### Story Points

- **Planned:** 12 points (reduced from 16 for quality focus)
- **Completed:** 12 points (Story #7: 2pts, Story #4: 5pts, Story #6: 5pts)
- **Velocity:** 12 points/sprint
- **Completion Rate:** 100%

### Testing Metrics

- **Sprint 1 End:** 18 tests
- **Sprint 2 End:** 44 tests
- **New Tests Added:** 26 (+144%)
- **Test Suites:** 4
- **All Tests Status:** Passing

### Commits

- **Total Sprint 2 commits:** 4
- **Commit breakdown:**
  - 1 Planning/transition commit
  - 1 Documentation commit
  - 1 Feature commit (logging)
  - 1 Test commit
- **Commit quality:** Excellent (detailed messages with context)
- **No big-bang commits:** All incremental

### Code Quality

- All tests passing
- No console.logs remaining
- Structured logging implemented
- Documentation complete
- CI/CD passing

---

## Applying Sprint 1 Improvements

### Improvement #1: Verify CI/CD on GitHub

**Sprint 1 Issue:** Marked CI/CD story complete before checking GitHub Actions.

**Sprint 2 Application:**

- Found package-lock.json issue immediately after Sprint 1
- Fixed and verified pipeline passes
- All Sprint 2 commits trigger CI successfully
- GitHub Actions badge in README shows green status

**Result:** SUCCESS - Always verify CI before declaring done

---

### Improvement #2: 30-Minute Debugging Timer (Not Needed)

**Sprint 1 Issue:** Spent 2+ hours debugging browserslist.

**Sprint 2 Experience:**

- No major debugging issues encountered
- Winston integration was straightforward
- Test writing was smooth
- Didn't need to invoke the 30-minute rule

**Result:** READY TO USE IF NEEDED - Rule remains in toolkit

---

### Improvement #3: Continuous Documentation

**Sprint 1 Issue:** Wrote all documentation at the end of sprint.

**Sprint 2 Application:**

- Created .env.example immediately with Story #7
- Updated README during the work, not after
- Documented logging configuration in comments
- Commit messages written as work progressed

**Result:** SUCCESS - Documentation feels less like a chore

---

## Critical Learning from Sprint 1/2 Transition

### The package-lock.json Fix

**Issue:** CI/CD pipeline failed after Sprint 1 with:

```
Error: Dependencies lock file is not found in /home/runner/work/Natours/Natours
```

**Root Cause:** `package-lock.json` was in `.gitignore`, so GitHub Actions couldn't run `npm ci`.

**Fix:** Removed `package-lock.json` from `.gitignore` and committed it.

**Commit:** `b0482dd - fix: add package-lock.json for CI/CD pipeline`

**Lesson Learned:** This perfectly validated Sprint 1 Retrospective Improvement #1: "Verify CI/CD actually works on GitHub before declaring story done."

Now I know:

- Always test CI/CD in the actual environment (GitHub)
- `npm ci` requires package-lock.json (unlike `npm install`)
- Local tests passing ≠ CI tests passing

---

## What Went Well

### 1. Velocity Planning

Reduced story points from 16 to 12. This was the RIGHT decision:

- No rushing
- Higher quality work
- Time to apply retrospective improvements
- All stories completed comfortably

### 2. Documentation Quality

README.md went from 10 lines to 425 lines with:

- Professional formatting
- Clear setup instructions
- Troubleshooting guide
- API documentation
- Someone could clone and run the project now

### 3. Testing Momentum

Added 26 tests in one go. Key to success:

- Understood the pattern from Sprint 1
- Created template with valid data
- Copied and modified for each validation scenario
- Faster than Sprint 1 (learning curve paid off)

### 4. Winston Integration

Logging was cleaner than expected:

- Created reusable logger utility
- Middleware pattern worked well
- No tests broke
- Production-ready with file logging

---

## What Could Be Improved

### 1. Test Coverage Percentage

**Issue:** Overall coverage is still low (~2%) because we're only testing isolated units.

**Why it happened:** Focused on quality over quantity.

**For Future:** Could add integration tests that actually start the server and hit endpoints. But for this lab, demonstrating test-writing skill is more important than % coverage.

### 2. Logging Configuration

**Issue:** File logging only works in production or with ENABLE_FILE_LOGGING flag.

**Why:** Don't want log files piling up in development.

**Consideration:** Could have added log rotation to clean up automatically, but 5MB limit is reasonable.

### 3. Documentation Location

**Issue:** README.md is getting long (425 lines).

**Why:** All documentation in one place.

**Consideration:** Could split into multiple docs (SETUP.md, API.md, TROUBLESHOOTING.md), but single README is fine for this project size.

---

## Sprint Goal Assessment

**Goal:** "Improve code quality with logging, additional tests, and complete documentation"

**Result:** ACHIEVED

- Logging: Winston structured logging fully implemented
- Tests: Added 26 validation tests (144% increase)
- Documentation: Comprehensive README + .env.example

All acceptance criteria met for all 3 stories.

---

## Evidence for Rubric

### Agile Practice (25%)

- Backlog managed (selected 3 stories, completed all 3)
- Acceptance criteria clearly defined and met
- Sprint planning with adjusted velocity (12 pts vs 16 pts)
- Applied feedback from Sprint 1 retrospective
- Incremental delivery (4 commits over sprint)

### DevOps Practice (25%)

- CI/CD pipeline working (all tests pass in GitHub Actions)
- Tests integrated (44 passing)
- Monitoring implemented (Winston logging + health endpoint)
- Logging to files in production
- Request logging middleware

### Delivery Discipline (20%)

- 4 incremental commits
- Descriptive commit messages with full context
- No big-bang commits
- CI verified before declaring done

### Prototype Quality (20%)

- All features working
- 44 tests passing
- Structured logging operational
- Professional documentation
- Meets all acceptance criteria

### Reflection (10%)

- Applied 3 improvements from Sprint 1
- Documented package-lock.json learning
- Adjusted velocity based on Sprint 1 experience

---

## Lessons Learned

### Technical Lessons

1. **Winston Logging** - Learned how to configure transports, log levels, and formatters for production-grade logging
2. **Test Templates** - Using a valid data template makes writing multiple tests much faster
3. **Mongoose Validation** - Deepened understanding of built-in validators (min, max, enum, custom)
4. **CI/CD Dependencies** - `npm ci` requires package-lock.json (won't fall back to `npm install`)

### Process Lessons

1. **Velocity Adjustment Works** - Reducing from 16 to 12 points gave better quality
2. **Documentation During Work** - Easier to write docs while the code is fresh in mind
3. **Testing Gets Easier** - Second time writing tests was much faster than first time
4. **Commit Early, Commit Often** - 4 commits kept progress visible

---

## Comparison: Sprint 1 vs Sprint 2

| Metric              | Sprint 1 | Sprint 2 | Change |
| ------------------- | -------- | -------- | ------ |
| Story Points        | 16       | 12       | -25%   |
| Stories Completed   | 3        | 3        | Same   |
| Tests (Start)       | 0        | 18       | -      |
| Tests (End)         | 18       | 44       | +144%  |
| Test Suites         | 3        | 4        | +33%   |
| Commits             | 4        | 4        | Same   |
| Time Debugging      | ~2-3h    | ~0h      | -100%  |
| Major Issues        | 3        | 0        | -100%  |
| Documentation Lines | ~50      | ~500     | +900%  |

**Key Takeaway:** Experience from Sprint 1 paid off. Sprint 2 was smoother, faster, and higher quality.

---

## Final Deliverables Summary

### Sprint 2 Artifacts

1. **`.env.example`** - Complete environment configuration template
2. **`README.md`** - Professional project documentation (425 lines)
3. **`utils/logger.js`** - Winston logging configuration
4. **`utils/requestLogger.js`** - HTTP request logging middleware
5. **`__tests__/tourModel.test.js`** - 26 validation tests

### Updated Files

- `server.js` - Structured logging
- `app.js` - Request logger integration
- `controllers/errorController.js` - Error logging with context

### Test Evidence

```bash
Test Suites: 4 passed, 4 total
Tests:       44 passed, 44 total
Snapshots:   0 total
Time:        1.745 s
Ran all test suites.
```

### CI/CD Evidence

GitHub Actions passing on all commits  
Badge: ![CI/CD](https://github.com/gideondakore/Natours/actions/workflows/ci.yml/badge.svg)

---

## Next Steps (If There Was a Sprint 3)

**Potential Stories:**

1. Integration tests (test actual API endpoints)
2. Database integration tests with in-memory MongoDB
3. Authentication tests
4. Performance logging (slow request detection)
5. API documentation with Swagger/OpenAPI

**Process Improvements:**

- Maybe split 5-point stories into 2-3 point tasks
- Add code review checklist
- Automate changelog generation from commits

---

## Stakeholder Demo

**If I were presenting this to a stakeholder:**

"In Sprint 2, we focused on code quality and maintainability. We added comprehensive logging so we can track errors in production, wrote 26 new tests to ensure data validation works correctly, and created professional documentation so new developers can get started in minutes. The application is now production-ready from a DevOps perspective."

**Demo Points:**

1. Show README - someone can now clone and run the project
2. Show logs - structured, searchable, production-ready
3. Show tests - 44 passing, validation works
4. Show CI/CD - green badge, automated testing

---

## Sign-Off

Sprint 2 was a complete success. All planned stories delivered, all improvements from Sprint 1 applied, and quality significantly improved.

**Velocity prediction for Sprint 3:** ~12-14 points (comfortable, proven sustainable)

**Key Success Factor:** Learning from Sprint 1 and adjusting velocity

---

**Sprint 2 completed by:** Gideon  
**Date:** February 17, 2026  
**Status:** COMPLETE
