# Definition of Done: Annotation Analytics

- [x] Repository is on `dev-test01`; the original assessment clone SHA was
  `98ee84d0fb5f677d31acf71ec5f797f560f00f5f`.
- [x] Plan is present under `docs/assessment/` before implementation.
- [x] New `test` Django app is registered. Evidence: `cvat/apps/test/`,
  `cvat/settings/base.py`, and `cvat/urls.py`.
- [x] Focused backend tests cover authentication, invalid filters, and
  aggregation. Evidence: `cvat/apps/test/tests.py`; source-level coverage is
  present, but the host pytest runner was unavailable.
- [x] Authenticated endpoint returns database-derived per-label counts.
  Evidence: `cvat/apps/test/views.py`; Python compilation passes.
- [x] Anonymous and unauthorized task requests are refused in a live check.
  Evidence: Task `4` returned anonymous `401`, authenticated outsider `403`,
  and authorized user `200` against the local Docker stack.
- [x] UI page calls the endpoint and renders a graph. Evidence:
  `cvat-ui/src/components/analytics-report/annotation-count-chart.tsx`.
- [ ] UI has explicit loading, no-data, and failed-request states. Evidence:
  `cvat-ui/src/components/analytics-report/annotation-count-chart.tsx`;
  Task 4 chart and Task 3 empty state were verified in the rebuilt browser UI;
  screenshot: `docs/assessment/screenshots/empty-state.png`. The failed
  request produced a server/login error while the backend was stopped, but
  the chart-level error branch was not isolated; screenshot:
  `docs/assessment/screenshots/error-state.png`.
- [x] One additional filter is implemented. Evidence:
  `annotation_type` in `cvat/apps/test/views.py` and the type selector in
  `cvat-ui/src/components/analytics-report/annotation-count-chart.tsx`.
- [x] Objective MO-1 is measured with five raw timings, median, and spread.
  Evidence: `docs/assessment/objectives.md`; Task 4 median `55.07 ms`,
  spread `3.92 ms`.
- [x] Objective MO-2 is checked against an imported sample with task id and
  raw response. Evidence: Task 4 returned `person=2`; ORM cross-check found
  two matching `LabeledShape` rows.
- [x] Every unfinished requirement is listed honestly. Requirements 8-9
  (WebSocket updates and reconnect handling) are not reached.
- [ ] Final diff has no dead code, debug files, or unrelated changes.
- [x] Performance raw output is preserved. Evidence:
  `docs/perf-runs.txt`.
- [x] COCO import: 1 image, annotation file `annotations/instances_val2017.json`.
