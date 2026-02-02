# @captchacat/svelte

Svelte/SvelteKit integration for Captchacat.

GitHub: https://github.com/Captchacat-Integrations/Svelte

## Installation

```bash
npm install @captchacat/svelte
```

## Usage

### Basic Form (Recommended)

The captcha token is automatically added as a hidden `captchacat-token` field when the user completes verification.

```svelte
<script>
  import { Captchacat } from '@captchacat/svelte';
</script>

<form action="/api/login" method="POST">
  <input name="email" type="email" />
  <input name="password" type="password" />
  <Captchacat siteKey="your-site-key" />
  <button type="submit">Login</button>
</form>
```

### With Callback (Optional)

Use `on:verify` if you need to know when verification completes (e.g., enable submit button).

```svelte
<script lang="ts">
  import { Captchacat } from '@captchacat/svelte';

  let isVerified = false;

  function handleVerify(event: CustomEvent<string>) {
    console.log('Token:', event.detail);
    isVerified = true;
  }
</script>

<Captchacat siteKey="your-site-key" on:verify={handleVerify} />
<button disabled={!isVerified}>Submit</button>
```

## Server-Side Validation

Validate the `captchacat-token` from the form submission:

```typescript
// src/routes/api/login/+server.ts
import { validateCaptchacatToken } from "@captchacat/svelte/server";
import { json, error } from "@sveltejs/kit";

export const POST = async ({ request }) => {
  const formData = await request.formData();
  const token = formData.get("captchacat-token") as string;

  const result = await validateCaptchacatToken({
    apiKey: process.env.CAPTCHACAT_API_KEY!,
    token,
  });

  if (!result.valid) {
    throw error(403, "Captcha failed");
  }

  // Captcha valid - proceed with login
  const email = formData.get("email");
  const password = formData.get("password");
  // ...

  return json({ success: true });
};
```

## API

### `<Captchacat />`

| Prop      | Type     | Required | Description                      |
| --------- | -------- | -------- | -------------------------------- |
| `siteKey` | `string` | Yes      | Your site key from the dashboard |

| Event    | Payload  | Description                     |
| -------- | -------- | ------------------------------- |
| `verify` | `string` | Emitted on verification success |

### `validateCaptchacatToken(options)`

| Option   | Type     | Required |
| -------- | -------- | -------- |
| `apiKey` | `string` | Yes      |
| `token`  | `string` | Yes      |

Returns: `Promise<{ valid: boolean, message?: string, rawResponse?: unknown }>`
