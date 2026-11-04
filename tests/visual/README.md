- Baselines in `__screenshots__/` are generated only inside the Playwright container CI uses (the image tagged with the locked `@playwright/test` version), never on the Mac:

      docker run --rm -v "$PWD":/work -w /work \
        mcr.microsoft.com/playwright:v$(jq -r '.packages["node_modules/@playwright/test"].version' package-lock.json)-noble \
        sh -c 'npm ci && npx playwright test --update-snapshots'
