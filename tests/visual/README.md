Baselines are generated inside the Playwright container so they match CI:

    docker run --rm -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v1.63.0-noble \
      sh -c 'npm ci && npx playwright test --update-snapshots'
