# SvelteKit Demo

Example SvelteKit app using `@captchacat/svelte`.

## Run

```bash
# From this directory
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Structure

```
src/routes/
├── +page.svelte      # Form with Captchacat component
└── api/login/
    └── +server.ts    # Server-side token validation
```

## Configuration

Update these values in the code:

- `+page.svelte`: `siteKey="your-site-key"`
- `+server.ts`: `apiKey: "your-api-key"`
