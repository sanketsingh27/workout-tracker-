# Workout Tracker

**A focused workout journal. Plan your session, record each set, and see your progress.**

Min / Max is a mobile-first progressive web app (PWA) built around a 12-week training program. It combines workout tracking with a muscle-by-muscle exercise reference in a restrained interface designed for use at the gym.

**No account. No backend. Your workout history stays in your browser.**

## What’s inside

| Tab | What you can do |
| --- | --- |
| **Today** | Choose a week and workout, view targets and previous performance, record sets, and manage rest. |
| **Progress** | Track completed workouts, week/block progress, exercise history, load trends, and performance bests. |
| **Muscle Ladder** | Browse or search 15 muscle groups, with a primary exercise, backup option, and short rationale. |

### Workout tracking

- 12 weeks across two six-week blocks, including intro and deload targets.
- Four-day program and a clearly labeled custom five-day adaptation.
- Working sets, rep ranges, warm-up counts, and individual set targets.
- **RIR (reps in reserve):** how many more reps you could perform. RIR 0 means none left; RIR 2 means about two left.
- Previous-session recall, weight carried into the next set, and corrections to logged sets.
- Exercise substitutions, remembered preferences, and automatically saved notes.
- Kilograms or pounds, with automatic conversion.

### Rest and progress

- A **3-minute rest timer** starts after each completed working set.
- **+30 sec** and **Skip rest** controls, with optional sound and vibration.
- Timer deadlines survive reloads and account for time spent away from the app.
- Exercise history and first-set load charts.
- Performance-best detection without counting your first entry as a PR.
- Backup export and import using a JSON file.

## Quick start

You need **Node.js 20.19+ or 22.12+** and npm.

1. Clone or download this repository.
2. Open a terminal in the project folder—the folder containing `package.json`.
3. Install dependencies and start the app:

```sh
npm ci
npm run dev
```

Open the local URL printed in the terminal, usually **http://localhost:5173**.

No API keys, environment variables, database setup, or account registration are required. Keep the terminal running while using the local preview. Press `Ctrl+C` to stop it.

> Open the app through the local server. Double-clicking `index.html` will not run the React source project.

## Your first workout

1. Open **Settings** and choose your split and weight unit.
2. In **Today**, select the week and workout day.
3. Review the exercise’s warm-up count, rep range, and RIR targets.
4. Enter weight and reps, choose RIR, then tap **Complete set**.
5. Rest, add time, or skip ahead. Continue through the exercise list.
6. Tap **Finish workout** after recording all working sets.

Partially completed workouts save automatically and can be resumed. Tap a completed set to correct it. Use **Technique, substitutions & notes** for coaching cues, exercise alternatives, and your own notes.

### Entering weight

| Movement | What to enter |
| --- | --- |
| Weighted exercise | The external load, using a consistent convention each session. |
| Unweighted bodyweight exercise | `0` |
| Weighted pull-up or similar movement | Added weight as a positive number. |
| Assisted bodyweight exercise | Assistance as a negative number. |

Loads are stored internally in kilograms. Changing the display unit converts existing records; it does not relabel the same number.

## Program and source content

This is an **independent personal companion**, not an official Jeff Nippard application.

The program data was transcribed from the supplied *Min-Max Program — Phase 2* PDF. The exercise reference summarizes the supplied *Ultimate Exercise Guide: Jeff Nippard’s Best Exercise for Each Muscle*.

| Content | Source and implementation |
| --- | --- |
| Four-day program | PDF pages 26–73: 48 workout sheets, 396 exercise entries, and 660 working sets across 12 weeks. |
| Intro and deload | Weeks 1 and 7 retain the targets on their source sheets. |
| Block 2 techniques | Relevant final sets show the source’s intensity technique and a short explanation. |
| Muscle Ladder | PDF pages 4–22: 15 muscle groups with the guide’s primary choices and named backups. |

Source page references appear in the app. The original PDFs and illustrations are not bundled. The neck section does not name a separate backup exercise, so the app states that explicitly.

### Four-day versus custom five-day split

The source introduction mentions both splits, but the supplied workout sheets contain **only the four-day version**.

| Option | Schedule |
| --- | --- |
| Four-day source program | Upper → Lower → Push → Pull |
| Custom five-day adaptation | Upper → Lower → Push → Pull → Arms |

The custom version moves these existing exercises into Arms day:

- Upper’s EZ-Bar Cheat Curl / EZ-Bar Skull Crusher superset.
- Pull’s Preacher Hammer Curl.

**No weekly sets are added.** The moved exercises retain their rep ranges, RIR targets, substitutions, and intensity techniques. This adaptation is not the missing official five-day program.

Each split has its own completion records. Exercise performance history is shared between splits.

### Intentional differences from the guides

- The default rest period is **three minutes after every working set**, including superset entries. Original rest prescriptions remain visible; use Skip to move directly to the paired exercise.
- Separate source rows with different rep targets remain separate exercise entries. For example, a heavy press and its 20-rep set are logged separately. Previous recall matches the rep prescription.
- Drops, partials, and hold details can be recorded in notes; they do not create additional prescribed working sets.

## How performance bests work

A new set is a performance best when it improves on a previous set by:

- Lifting **more weight at equal or higher reps**, or
- Doing **more reps at equal or higher weight**.

No earlier set may already match or exceed both values. First entries establish a baseline; ties are not PRs.

**Example:** after `60 kg × 6`, `62.5 kg × 6` can be a best. `62.5 kg × 5` is not automatically counted as one.

Substitutions have separate exercise histories. The comparison does not adjust for changes in bodyweight, equipment setup, technique, or range of motion. Review reps and RIR alongside the load chart.

## Storage and backups

The journal uses browser **localStorage**, under the key `minmax-journal-v1`. There is no cloud synchronization, analytics, or remote font loading.

- Data belongs to the browser and site address you use. Different devices, browser profiles, domains, and ports have separate storage.
- Clearing site data removes the journal.
- Use **Settings → Export backup** before changing devices or clearing browser storage.
- Use **Settings → Import backup** to restore a saved file. Importing requires confirmation because it replaces the current journal.

Treat exported backups as personal workout records; do not commit them to the repository.

## Production build and installation

Build the static application:

```sh
npm run build
npm run preview
```

Vite writes the deployable files to `dist/`. Upload that folder’s contents to a static **HTTPS** host. No application server or database is required in production. The Vite configuration uses relative asset paths to support deployment beneath a repository subdirectory.

You can also serve an existing build locally without npm dependencies:

```sh
python3 -m http.server 4173 --directory dist
```

Then open **http://localhost:4173**.

### Install as an app

- **iPhone / iPad:** open the hosted app in Safari, then Share → Add to Home Screen.
- **Android / desktop:** use the browser’s Install app option, or the install button in Settings when available.

PWA features require HTTPS, except when using localhost on the same device. An ordinary HTTP address on your local network is useful for previewing the interface but does not provide normal PWA installation.

The production build registers a service worker that caches visited app resources for offline reopening. **Development mode does not register it.** Physical-device installation and a complete offline reload have not yet been verified; see [QA.md](QA.md).

## Development

### Stack

- React 19 and JavaScript.
- Vite 7 for development and production builds.
- Tailwind CSS 4 with custom responsive styles.
- Phosphor icons and locally bundled Geist fonts.
- Browser localStorage, Web App Manifest, and a service worker.

### Project structure

```text
minmax/
├── src/
│   ├── main.jsx          # Screens, workout flow, timer, and settings
│   ├── model.js          # Program selection, history, PRs, and validation
│   ├── program.json      # Structured four-day source program
│   ├── ladder.js         # Exercise reference and source page numbers
│   └── style.css         # Responsive interface styles
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js
│   └── icon-*.png
├── tests/
│   └── model.test.js
├── index.html
├── vite.config.js
├── package.json
├── package-lock.json
├── QA.md
└── README.md
```

### Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the versions recorded in the lockfile. |
| `npm run dev` | Start the development server. |
| `npm test` | Run the model tests. |
| `npm run build` | Generate the production build. |
| `npm run preview` | Preview the production build locally. |

Tests cover all-week data integrity, intro/deload targets, intensity techniques, five-day volume preservation, PR comparisons, unit conversion, backup validation, previous-session recall, and workout selection. [QA.md](QA.md) records browser checks and unverified areas.

## Known limitations

- Sound and vibration depend on browser support. A sleeping phone may delay them until the app returns to the foreground; the timer is not a background alarm service.
- No account system, cloud sync, or cross-device live updates.
- Workout completion requires every prescribed working set; unfinished sessions remain saved.
- There is no automatic new-cycle/reset flow after Week 12. Export a backup before using a fresh browser profile or site origin for another cycle.
- The first-set chart shows recorded external load, not an estimated one-rep max.

## Contributing

For bug reports, include the browser/device, steps to reproduce, expected behavior, and actual behavior. Use dummy workout values and remove personal data from screenshots or attachments.

For changes, run `npm test` and `npm run build`. Check both phone and desktop layouts. Program-data corrections should include the source page and preserve the distinction between the four-day source program and the custom adaptation.

## Attribution and licensing

Training-program content and exercise-reference material are attributed to Jeff Nippard. This repository does not claim ownership of those materials or endorsement by their author.

No software license has been selected for this project yet. Do not assume that making the code public grants a license to redistribute it or the included guide-derived data. Code licensing and third-party content permissions are separate considerations.
