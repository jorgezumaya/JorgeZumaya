# Infrastructure & Firebase Setup

## Firebase Project
- **Project ID**: `jorgezumaya-portfolio`
- **Services**: Hosting, Firestore, Storage, App Check (reCAPTCHA v3), Extensions

## Firestore Schema

### `contactSubmissions/{autoId}`
| Field | Type | Notes |
|-------|------|-------|
| `name` | string | |
| `email` | string | |
| `subject` | string | |
| `message` | string | |
| `createdAt` | timestamp | |
| `userAgent` | string | client-set |
| `ipHash` | string | set via Cloud Function |

### `gallery/{photoId}`  _(metadata only — files live in Storage)_
| Field | Type | Notes |
|-------|------|-------|
| `storagePath` | string | path in Storage |
| `caption` | string | |
| `takenAt` | timestamp | |
| `order` | number | display sort order |
| `tags` | string[] | |

## Firebase Storage Layout
```
/gallery/original/{photoId}.jpg     # source upload
/gallery/large/{photoId}.webp       # 1200w (auto-generated)
/gallery/thumb/{photoId}.webp       # 400w  (auto-generated)
```
Resizing handled by the **Resize Images** Firebase Extension — generates WebP variants on upload automatically.

## Security Rules (high level)

**Firestore**
- `gallery` → public read, no client write
- `contactSubmissions` → no read, create-only with schema validation + App Check required

**Storage**
- `/gallery/**` → public read, no client write

## Firebase Extensions to Enable
1. `storage-resize-images` — auto WebP variants on upload
2. `firestore-send-email` — emails Jorge on new contact submissions (paired with SendGrid free tier)

## Cloudflare + Domain
- Domain: `jorgezumaya.me` (Cloudflare Registrar)
- DNS: two A records from Firebase Hosting console
- SSL: Full (Strict) — Firebase provides cert
- Proxy: DNS-only (gray cloud) during cert provisioning → flip to proxied after
- Enable: Bot Fight Mode, Always Use HTTPS, Auto Minify (CSS/JS)

## Environment Files
Firebase config goes in `src/environments/environment.ts` (never hardcoded elsewhere):
```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: '...',
    authDomain: '...',
    projectId: 'jorgezumaya-portfolio',
    storageBucket: '...',
    messagingSenderId: '...',
    appId: '...',
  },
  recaptchaSiteKey: '...',
};
```

## CI/CD — GitHub Actions

### PR Preview (`.github/workflows/pr-preview.yml`)
Trigger: pull_request
Steps: install → lint → test → build → deploy to Firebase preview channel (auto-expires 7d) → comment preview URL on PR

### Deploy to Live (`.github/workflows/deploy.yml`)
Trigger: push to `main`
Steps: install → lint → test → build (production) → Lighthouse CI (fail if perf < 90) → deploy to Firebase Hosting live

**GitHub Secrets needed**:
- `FIREBASE_SERVICE_ACCOUNT` (JSON key)
- `FIREBASE_PROJECT_ID`

## Analytics + Monitoring
- **Analytics**: Plausible (privacy-friendly, $9/mo) or GA4 (free) — TBD
- **Error monitoring**: Sentry free tier
- **Perf gate**: Lighthouse CI in PRs (score threshold: 90)
