export interface FontPreconnect {
  href: string;
  crossOrigin?: boolean;
}

/** Injects Google Fonts `<link>` tags once, keyed by `linkId` (idempotent). */
export function loadGoogleFonts(
  stylesheetHref: string,
  linkId: string,
  preconnects: FontPreconnect[],
): void {
  if (document.getElementById(linkId)) return;

  const preconnectLinks = preconnects.map(({ href, crossOrigin }) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    if (crossOrigin) link.crossOrigin = 'anonymous';
    return link;
  });

  const stylesheet = document.createElement('link');
  stylesheet.id = linkId;
  stylesheet.rel = 'stylesheet';
  stylesheet.href = stylesheetHref;

  document.head.append(...preconnectLinks, stylesheet);
}
