# Sprint 1 Retrospective

**Date:** February 17, 2026  
**Participants:** Gideon (Solo Project)  
**Sprint Duration:** Sprint 1 Execution Phase

---

## Retrospective Format: Start, Stop, Continue

### 🟢 START (Things I should start doing)

#### 1. Checking GitHub Actions in Real-Time

**Why:** I created the CI/CD pipeline and pushed it, but didn't actually verify it runs successfully on GitHub. That's like building a car and not test-driving it.

**Action:** In Sprint 2, immediately after pushing:
- Open GitHub Actions tab
- Watch pipeline run
- Fix any failures before moving on

#### 2. Using a Timer for Debugging

**Why:** I spent 2+ hours on the browserslist/ES module issues. Got tunnel vision trying the same thing over and over.

**Action:** Set 30-minute timer when debugging. If not solved:
- Take a break
- Try completely different approach  
- Google the exact error message again
- Ask for help

#### 3. Updating Documentation As I Go

**Why:** Writing this review at the end made me realize I forgot some details. Also felt like busywork instead of valuable reflection.

**Action:**
- Keep AGILE_DOCUMENTATION.md open in a tab
- After completing each task, add 1-2 sentences
- Add screenshots immediately when something works

---

### 🔴 STOP (Things I should stop doing)

#### 1. Underestimating Testing Complexity

**What I did wrong:** Thought "writing tests" would be quick. Didn't account for:
- Learning Jest syntax
- Dealing with ES module compatibility
- Understanding mock functions
- Fixing environment issues

**Impact:** Spent 3 hours when I estimated 1.5 hours.

**Fix:** In Sprint 2, multiply test estimates by 1.5-2x. Testing always takes longer than you think.

#### 2. Skipping the GitHub Check

**What I did wrong:** Pushed code to GitHub and assumed the pipeline works. Didn't actually verify it.

**Impact:** Don't know if CI/CD is ACTUALLY working yet. Could fail silently.

**Fix:** Make "verify on GitHub" part of my Definition of Done.

#### 3. Trying to Cover Everything in One Sprint

**What I did wrong:** Wanted to add tests for tours, auth, bookings, etc. Ended up with only 3 test files.

**Impact:** Felt like I didn't accomplish enough, even though I hit all my sprint goals.

**Fix:** Accept that incremental progress is GOOD progress. Sprint 2 can add more tests.

---

### 🔵 CONTINUE (Things that worked well)

#### 1. Incremental Commits ✅

**What I did:** Made 3 separate commits for 3 separate features. Each commit message explained what and why.

**Why it worked:** Easy to track progress. If something breaks, I can revert specific changes.

**Keep doing:** Commit after each story completion. Never batch commits.

#### 2. Breaking Down Tasks ✅

**What I did:** Split "automated testing" into subtasks:
- Install dependencies
- Configure Jest
- Write first test
- Write more tests

**Why it worked:** Made progress visible. Gave me small wins instead of one big overwhelming task.

**Keep doing:** Always break stories into 30-60 minute chunks.

#### 3. Testing Locally Before Committing ✅

**What I did:** Ran `npm test` multiple times. Fixed all errors before committing.

**Why it worked:** No "oops, broken commit" moments. Clean commit history.

**Keep doing:** `npm test` before every commit. No exceptions.

---

## The "Honest Mistakes" Section

### Mistake #1: The Browserslist Horror Story

**What happened:** Tests failed with cryptic Browserslist error. Panicked for 20 minutes.

**Why it happened:** I have BOTH `.browserslistrc` file AND `browserslist` in package.json. Tools got confused.

**What I learned:**
- Read error messages carefully (it literally said "contains both")
- Check for duplicate configs
- When using Parcel, remember it needs browserslist config

**Will this happen again?** Probably not with browserslist specifically, but similar "duplicate config" issues? Yes. Now I know what to look for.

---

### Mistake #2: ES Module Hell

**What happened:** `file-type` package uses ES modules. Can't `require()` it in CommonJS.

**Why it happened:** Didn't realize file-type v20 switched to ESM-only.

**What I learned:**
- Check package documentation for breaking changes
- ESM vs CommonJS is a real thing in Node.js
- Dynamic `import()` can save you when mixing module types

**Will this happen again?** Probably! More packages are moving to ESM. Now I know the pattern: use dynamic import or switch the whole project to ESM.

---

### Mistake #3: Testing the Entire App

**What happened:** First health test loaded entire `app.js`, which loaded all controllers, which needed MongoDB, Stripe keys, etc. Test failed.

**Why it happened:** Thought "test the app as it runs" meant "import the entire app".

**What I learned:**
- Tests should be isolated
- Create minimal test apps for specific routes
- Don't load dependencies you don't need

**Will this happen again?** No, I learned the pattern: create lightweight test doubles.

---

## Key Metrics

### What I Said I'd Do vs What I Actually Did

| Story                          | Estimated Points | Actual Points | Status      |
| ------------------------------ | ---------------- | ------------- | ----------- |
| Health Monitoring Endpoint     | 3                | 3             | ✅ Complete |
| Automated Testing Suite        | 5                | 5             | ✅ Complete |
| CI/CD Pipeline Setup           | 8                | 8             | ✅ Complete |
| **TOTAL**                      | **16**           | **16**        | **100%**    |

**Velocity:** 16 points completed out of 16 planned = 100% predictability

### Time Estimates vs Reality

| Task                     | Estimated | Actual | Variance |
| ------------------------ | --------- | ------ | -------- |
| Health endpoint          | 1 hour    | ~1h    | On track |
| Testing setup            | 1.5 hours | ~3h    | 2x over  |
| Writing tests            | 1 hour    | ~1.5h  | 1.5x     |
| CI/CD pipeline           | 1.5 hours | ~2h    | 1.3x     |
| **TOTAL**                | **5h**    | **7-8h** | **~60% over** |

**Learning:** Testing tasks take 2x longer than estimated. Account for this in Sprint 2.

---

## The "What I Learned About Myself" Section

### 1. I Underestimate Learning Time

I'm good at coding tasks I know. But I underestimate how long it takes to LEARN something new.

**Example:** I've never used Jest before. My estimate didn't include "learn Jest" time.

**Fix for Sprint 2:** Add explicit "learning time" to estimates. If it's new to me, multiply by 2x.

### 2. I'm Stubborn When Debugging

I spent 2 hours on browserslist when I could have asked for help or tried a completely different approach after 30 minutes.

**Fix for Sprint 2:** Use the 30-minute timer rule. Seriously.

### 3. I Actually Enjoy Writing Tests

Surprising! I thought I'd hate testing. But there's something satisfying about seeing tests pass. Makes me feel like the code is "real".

**For Sprint 2:** Lean into this. Maybe add more tests than planned.

---

## Sprint Health Check

### What's Working? 🟢

- ✅ Agile process (backlog → sprint planning → execution → review)
- ✅ Git workflow (meaningful commits, no big-bang)
- ✅ Technical skills (learned Jest, GitHub Actions, ES modules)
- ✅ Problem-solving (didn't give up when things broke)

### What's At Risk? 🟡

- ⚠️ CI/CD verification (haven't checked GitHub Actions)
- ⚠️ Test coverage (only 2% overall, but 100% on what we tested)
- ⚠️ Time management (went 60% over estimate)

### What's Broken? 🔴

- ❌ Nothing critical! All stories completed.

---

## Specific Improvements for Sprint 2

### Improvement #1: Verify CI/CD Actually Works

**Problem:** I created the pipeline but didn't verify it runs on GitHub.

**Solution:**
1. Open GitHub repo
2. Go to Actions tab
3. Check latest workflow run
4. If failed: debug and fix
5. Add status badge to README.md
6. ONLY THEN mark story as done

**Measure of Success:** Green checkmark on GitHub Actions + badge in README

---

### Improvement #2: Set Debugging Time Limits

**Problem:** Spent 2+ hours on browserslist issue.

**Solution:**
- Set 30-minute timer when debugging
- When timer goes off:
  - Step away for 5 minutes
  - Google exact error message again
  - Try completely different approach
  - If still stuck after 3 cycles (90 mins total), ask for help or defer

**Measure of Success:** No single debugging session >90 minutes

---

### Improvement #3: Update Documentation Continuously

**Problem:** Writing this review at the end is time-consuming and I forgot details.

**Solution:**
- Keep AGILE_DOCUMENTATION.md open in tab
- After completing each task:
  - Add timestamp
  - Screenshot if relevant
  - Note any issues encountered
- Takes 2 minutes per task vs 30 minutes at sprint end

**Measure of Success:** Documentation is 80% complete before sprint review

---

## Questions for Myself (To Answer in Sprint 2 Retrospective)

1. Did I actually check the CI/CD pipeline on GitHub, or did I skip it again?
2. Did the 30-minute debugging timer help, or did I ignore it?
3. Was my Sprint 2 velocity prediction accurate (10-12 points)?
4. Did I add continuous documentation, or did I batch it at the end?
5. What NEW mistakes did I make that I didn't make in Sprint 1?

---

## Gratitude Section (What Am I Proud Of?)

### 1. I Didn't Give Up ✅

When the browserslist error appeared, I could have said "Jest is too hard, I'll skip tests". But I didn't. I debugged it. That's growth.

### 2. I Learned 3 New Technologies ✅

- Jest (testing framework)
- GitHub Actions (CI/CD)
- Supertest (API testing)

All in one sprint. That's solid.

### 3. I Followed the Process ✅

I actually DID the Agile process:
- Sprint planning (picked 3 stories)
- Execution (committed incrementally)
- Review (this document)
- Retrospective (you're reading it)

Didn't half-ass it. Did it properly.

---

## The "One Thing" Rule

If I could only change ONE thing in Sprint 2, what would it be?

**Answer: Verify the CI/CD pipeline actually works on GitHub before declaring the story done.**

Why? Because everything else is process tweaks, but this is about delivery. If the pipeline doesn't work, I haven't actually delivered Story #2. Simple as that.

---

## Final Thoughts

### What Went Better Than Expected?

Writing tests was way more satisfying than I thought. Seeing 18 tests pass feels good.

### What Was Harder Than Expected?

ES module compatibility issues. Didn't realize how much the JavaScript ecosystem is still in transition.

### What Would I Tell My Past Self?

"You're going to spend 2 hours on browserslist errors. Just delete it from package.json first. Trust me."

### What Am I Taking into Sprint 2?

1. Confidence in testing
2. Knowledge of GitHub Actions
3. Realistic time estimates (multiply by 2x for new stuff)
4. The 30-minute debugging rule
5. Continuous documentation habit

---

## Sign-Off

This was a successful sprint. I completed 100% of planned stories, learned new technologies, and followed Agile practices properly. The improvements I identified are specific and actionable.

Sprint 2, let's go! 🚀

---

**Retrospective completed by:** Gideon  
**Date:** February 17, 2026  
**Next retrospective:** End of Sprint 2
