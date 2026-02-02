<script lang="ts">
  import { Captchacat } from '@captchacat/svelte';

  let username = '';
  let password = '';
  let result: string | null = null;
  let isVerified = false;
  let captchaToken: string | null = null;

  function handleVerify(event: CustomEvent<string>) {
    isVerified = true;
    captchaToken = event.detail;
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    if (captchaToken) {
      formData.append('captchacat-token', captchaToken);
    }

    const res = await fetch('/api/login', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      result = `Success! Welcome, ${data.username}`;
    } else {
      result = `Error: ${data.message || 'Unknown error'}`;
    }
  }
</script>

<main class="main">
  <h1 class="page-title">Captchacat - SvelteKit Demo</h1>

  <div class="container">
    <form on:submit={handleSubmit} class="form">
      <input
        bind:value={username}
        name="username"
        type="text"
        placeholder="Username"
        required
        class="input"
      />
      <input
        bind:value={password}
        name="password"
        type="password"
        placeholder="Password"
        required
        class="input"
      />

      <Captchacat siteKey="bd1cc81b04564d3f899e" on:verify={handleVerify} />

      <div class="status-row">
        <span class="status-dot" class:verified={isVerified}></span>
        <span class="status-text">
          {isVerified ? 'Verified' : 'Not verified'}
        </span>
      </div>

      <button type="submit" class="button">Submit</button>
    </form>

    {#if result}
      <p class="result" class:error={result.startsWith('Error')}>
        {result}
      </p>
    {/if}
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  .main {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
    padding: 3rem 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .page-title {
    color: #fff;
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin: 0 0 2rem 0;
  }

  .container {
    width: 100%;
    max-width: 360px;
    background: #1e1e2e;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .input {
    width: 100%;
    padding: 0.7rem 0.9rem;
    background: #2a2a3e;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: #fff;
    font-size: 0.95rem;
    outline: none;
    box-sizing: border-box;
  }

  .input:focus {
    border-color: #6366f1;
  }

  .input::placeholder {
    color: #64748b;
  }

  .button {
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border: none;
    border-radius: 6px;
    color: #fff;
    font-size: 0.95rem;
    font-weight: 600;
    margin-top: 0.5rem;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .button:hover {
    opacity: 0.9;
  }

  .status-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #64748b;
  }

  .status-dot.verified {
    background: #10b981;
  }

  .status-text {
    color: #94a3b8;
    font-size: 0.8rem;
  }

  .result {
    margin-top: 1rem;
    font-size: 0.85rem;
    text-align: center;
    color: #10b981;
  }

  .result.error {
    color: #ef4444;
  }
</style>
