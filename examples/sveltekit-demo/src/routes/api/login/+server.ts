import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateCaptchacatToken } from '@captchacat/svelte/server';

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();

  const username = formData.get('username') as string;
  const token = formData.get('captchacat-token') as string;

  if (!token) {
    throw error(400, { message: 'Captcha token missing' });
  }

  const result = await validateCaptchacatToken({
    apiKey: 'd4d23b11b464dcc984ad',
    token,
  });

  if (!result.valid) {
    throw error(403, { message: result.message || 'Captcha validation failed' });
  }

  return json({ success: true, username });
};
