# @byebot/svelte

Svelte/SvelteKit integration for Byebot.

GitHub: https://github.com/ByeBot-Integrations/Svelte

## Installation

```bash
npm install @byebot/svelte
```

## Usage

### Basic Form (Recommended)

The captcha token is automatically added as a hidden `byebot-token` field when the user completes verification.

```svelte
<script>
  import { Byebot } from '@byebot/svelte';
</script>

<form action="/api/login" method="POST">
  <input name="email" type="email" />
  <input name="password" type="password" />
  <Byebot siteKey="your-site-key" />
  <button type="submit">Login</button>
</form>
```

### With Callback (Optional)

Use `on:verify` if you need to know when verification completes (e.g., enable submit button).

```svelte
<script lang="ts">
  import { Byebot } from '@byebot/svelte';

  let isVerified = false;

  function handleVerify(event: CustomEvent<string>) {
    console.log('Token:', event.detail);
    isVerified = true;
  }
</script>

<Byebot siteKey="your-site-key" on:verify={handleVerify} />
<button disabled={!isVerified}>Submit</button>
```

## Server-Side Validation

Validate the `byebot-token` from the form submission:

```typescript
// src/routes/api/login/+server.ts
import { validateByebotToken } from "@byebot/svelte/server";
import { json, error } from "@sveltejs/kit";

export const POST = async ({ request }) => {
  const formData = await request.formData();
  const token = formData.get("byebot-token") as string;

  const result = await validateByebotToken({
    apiKey: process.env.BYEBOT_API_KEY!,
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

### `<Byebot />`

| Prop      | Type     | Required | Description                      |
| --------- | -------- | -------- | -------------------------------- |
| `siteKey` | `string` | Yes      | Your site key from the dashboard |

| Event    | Payload  | Description                     |
| -------- | -------- | ------------------------------- |
| `verify` | `string` | Emitted on verification success |

### `validateByebotToken(options)`

| Option   | Type     | Required |
| -------- | -------- | -------- |
| `apiKey` | `string` | Yes      |
| `token`  | `string` | Yes      |

Returns: `Promise<{ valid: boolean, message?: string, rawResponse?: unknown }>`
