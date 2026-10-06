# Plan: Annotation Analytics

- Acknowledged: 6 October 2026, FILL:HH:MM and time zone
- Submission deadline: 6 October 2026, FILL:acknowledged time + 8 hours
- CVAT commit SHA: 98ee84d0fb5f677d31acf71ec5f797f560f00f5f
- Branch: dev-test01
- Machine: 11th Gen Intel Core i7-1195G7 @ 2.90 GHz, 16 GB RAM (15.7 GB usable),
  64-bit Windows FILL:edition and version, Docker Desktop

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
|---|------|