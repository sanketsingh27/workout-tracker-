# Verification

Verified on 8 September 2026.

## Passed

- Production build with Vite; local font files included.
- Seven automated model tests (`npm test`).
- All 48 program sheets, 396 exercise rows, 660 working sets; every row has RIR, rep prescription, two substitutions, notes, and source page.
- Custom five-day redistribution preserves all exercises, set totals, and targets in all twelve weeks.
- Browser: logged a 60 kg × 6 set; automatic 3:00 rest appeared.
- Browser: +30 seconds extended rest; reload preserved the set, rest deadline, and 60 kg input; Skip dismissed rest.
- Browser: second set retained weight and used its own RIR target. Week 2 recalled both Week 1 sets.
- Browser: 62.5 kg × 6 triggered a performance best; Progress showed the history and trend.
- Browser: changing units displayed 62.5 kg as 137.79 lb.
- Browser: custom split displayed Arms and the source/adaptation notice.
- Browser: substitution to DB Curl, remembered choice, and editable notes worked.
- Browser: all six custom Arms sets completed; Finish workout saved the session and Progress showed 1/60 workouts.
- Browser: Muscle Ladder search found Neck; its entry explicitly reported no named backup.
- Visual inspection at 390 × 844 and 1440 × 1000; no horizontal page overflow.

## Boundaries

- Tests used a separate local origin from the user's live journal.
- Backup validation is covered by model tests; an actual export/import round trip was not exercised in the browser.
- Manifest, icons, service worker, and registration are included; home-screen installation and a complete offline reload were not verified on a physical device.
- Background sound/vibration remain subject to browser and operating-system suspension.

The development app is available at http://localhost:5173 while its server is running. The shipped `dist/` build enables the service worker; Vite development mode intentionally does not register it.
