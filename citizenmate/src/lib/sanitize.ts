import sanitizeHtml from 'sanitize-html';

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}

export function sanitizeSeoTitle(value: string | null | undefined): string | null {
  if (!value) return null;
  return stripHtml(value).slice(0, 70) || null;
}

export function sanitizeSeoDescription(value: string | null | undefined): string | null {
  if (!value) return null;
  return stripHtml(value).slice(0, 200) || null;
}

export function sanitizeSeoKeywords(value: string | null | undefined): string | null {
  if (!value) return null;
  return stripHtml(value);
}

export function sanitizeOgImageUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function sanitizeBlogContent(content: string | null | undefined): string | null {
  if (!content) return null;
  return sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'h1', 'h2', 'h3', 'span', 'quizcta',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'id', 'data-component', 'data-title', 'data-text', 'style'],
      a: ['href', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}
