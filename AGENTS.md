# Agent Notes

## Toolchain
- Use Node 22+, pnpm 9, JDK 21, and the Android SDK for native Android work; CI installs with `pnpm install --frozen-lockfile`.
- Root dependency source of truth is `pnpm-lock.yaml`; `nostr-sample-app/package-lock.json` belongs to the sample app and does not make the root an npm-lock repo.
- Capacitor is 8.x: Android uses compile/target SDK 36, min SDK 24, AGP 8.13.0, Gradle 8.14.3; iOS deployment target is 15.0.

## Commands
- Install root deps: `pnpm install --frozen-lockfile`.
- TS/Jest tests: `pnpm test:ts`; focused TS test: `pnpm exec jest src/__tests__/index.test.ts`.
- Android unit tests: `pnpm test:android`; focused Robolectric class from `android/`: `./gradlew testDebugUnitTest --tests social.nostr.signer.NostrSignerRobolectricTest --no-daemon --stacktrace --info --console=plain`.
- Web build/package output: `pnpm build` writes `dist/esm`, `dist/plugin.js`, and `dist/plugin.cjs.js`.
- Full local verification: `pnpm verify` runs iOS `xcodebuild`, Android `clean build test`, then web build; it needs Xcode for the iOS step.
- Lint/format: `pnpm lint` and `pnpm fmt`; both invoke `node-swiftlint` in addition to ESLint/Prettier.
- API docs are not part of `pnpm build`; run `pnpm docgen` when changing the plugin API docs in `README.md`/`dist/docs.json`.

## Architecture
- Public JS API is in `src/index.ts`; public/native bridge types are in `src/definitions.ts`.
- Trust `src/index.ts` over the README/sample app for call signatures if they differ; the current wrapper exposes positional methods such as `signEvent(packageName, eventJson, id, npub)`, while some prose/sample snippets still show object-style calls.
- The JS wrapper intentionally throws `ANDROID_ONLY` on non-Android platforms; the iOS Swift target is still the Capacitor template echo stub.
- Android native code lives under `android/src/main/java/social/nostr/signer/`; `NostrSignerPlugin.java` is the Capacitor bridge and `NostrSigner.java` contains NIP-55 ContentResolver/intent logic.
- Android operations try the signer ContentProvider first when a package name is known, return `REJECTED` as a hard rejection, and fall back to `nostrsigner:` intents only when the provider is unavailable.
- `getPublicKey` returns `{ pubkey, package }`; `pubkey` is lowercase hex. Do not treat it as an `npub` or re-decode it.

## Tests And Fixtures
- Jest only matches `src/__tests__/**/*.test.ts` per `jest.config.js`.
- Android unit tests are Robolectric tests under `android/src/test/java/social/nostr/signer/`; `TestCursorProvider` and `TestRejectedCursorProvider` simulate signer ContentProvider responses.
- Android Gradle depends on `../node_modules/@capacitor/android/capacitor` via `android/settings.gradle`, so install root JS deps before running Gradle.

## Sample App
- `nostr-sample-app/` is a separate Svelte/Vite demo app with its own package manifest and Capacitor config; root ESLint ignores it.
- The sample app depends on this plugin via `file:../../nostr-signer-capacitor-plugin`; rebuild/reinstall there if testing packaged changes through the demo.
