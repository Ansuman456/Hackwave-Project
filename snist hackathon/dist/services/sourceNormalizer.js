"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUrl = normalizeUrl;
exports.extractDomain = extractDomain;
exports.getAuthorityScore = getAuthorityScore;
const url_1 = require("url");
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
function normalizeUrl(rawUrl) {
    try {
        const url = new url_1.URL(rawUrl);
        // Remove tracking parameters
        const paramsToDelete = [];
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
    }
    catch {
        return rawUrl;
    }
}
function extractDomain(url) {
    try {
        return new url_1.URL(url).hostname.replace(/^www\./, "");
    }
    catch {
        return "";
    }
}
function getAuthorityScore(domain) {
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
    if (highAuthority.some((d) => domain.includes(d)))
        return 0.9;
    if (mediumAuthority.some((d) => domain.includes(d)))
        return 0.6;
    if (domain.endsWith(".com") || domain.endsWith(".io"))
        return 0.5;
    return 0.3;
}
//# sourceMappingURL=sourceNormalizer.js.map