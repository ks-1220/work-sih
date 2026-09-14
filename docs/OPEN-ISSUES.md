# Open issues and deferred blockers

Recorded against commit `027ffba` plus the prohibition-fix work. These are
things that cannot be closed from inside this repository, or that were
deliberately left out of scope. Keep this file current.

## Blockers

### 1. Admin registration is open on the backend

The public `/adminregister` route has been deleted from this app, so there is
no longer a visible signup page. **That is not the fix.** The real control
point is `POST /api/admin/register` on `sih24-backend.onrender.com`, which is
not in this repository.

That endpoint was deliberately **not** probed, because a successful request
would create a real admin account on a live system. Someone with backend
access must verify whether it accepts unauthenticated registrations and close
it if so.

Admin accounts should be provisioned out of band until that is confirmed.
`/adminlogin` and `/dashboard` are untouched and still work.

### 2. The Python recommender checkpoint is missing

The architecture brief's Build 2 depends on an existing Python recommendation
prototype, reported as 18 catalogue records and 210 passing tests. No Python
artifacts exist anywhere in this repository: no `.py` files, no
`requirements.txt`, no `master_report.json`, no checkpoint archive.

Build 2 cannot start until that checkpoint is supplied and audited.

### 3. Database ownership is undecided

There is no persistence of any kind. The app is entirely client-rendered with
no `src/app/api` and no `src/server`. Anything requiring stored state is
blocked until a database is chosen and credentials are authorised. This
affects, at minimum: cycle history, habit logs, the reward ledger, saved
recipes and recommendation sessions.

## Known unfixed issues

### Fabricated content still in the UI

Dashboard figures on Home and Profile are now marked with a "Sample data"
badge and centralised in `src/data/demoStats.js`, but they remain fabricated.
Two larger cases were left alone because they are static markup needing a
design decision rather than a substitution:

- The eight-item appointment inbox on the profile.
- The profile calendar, hardcoded to September 2024 with fixed appointments.

### Unverified venue data

`tennis-venues.js` and `meditation-venues.js` list real-looking names,
addresses, phone numbers and ratings for Delhi-area venues. None of it has
been verified. Either verify it or label it clearly as illustrative.

### Hotlinked third-party images

Eighteen images are hotlinked from an unrelated public GitHub repository, plus
others from CNN, India Today, WFLA and similar. These can break or be blocked
at any time and were not licensed for this use.

### Seven activity tiles have no destination

Running, cycling, climbing, hiking, dancing, gardening and swimming render as
plain tiles because no pages exist. Building them needs real venue data.

### Correctness bugs reviewed but not fixed

- `calorie.js` computes BMR from a hardcoded height and weight that the form
  never collects, so every result is wrong.
- `Yoga.js` never clears its 100ms detection interval on unmount and never
  disposes TensorFlow tensors, leaking on every visit.
- `PostList.js` mutates state through a shallow copy.

### Tooling

There is no test runner and no tests. `npm run lint` is broken: `next lint`
was removed in Next.js 16 and the script needs to call ESLint directly.
