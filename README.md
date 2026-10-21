# Web of Babel

Made at HackUPC Fall 2017.

A static site: no server, no build step. Photos you take or upload stay in the browser.

## Run locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. The camera needs `localhost` or HTTPS.

## Deploy to Vercel

Import the repo in Vercel with the "Other" framework preset and no build command, or run `npx vercel` from the repo root.
