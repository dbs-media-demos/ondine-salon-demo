/**
 * A preview business's own logo (from the CRM, already sanitised there): `<svg viewBox>` with a
 * `<g data-part="mark">` (stroked shapes) and a `<g data-part="word">` (the name), ink in currentColor.
 * Prepared once on the server so the same markup serves the page loader, the header and the footer.
 */
export type LeadLogoMarkup = { svg: string; aspect: number };

const SHAPES = /<(path|circle|rect|line|polyline|polygon|ellipse)\b(?![^>]*\bpathLength=)/gi;

export function prepLeadLogo(raw: string): LeadLogoMarkup {
  let svg = raw.trim();
  // Sized by its wrapper (aspect-ratio from the viewBox), never by its own width/height
  svg = svg.replace(/^<svg\b([^>]*)>/i, (_, attrs: string) => {
    let a = attrs.replace(/\s(width|height)\s*=\s*("[^"]*"|'[^']*')/gi, "");
    if (!/\bpreserveAspectRatio=/i.test(a)) a += ' preserveAspectRatio="xMinYMid meet"';
    return `<svg${a} aria-hidden="true" focusable="false">`;
  });
  // The loader draws the mark's outlines with stroke-dashoffset, so each of its shapes measures 1
  const markAt = svg.search(/<g\b[^>]*data-part=["']mark["']/i);
  if (markAt >= 0) {
    const wordAt = svg.search(/<g\b[^>]*data-part=["']word["']/i);
    const end = wordAt > markAt ? wordAt : svg.length;
    svg = svg.slice(0, markAt) + svg.slice(markAt, end).replace(SHAPES, '<$1 pathLength="1"') + svg.slice(end);
  }
  const vb = /viewBox\s*=\s*["']\s*[-\d.e]+[\s,]+[-\d.e]+[\s,]+([\d.e]+)[\s,]+([\d.e]+)/i.exec(svg);
  const w = vb ? Number(vb[1]) : 0;
  const h = vb ? Number(vb[2]) : 0;
  const aspect = w > 0 && h > 0 ? Math.min(12, Math.max(0.5, w / h)) : 4;
  return { svg, aspect: Math.round(aspect * 1000) / 1000 };
}
