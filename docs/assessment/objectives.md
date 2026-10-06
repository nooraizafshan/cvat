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
- **Result:** Pending live stack and imported task.

## MO-2: Correctness sample

- **What is measured:** Agreement between the endpoint's per-label totals and
  an independently checked database/API result for the same task.
- **How:** Compare every returned label/count pair against the known imported
  sample and record the task id and raw response.
- **Target:** 100% of returned pairs match; no duplicate label names.
- **Result:** Pending COCO import and live stack.
