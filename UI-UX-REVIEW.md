# Mobile UI/UX review

## Context

Min / Max is a local-first React workout journal. The primary task is recording a set between exercises, often with one hand and interrupted attention. A light, low-glare canvas supports reading in a lit gym, with a restrained green accent reserved for actions and selection.

Reviewed using impeccable product-design guidance and mobile-design touch principles. The existing React/PWA architecture, training prescriptions, and storage format are preserved.

## Findings and changes

| Finding | Implemented change |
| --- | --- |
| Phone layout obscured session progress and placed the exercise list far below the form. | A compact session summary shows completed sets; an expandable exercise picker sits above the logger. |
| Four-day programs occupied a five-column day selector. | Column count follows the actual split, with explicit selected state. |
| Small type and narrow increment buttons made logging harder on touchscreens. | Larger labels and values, 44px increment buttons, stronger text colors, and visible input-group focus. Fields stack on narrow phones. |
| Navigation and settings felt like a responsive website. | Stronger bottom-tab selection, consistent rounded controls, and a safe-area-aware Settings sheet on phones. |
| Timer took up substantial screen space. | More compact mobile timer and extra page-bottom clearance while it is active. |
| Final exercise offered a next button that did nothing. | Hide Next exercise on the last entry. Finish workout remains available when all required sets are complete; the picker allows returning to earlier entries. |

## Validation

- Production build passes.
- All 7 existing model tests pass.
- Browser: exercise picker expands, choosing an exercise updates the logger and collapses the list.
- Browser: Settings opens as a labeled mobile bottom sheet with native dialog focus handling.
- Visual checks: 320px and 390px phone widths, default narrow preview, and 1440px desktop layout.
- The mobile skill audit script found no applicable checks; its PASS output is not treated as accessibility validation.

## Remaining verification

Physical-device keyboard behavior, VoiceOver/TalkBack, full contrast measurement, installation, and background timer behavior require further device testing. This is not a complete accessibility certification.
