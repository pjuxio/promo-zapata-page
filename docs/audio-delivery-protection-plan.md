# Audio Delivery Protection Plan (Netlify + CDN)

This document captures the recommended plan to reduce MP3 bandwidth abuse while keeping the site simple to operate.

## Goal

- Keep the site hosted on Netlify.
- Add CDN-level protection for audio traffic.
- Reduce bandwidth costs from hotlinking and bot abuse.
- Preserve a smooth listener experience.

## Architecture

- Origin hosting: Netlify
- Edge/CDN and protection: Cloudflare
- Protected path: `/mp3/*`

## Phase 1 (Low Effort, High Value)

Implement these first:

1. Put the domain behind Cloudflare proxy.
2. Add a cache rule for `/mp3/*` with aggressive edge caching.
3. Add hotlink protection for `/mp3/*`:
   - Allow requests where `Referer` includes `findingzapata.com`.
   - Block or challenge requests missing/invalid referer (tune as needed).
4. Add a rate-limit rule for `/mp3/*`:
   - Challenge clients that request too many audio files in a short window.
5. Enable bot mitigation/WAF protections at Cloudflare.
6. Add bandwidth spike alerts and monitor transfer analytics.

Expected result: meaningful reduction in casual hotlinking and scripted abuse with minimal code changes.

## Phase 2 (Stronger Protection)

If Phase 1 is not enough, add signed URLs for audio:

1. Client requests a short-lived signed URL for each track.
2. Token includes expiry and track path.
3. Cloudflare Worker validates token before serving `/mp3/*`.
4. Invalid or expired tokens are denied.

Expected result: stronger access control than referer checks, better abuse resistance.

## Operational Notes

- This is not DRM. Public browser playback can still be captured by determined users.
- Ensure Range requests are supported so seeking works correctly.
- Keep `preload="none"` in the player to avoid unnecessary prefetching.
- Tune challenge thresholds to avoid hurting normal listeners.

## Rollout Plan

1. Launch Phase 1 rules.
2. Observe 2-4 weeks of traffic and bandwidth trends.
3. If needed, implement Phase 2 signed URLs.

## Success Metrics

- Reduced monthly transfer for `/mp3/*`.
- Fewer suspicious high-frequency requests.
- No major listener UX regressions.

## Decision Log

- Current approach: Start with Phase 1.
- Trigger for Phase 2: Continued abusive transfer patterns or unacceptable bandwidth cost.
