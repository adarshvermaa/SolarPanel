# CI Checklist

## Automated Checks
Run these commands locally before pushing:

- [ ] **Linting**: `npm run lint` (Ensure 0 errors)
- [ ] **Type Checking**: `npx tsc --noEmit` (Ensure 0 errors)
- [ ] **Unit Tests**: `npm run test` (Minimum 80% coverage)
- [ ] **Build**: `npm run build` (Must pass without errors)
- [ ] **E2E Tests**: `npx playwright test` (All scenarios pass)

## Performance & Accessibility
- [ ] **Lighthouse**: `npx lighthouse <url> --view`
  - Performance > 90
  - Accessibility > 95
  - Best Practices > 95
  - SEO > 100

## GitHub Actions Example
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
```
