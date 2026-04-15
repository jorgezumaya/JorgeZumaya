# Setup & Deployment

## 1. Install Firebase dependencies
```bash
npm install firebase @angular/fire
npm install -D firebase-tools
```

## 2. Merge app.config.ts
Open `src/app/app.config.ts` (created by `ng new`) and merge in the providers from
`src/app/app.config.ts.example`. Then delete the `.example` file.

## 3. Add Firebase config
- Go to Firebase Console → Project Settings → General → Your apps → Web app
- Copy the config object into `src/environments/environment.ts` and `environment.prod.ts`
- Replace all `REPLACE_ME` values

## 4. Update .firebaserc
Set the `default` project ID to your Firebase project ID.

## 5. Update angular.json
Ensure these in `projects.<your-project>.architect.build`:
- `outputPath`: `dist/jorgezumaya` (or update `firebase.json` public path to match)
- Add file replacements for prod build if not present:
  ```json
  "configurations": {
    "production": {
      "fileReplacements": [
        { "replace": "src/environments/environment.ts", "with": "src/environments/environment.prod.ts" }
      ]
    }
  }
  ```

## 6. Update src/styles.scss (entry stylesheet)
Add at the top:
```scss
@use './styles/tokens';
@use './styles/reset';
```

## 7. Add fonts to src/index.html
Inside `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
```

## 8. Drop logo SVGs
Put logo SVGs into `src/assets/logo/`.

## 9. GitHub Actions secrets
In GitHub repo → Settings → Secrets → Actions, add:
- `FIREBASE_SERVICE_ACCOUNT` — JSON from Firebase Console → Project Settings → Service accounts → Generate key
- `FIREBASE_PROJECT_ID` — your Firebase project ID

## 10. Cloudflare DNS
Point `jorgezumaya.me` at Firebase Hosting:
1. In Firebase Console → Hosting → Add custom domain → enter `jorgezumaya.me`
2. Firebase gives you two A records — add them in Cloudflare DNS as **DNS only** (gray cloud)
3. SSL/TLS mode: Full (Strict)
4. After cert provisions (~24h), optionally flip to proxied

## 11. Firebase project setup
```bash
firebase login
firebase use --add   # select your project, alias as "default"
firebase deploy --only firestore:rules,storage:rules
```

## 12. Deploy
Push to `main` → GitHub Actions deploys automatically.
Or manually: `npm run build && firebase deploy --only hosting`
