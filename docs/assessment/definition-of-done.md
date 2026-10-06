# Definition of Done: Annotation Analytics

- [x] Repository is on `dev-test01` at commit
  `98ee84d0fb5f677d31acf71ec5f797f560f00f5f`.
- [x] Plan is present under `docs/assessment/` before implementation.
- [x] New `test` Django app is registered. Evidence: `cvat/apps/test/`,
  `cvat/settings/base.py`, and `cvat/urls.py`.
- [ ] Focused backend tests pass. Evidence: blocked because the local Python
  environment does not have Django dependencies installed.
- [x] Authenticated endpoint returns database-derived per-label counts.
  Evidence: `cvat/apps/test/views.py`; Python compilation passes.
- [ ] Anonymous and unauthorized task requests are refused in a live check.
  Evidence: authorization code is present; Docker/OPA verification is pending.
- [x] UI page calls the endpoint and renders a graph. Evidence:
  `cvat-ui/src/components/analytics-report/annotation-count-chart.tsx`.
- [x] UI has explicit loading, no-data, and failed-request states. Evidence:
  the same chart component; browser verification is pending.
- [ ] One additional grouping/filter is implemented or explicitly reported as
  unfinished. Evidence: pending implementation review.
- [ ] Objective MO-1 is measured with five raw timings, median, and spread.
  Evidence: pending local Docker stack.
- [ ] Objective MO-2 is checked against an imported sample with task id and
  raw response. Evidence: pending COCO import.
- [ ] Every unfinished requirement is listed honestly, including WebSocket
  updates/reconnect handling if not completed.
- [ ] Final diff has no dead code, debug files, or unrelated changes.
