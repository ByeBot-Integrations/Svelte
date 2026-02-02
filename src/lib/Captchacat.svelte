<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import './global.d.ts';

  const BASE_URL = 'https://challenge.captchacat.com';

  export let siteKey: string;

  const dispatch = createEventDispatcher<{ verify: string }>();

  let containerRef: HTMLDivElement;
  let callbackName = '';

  onMount(() => {
    // Generate unique callback name
    callbackName = `captchacat_cb_${Math.random().toString(36).substring(7)}`;

    // Set up global callback bridge
    window[callbackName] = (token: string) => {
      dispatch('verify', token);
    };

    // Load widget script if not present
    const scriptUrl = `${BASE_URL}/ray/widget.js`;

    const handleInit = () => {
      if (window.Captchacat?.render && containerRef) {
        window.Captchacat.render(containerRef);
      }
    };

    let script = document.querySelector(
      `script[src="${scriptUrl}"]`
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.onload = handleInit;
      document.body.appendChild(script);
    } else {
      // Script exists - check if already loaded
      if (window.Captchacat) {
        handleInit();
      } else {
        script.addEventListener('load', handleInit);
      }
    }
  });

  onDestroy(() => {
    // Cleanup: remove global callback
    if (callbackName && typeof window !== 'undefined') {
      delete window[callbackName];
    }

    // Clean up container innerHTML to prevent ghost iframes
    if (containerRef) {
      containerRef.innerHTML = '';
    }
  });

  // Reactive statement to handle siteKey changes
  $: if (siteKey && typeof window !== 'undefined' && window.Captchacat?.render && containerRef) {
    containerRef.innerHTML = '';
    window.Captchacat.render(containerRef);
  }
</script>

<div
  bind:this={containerRef}
  class="captcha-widget"
  data-sitekey={siteKey}
  data-token-callback={callbackName}
  style="min-height: 48px;"
></div>
