// const urlRedirects = {
//   screenshare: "classroom",
// };

const urlMap = new Map([["screenshare", "classroom"]]);

export async function redirectOldUrls({ event, resolve }) {
  // export const handle = async ({ event, resolve }) => {
  // for (const [key, value] of Object.entries(urlRedirects)) {
  for (const [key, value] of urlMap) {
    if (event.url.pathname === `/${key}`) {
      return Response.redirect(`${event.url.origin}/${value}`, 301);
    }
  }

  return await resolve(event);
}

// This hook function — with 'transformPage' updated to 'transformPageChunk' — as provided by mihaon on 'https://github.com/sveltejs/svelte/issues/7444' fixes duplicate meta tags when starting with an SSR loaded page; I first surmised this could be a SSR/SSG-related issue  when starting with non-SSR route '/classroom' and no meta tag duplication persisted upon route changes
// export const handle = async ({ event, resolve }) => {
export async function metaTagFixWhenSSR({ event, resolve }) {
  function htmlTransformer({ html }) {
    return html
      .replace(/<link\s+rel="canonical"[^>]*>/, "")
      .replace(/<meta\s+name="description"[^>]*>/, "")
      .replace(/<meta\s+name="keywords"[^>]*>/, "")
      .replace(/<meta\s+property="og:url"[^>]*>/, "")
      .replace(/<meta\s+property="og:title"[^>]*>/, "")
      .replace(/<meta\s+property="og:image"[^>]*>/, "")
      .replace(/<meta\s+property="og:description"[^>]*>/, "");
  }

  return await resolve(event, { transformPageChunk: htmlTransformer });
}

import { sequence } from "@sveltejs/kit/hooks";
export const handle = sequence(metaTagFixWhenSSR, redirectOldUrls);
