# Plan: Annotation Analytics

- Acknowledged: 6 October 2026, 19:53 +05:00
- Submission deadline: 7 October 2026, 03:53 +05:00
- CVAT commit SHA: `98ee84d0fb5f677d31acf71ec5f797f560f00f5f`
- Branch: `dev-test01`
- Machine: 11th Gen Intel Core i7-1195G7 @ 2.90 GHz, 16 GB RAM (15.7 GB usable),
  Windows 11 Home 10.0.26300, 64-bit, Docker Desktop

## Goal

Add an authenticated API that returns the number of annotations per label for
a CVAT task, and a page in the web interface that shows those counts as a
graph. The minimum deliverable is items 1-4 from the assessment: the
database-backed endpoint, a page that calls it, a graph, and clean empty and
failed-request states.

## Approach

- Put backend work in a new Django app named `test`; touch only the minimum
  settings and URL wiring required to register it.
- Follow CVAT's existing permission mechanism so anonymous users and users
  without access to the task receive a refusal rather than counts.
- Count shapes through the job/task/label relationship with a database
  aggregation (`GROUP BY`), not a Python loop. Use the model relationships in
  `cvat/apps/engine/models.py` as the source of truth.
- Expose a small JSON response with the task id and label/count pairs. Keep
  labels with zero annotations out of the result because the endpoint counts
  stored annotations.
- Add a task analytics page using existing CVAT API and UI patterns. Render a
  bar chart and explicitly handle loading, no data, and request failure.
- Add an optional annotation-type filter so the chart can focus on shapes,
  tracks, images, or intervals without changing the stored data.
- Add focused backend tests for a successful response, anonymous access, and
  task access control. Add frontend tests only where the existing test setup
  makes them practical within the time limit.

## Order and time budget (8 hours)

| # | Step | Hours | Evidence |
|---|---|---:|---|
| 1 | Inspect CVAT models, permissions, routing, and UI conventions | 0.5 | Source paths recorded in commits |
| 2 | Commit this plan before implementation | 0.25 | Git commit |
| 3 | Create and wire the `test` backend app and endpoint | 1.5 | API code and tests |
| 4 | Add the analytics page, graph, and empty/error states | 2.0 | UI code and browser check |
| 5 | Run focused tests and fix integration issues | 1.0 | Test output in Definition of Done |
| 6 | Start CVAT, import a measured COCO sample, and verify counts | 1.25 | Task id, sample size, and raw output |
| 7 | Measure the endpoint five times and record median/spread | 0.5 | Raw timings in Objectives |
| 8 | Complete documentation, review the diff, and record unfinished items | 1.0 | Objectives and Definition of Done |

## Scope decisions

I will prioritize requirements 1-7. WebSocket live updates and reconnect
handling (requirements 8-9) are stretch work after the endpoint, page, graph,
and error states are working. I will not change CVAT's annotation storage
models or introduce a new charting dependency. If Docker or the COCO download
remains blocked by the environment, I will report that honestly and verify the
code with focused tests instead of claiming a live-data result.

## Decision record

The chosen approach is a small REST endpoint plus a page-local chart because it
keeps the change isolated and makes authentication and task authorization
reuseable. I rejected adding analytics fields to CVAT's core task model because
that would duplicate derived data, require migrations, and risk stale counts.
I also rejected a WebSocket-first implementation because it would delay the
assessed minimum; the cost is that live updates may remain unfinished.

## Changes to the plan

This section will be updated only when the implementation requires a material
change, with the reason and the resulting cost recorded.
