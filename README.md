# Jorge Zumaya — Personal Website

A personal website for Jorge Zumaya, built with **Angular 21** (SSR), hosted on **Firebase Hosting** with a custom domain, and powered by **Google Firebase services**.

## Tech Stack

- **Framework:** Angular 21 with Server-Side Rendering (SSR)
- **Hosting:** Firebase Hosting (custom domain)
- **Backend / Services:** Firebase (Authentication, Firestore, Storage, etc.)
- **Styling:** CSS
- **Routing:** Angular Router

## Firebase Setup

This project uses Firebase for hosting and Google services integration. To connect:

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login and initialize:
   ```bash
   firebase login
   firebase init
   ```
3. Deploy:
   ```bash
   ng build && firebase deploy
   ```

## Development

Start the local dev server:
```bash
ng serve
```
Navigate to `http://localhost:4200/`. The app reloads automatically on file changes.

For SSR dev server:
```bash
ng serve --ssr
```

## Build

```bash
ng build
```
Build artifacts are stored in `dist/`. Production builds are optimized for performance.

## Testing

Unit tests:
```bash
ng test
```

## Project Structure

```
src/
├── app/
│   ├── app.ts              # Root component
│   ├── app.routes.ts       # Client-side routes
│   ├── app.routes.server.ts # Server-side routes
│   ├── app.config.ts       # App configuration
│   └── app.config.server.ts # SSR configuration
├── main.ts                 # Client entry point
├── main.server.ts          # Server entry point
└── server.ts               # Express SSR server
```

## Deployment

Hosted on Firebase Hosting with a custom domain. CI/CD and deployment details to be added as the project evolves.
