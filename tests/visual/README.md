- Baselines in `__screenshots__/` are generated only inside the Playwright container CI uses (`container:` in `.github/workflows/ci.yml`), never on the Mac:

      docker run --rm -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v1.63.0-noble \
        sh -c 'npm ci && npx playwright test --update-snapshots'

- Keep the image tag on the `@playwright/test` version in `package-lock.json`.
