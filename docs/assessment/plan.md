# Plan: Annotation Analytics

- Acknowledged: <date and time you sent the email>
- Submission deadline: <acknowledgement time + 8 hours>
- CVAT commit SHA: 98ee84d0fb5f677d31acf71ec5f797f560f00f5f
- Branch: dev-test01
- Machine: 11th Gen Intel Core i7-1195G7 @ 2.90 GHz, 16 GB RAM (15.7 GB usable),
  64-bit Windows <edition and version>, Docker Desktop

## Goal
Add an endpoint that returns the number of annotations per label for a CVAT
task, and a page in the web UI that shows those counts as a graph.

## Approach
- All backend work goes in a new Django app named `test`, so my change stays
  separate from CVAT's own code. I will touch only the minimum wiring
  (app registration and URL include).
- The endpoint takes a task id and returns counts grouped by label name. The
  count is one database aggregation (GROUP BY label), not a loop in Python.
  I will confirm the model path from shape to job to task to label by reading
  `cvat/apps/engine/models.py` before writing the query.
- Authentication reuses CVAT's existing login and permission classes. No new
  auth scheme.
- The page calls the endpoint and draws a bar chart, with explicit empty and
  error states.

## Order and time budget (8 hours)
| # | Step | Hours |
|---|------|-------|
| 1 | Finish setup: stack running, create task, import COCO data | 0.5 |
| 2 | Read CVAT models and permissions (Task, Label, LabeledShape) | 1.0 |
| 3 | Endpoint: counts per class, checked against a known task | 1.5 |
| 4 | Auth: no login refused, no task access refused | 0.5 |
| 5 | UI page, bar chart, empty and error states | 1.5 |
| 6 | Speed objective: set target, measure 5 runs, save raw output | 0.75 |
| 7 | One extra filter or grouping, with the reason | 0.5 |
| 8 | Objectives, Definition of Done, Loom recording | 1.25 |
| 9 | Buffer | 0.5 |

Setup and downloads run in the background while I write documents and read
the CVAT code, so they overlap with other steps.

Task items 1 to 4 are the floor. I will not start anything beyond them until
they work.

## Decided to skip for now
- WebSocket live updates and reconnect handling (task items 8 and 9), unless
  time is left after step 8.
- Counting tracks and tags. I will count shapes first and state clearly what
  is not counted.
- Video tasks. Image tasks only.

## Known risks
- Setup started after I acknowledged the email. Docker image pulls and the
  COCO download hit network timeouts. I am treating that time as counting
  toward my deadline, so I will load only as many images as my network and
  machine handle comfortably, and record the number used.
- 16 GB RAM is shared with Docker, the browser, and the editor. I will close
  other applications while measuring so the numbers are repeatable.
- I have not worked in the CVAT codebase before, so step 2 may overrun.

## Decision record
To be written at the end if I reach task item 10.

## Changes to this plan
None yet. Any change will be added here with the time and the reason.