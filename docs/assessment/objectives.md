# Objectives: Annotation Analytics

## MO-1: Endpoint response time

- **What is measured:** Time for the authenticated annotation-count endpoint
  to return a response for one imported task.
- **How:** Run the same request five times against the local Docker stack with
  browser cache disabled and record raw elapsed milliseconds from the client.
- **Target:** Median of five runs at or below 300 ms.
- **Conditions:** Windows 11 Home, i7-1195G7, 16 GB RAM, local Docker stack,
  one COCO validation task, no other intentional load.
- **Not included:** First request after a cold container start, image upload,
  annotation import, and frontend rendering.
- **Result:** Passed on Task `4` using the authorized browser session against
  the local Docker stack. Raw timings (ms): `62.94`, `66.22`, `54.46`,
  `59.44`, `54.05`. Median: `59.44 ms`. Min: `54.05 ms`. Max: `66.22 ms`.
  Spread: `12.17 ms`. The raw command output was captured during the browser
  verification session.

## MO-2: Correctness sample

- **What is measured:** Agreement between the endpoint's per-label totals and
  an independently checked database/API result for the same task.
- **How:** Compare every returned label/count pair against the known imported
  sample and record the task id and raw response.
- **Target:** 100% of returned pairs match; no duplicate label names.
- **Result:** Passed on Task `4`. The endpoint returned
  `{"task_id":4,"annotation_type":null,"results":[{"label":"person","count":2}]}`
  and the independent Django ORM check found two `LabeledShape` rows labelled
  `person`, aggregating to `2`. The `shape` filter returned the same single
  pair. Empty Task `3` returned `results=[]`.

## MO-3: Annotation-type filter

- **What is measured:** The optional `annotation_type` filter limits results
  to exactly one concrete annotation table.
- **How:** Request the same task with `annotation_type=shape` and compare the
  response with the unfiltered response.
- **Target:** The filtered response contains no counts from other annotation
  types and invalid values return HTTP 400.
- **Result:** Covered by `cvat/apps/test/tests.py`; invalid values return
  HTTP 400. Live Task 4 verification returned `person=2` for both the
  unfiltered and `shape` requests.

## Raw evidence

- Task 4 authorization: anonymous `401`, authenticated without task access
  `403`, authorized `200`.
- Task 4 UI: `/tasks/4/analytics` displayed the bar chart for `person=2` and
  the annotation-type selector in the rebuilt Docker UI.
- Requirements 8-9 (WebSocket updates and reconnect backoff): not reached.
