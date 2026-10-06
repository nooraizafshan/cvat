# Definition of Done: Annotation Analytics

- [x] Repository is on `dev-test01` at commit
  `98ee84d0fb5f677d31acf71ec5f797f560f00f5f`.
- [x] Plan is present under `docs/assessment/` before implementation.
- [ ] New `test` Django app is registered and the focused backend tests pass.
  Evidence: pending implementation and test output.
- [ ] Authenticated endpoint returns database-derived per-label counts.
  Evidence: pending live request response.
- [ ] Anonymous and unauthorized task requests are refused.
  Evidence: pending focused tests and live checks.
- [ ] UI page calls the endpoint and renders a graph.
  Evidence: pending browser capture/recording.
- [ ] UI has explicit loading, no-data, and failed-request states.
  Evidence: pending browser checks.
- [ ] One additional grouping/filter is implemented or explicitly reported as
  unfinished. Evidence: pending implementation review.
- [ ] Objective MO-1 is measured with five raw timings, median, and spread.
  Evidence: pending local Docker stack.
- [ ] Objective MO-2 is checked against an imported sample with task id and
  raw response. Evidence: pending COCO import.
- [ ] Every unfinished requirement is listed honestly, including WebSocket
  updates/reconnect handling if not completed.
- [ ] Final diff has no dead code, debug files, or unrelated changes.
