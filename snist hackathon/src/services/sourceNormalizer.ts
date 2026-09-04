import { URL } from "url";

const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
  "ref",
  "ref_src",
  "ref_url",
  "source",
  "spm",
  "track",
]);

export function normalizeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);

    // Remove tracking parameters
    const paramsToDelete: string[] = [];
    url.searchParams.forEach((_value, key) => {
      if (TRACKING_PARAMS.has(key.toLowerCase())) {
        paramsToDelete.push(key);
      }
    });
    paramsToDelete.forEach((p) => url.searchParams.delete(p));

    // Remove trailing slash (except root)
    let pathname = url.pathname;
    if (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }

    // Remove hash
    url.hash = "";

    // Rebuild
    const search = url.searchParams.toString();
    return `${url.protocol}//${url.hostname}${pathname}${search ? "?" + search : ""}`;
  } catch {
    return rawUrl;
  }
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function getAuthorityScore(domain: string): number {
  const highAuthority = [
    "github.com",
    "arxiv.org",
    "scholar.google.com",
    "devpost.com",
    "producthunt.com",
    "angel.co",
    "crunchbase.com",
  ];
  const mediumAuthority = [
    "medium.com",
    "dev.to",
    "reddit.com",
    "stackoverflow.com",
    "linkedin.com",
    "techcrunch.com",
    "forbes.com",
  ];

  if (highAuthority.some((d) => domain.includes(d))) return 0.9;
  if (mediumAuthority.some((d) => domain.includes(d))) return 0.6;
  if (domain.endsWith(".com") || domain.endsWith(".io")) return 0.5;
  return 0.3;
}
