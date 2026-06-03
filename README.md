# Nostr Signer Capacitor Plugin

This Capacitor plugin allows your application to interact with Nostr signer apps on the Android platform using intents, following the [NIP-55](https://github.com/nostr-protocol/nips/blob/master/55.md) specification.

## Install

```bash
npm install capacitor-plugin-nostr-signer
npx cap sync
```

## Requirements

- Android: minSdkVersion 24 or higher.
- iOS: deployment target 15.0 or higher.
- Java 21 (JDK 21) for building Android with Gradle.
- Node.js 22 or higher.
- Capacitor 8.x.

## Version

Current version: 0.1.0

### 0.1.0 (2026-05-14)

- Upgraded plugin metadata and native build configuration for Capacitor 8.
- Updated sample app Capacitor dependencies to 8.x.
- Bumped Android `versionName` to `0.1.0` and `versionCode` to `6`.

### Capacitor 8 compatibility

- Targets Capacitor 8 because the v8 Swift Package Manager dependency cannot also resolve Capacitor 7.
- Uses Android compileSdk/targetSdk 36, minSdk 24, AGP 8.13.0, and Gradle 8.14.3.
- Uses iOS deployment target 15.0 and Capacitor SPM dependency 8.0.0+.

### 0.0.5 (2025-09-22)

- Bumped Android `minSdkVersion` to 23 to align with Capacitor Android requirements.
- Added Android unit tests (Robolectric) covering Content Resolver flows and rejected-provider fallback.
- Added npm scripts:
  - `test:ts` – runs TypeScript/Jest tests
  - `test:android` – runs Android unit tests (`testDebugUnitTest`)
  - `test:all` (default `npm test`) – runs both suites
- Added GitHub Actions workflow at `.github/workflows/ci.yml` to run JS and Android unit tests in CI.

## Testing

Run TypeScript tests:

```bash
npm run test:ts
```

Run Android unit tests:

```bash
cd android
./gradlew clean testDebugUnitTest --no-daemon --stacktrace --info --console=plain
```

Run all tests:

```bash
npm test
```

## Usage

### Import the Plugin

```typescript
import NostrSignerPlugin from 'capacitor-plugin-nostr-signer';
```

### Set the Signer Package Name

Before using the plugin on Android, you need to set the package name of the external signer app.

```typescript
await NostrSignerPlugin.setPackageName({ packageName: 'com.example.signer' });
```

### Check if External Signer is Installed

```typescript
const { installed } = await NostrSignerPlugin.isExternalSignerInstalled();
if (!installed) {
  console.log('External signer app is not installed.');
}
```

### Get a List of Installed External Signers

```typescript
try {
  const result = await NostrSignerPlugin.getInstalledSignerApps();
  signerApps = result.apps;
  console.log('Installed Signer Apps:', signerApps);
} catch (error) {
  console.error('Error getting installed signer apps:', error);
}
```

The AppInfo object has the following fields"

```typescript
export interface AppInfo {
  name: string; // The name of the app as it appears in the System launcher
  packageName: string; // The package name of the app - pass this to setPackageName
  iconData: string; // the base 64 encoded string of the app's icon
  iconUrl: string; // the url to app's icon
}
```

### Get Public Key

```typescript
try {
  const { pubkey } = await NostrSignerPlugin.getPublicKey();
  console.log('Public Key (hex):', pubkey);
} catch (error) {
  console.error('Error getting public key:', error);
}
```

### Sign Event

```typescript
const event = {
  kind: 1,
  content: 'Hello, Nostr!',
  tags: [],
  created_at: Math.floor(Date.now() / 1000),
};

try {
  const { event: signedEventJson } = await NostrSignerPlugin.signEvent(
    'com.example.signer',
    JSON.stringify(event),
    'request-id',
    pubkey,
  );
  const signedEvent = JSON.parse(signedEventJson);
  console.log('Signed Event:', signedEvent);
} catch (error) {
  console.error('Error signing event:', error);
}
```

### Sign PSBT

`pubkey` must be the current user's lowercase hex public key, such as the value returned by `getPublicKey()`. It is not an `npub`.

```typescript
try {
  const { result: signedPsbtHex } = await NostrSignerPlugin.signPsbt(
    'com.example.signer',
    psbtHex,
    'request-id',
    pubkey,
  );
  console.log('Signed PSBT:', signedPsbtHex);
} catch (error) {
  console.error('Error signing PSBT:', error);
}
```

### NIP-04 Encrypt

```typescript
try {
  const { result: encryptedText } = await NostrSignerPlugin.nip04Encrypt(
    'com.example.signer',
    'Secret message',
    'request-id',
    'recipient_public_key',
    pubkey,
  );
  console.log('Encrypted Text:', encryptedText);
} catch (error) {
  console.error('Error encrypting message:', error);
}
```

### NIP-04 Decrypt

```typescript
try {
  const { result: decryptedText } = await NostrSignerPlugin.nip04Decrypt(
    'com.example.signer',
    'encrypted_text',
    'request-id',
    'sender_public_key',
    pubkey,
  );
  console.log('Decrypted Text:', decryptedText);
} catch (error) {
  console.error('Error decrypting message:', error);
}
```

### NIP-44 Encrypt

```typescript
try {
  const { result: encryptedText } = await NostrSignerPlugin.nip44Encrypt(
    'com.example.signer',
    'Secret message',
    'request-id',
    'recipient_public_key',
    pubkey,
  );
  console.log('Encrypted Text (NIP-44):', encryptedText);
} catch (error) {
  console.error('Error encrypting message (NIP-44):', error);
}
```

### NIP-44 Decrypt

```typescript
try {
  const { result: decryptedText } = await NostrSignerPlugin.nip44Decrypt(
    'com.example.signer',
    'encrypted_text',
    'request-id',
    'sender_public_key',
    pubkey,
  );
  console.log('Decrypted Text (NIP-44):', decryptedText);
} catch (error) {
  console.error('Error decrypting message (NIP-44):', error);
}
```

### Decrypt Zap Event

```typescript
try {
  const { result: decryptedEventJson } = await NostrSignerPlugin.decryptZapEvent(
    'com.example.signer',
    JSON.stringify(encryptedEvent),
    'request-id',
    pubkey,
  );
  const decryptedEvent = JSON.parse(decryptedEventJson);
  console.log('Decrypted Zap Event:', decryptedEvent);
} catch (error) {
  console.error('Error decrypting zap event:', error);
}
```

## API

<docgen-index>

- [`getInstalledSignerApps(...)`](#getinstalledsignerapps)
- [`setPackageName(...)`](#setpackagename)
- [`isExternalSignerInstalled()`](#isexternalsignerinstalled)
- [`getPublicKey()`](#getpublickey)
- [`signEvent(...)`](#signevent)
- [`signPsbt(...)`](#signpsbt)
- [`nip04Encrypt(...)`](#nip04encrypt)
- [`nip04Decrypt(...)`](#nip04decrypt)
- [`nip44Encrypt(...)`](#nip44encrypt)
- [`nip44Decrypt(...)`](#nip44decrypt)
- [`decryptZapEvent(...)`](#decryptzapevent)

</docgen-index>

<docgen-api>

### getInstalledSignerApps(...)

```typescript
getInstalledSignerApps() => Promise<{ apps: AppInfo[] }>
```

Returns a list of AppInfo objects which contain information about which Signer apps are installed.

**Returns:** <code>Promise&lt;{ apps: AppInfop[] }&gt;</code>

### setPackageName(...)

```typescript
setPackageName(options: { packageName: string; }) => Promise<void>
```

Sets the package name of the external Nostr signer app. This is required on Android to specify which app to interact with.

| Param         | Type                                  | Description                                   |
| ------------- | ------------------------------------- | --------------------------------------------- |
| **`options`** | <code>{ packageName: string; }</code> | An object containing the package name string. |

---

### isExternalSignerInstalled()

```typescript
isExternalSignerInstalled() => Promise<{ installed: boolean; }>
```

Checks if the external Nostr signer app is installed on the device.

**Returns:** <code>Promise&lt;{ installed: boolean; }&gt;</code>

An object indicating whether the signer app is installed.

---

### getPublicKey()

```typescript
getPublicKey() => Promise<{ pubkey: string; package: string }>
```

Requests the public key from the Nostr signer app or extension.

**Returns:** <code>Promise&lt;{ pubkey: string; package: string }&gt;</code>

An object containing the public key in lowercase hex format and the signer's
Android package name.

---

### signEvent(...)

```typescript
signEvent(packageName: string, eventJson: string, id: string, pubkey: string) => Promise<{ signature: string; id: string; event: string }>
```

Requests the signer app to sign a Nostr event.

| Param             | Type                | Description                                      |
| ----------------- | ------------------- | ------------------------------------------------ |
| **`packageName`** | <code>string</code> | The signer Android package name.                 |
| **`eventJson`**   | <code>string</code> | The unsigned event in JSON string format.        |
| **`id`**          | <code>string</code> | Caller-provided request id returned in response. |
| **`pubkey`**      | <code>string</code> | Current user's lowercase hex public key.         |

**Returns:** <code>Promise&lt;{ signature: string; id: string; event: string }&gt;</code>

An object containing the event signature, request id, and signed event JSON.

---

### signPsbt(...)

```typescript
signPsbt(packageName: string, psbtHex: string, id: string, pubkey: string) => Promise<{ result: string; id: string }>
```

Requests the signer app to sign a Bitcoin PSBT using Amber's `sign_psbt` NIP-55 extension.

| Param             | Type                | Description                                      |
| ----------------- | ------------------- | ------------------------------------------------ |
| **`packageName`** | <code>string</code> | The signer Android package name.                 |
| **`psbtHex`**     | <code>string</code> | The unsigned PSBT encoded as hex.                |
| **`id`**          | <code>string</code> | Caller-provided request id returned in response. |
| **`pubkey`**      | <code>string</code> | Current user's lowercase hex public key.         |

**Returns:** <code>Promise&lt;{ result: string; id: string }&gt;</code>

An object containing the signed PSBT hex in `result`.

---

### nip04Encrypt(...)

```typescript
nip04Encrypt(packageName: string, plainText: string, id: string, pubKey: string, pubkey: string) => Promise<{ result: string; id: string }>
```

Encrypts a message using NIP-04 encryption.

| Param             | Type                | Description                                      |
| ----------------- | ------------------- | ------------------------------------------------ |
| **`packageName`** | <code>string</code> | The signer Android package name.                 |
| **`plainText`**   | <code>string</code> | The plaintext to encrypt.                        |
| **`id`**          | <code>string</code> | Caller-provided request id returned in response. |
| **`pubKey`**      | <code>string</code> | Recipient's lowercase hex public key.            |
| **`pubkey`**      | <code>string</code> | Current user's lowercase hex public key.         |

**Returns:** <code>Promise&lt;{ result: string; id: string }&gt;</code>

An object containing the encrypted text.

---

### nip04Decrypt(...)

```typescript
nip04Decrypt(packageName: string, encryptedText: string, id: string, pubKey: string, pubkey: string) => Promise<{ result: string; id: string }>
```

Decrypts a message using NIP-04 decryption.

| Param               | Type                | Description                                      |
| ------------------- | ------------------- | ------------------------------------------------ |
| **`packageName`**   | <code>string</code> | The signer Android package name.                 |
| **`encryptedText`** | <code>string</code> | The encrypted text to decrypt.                   |
| **`id`**            | <code>string</code> | Caller-provided request id returned in response. |
| **`pubKey`**        | <code>string</code> | Sender's lowercase hex public key.               |
| **`pubkey`**        | <code>string</code> | Current user's lowercase hex public key.         |

**Returns:** <code>Promise&lt;{ result: string; id: string }&gt;</code>

An object containing the decrypted plaintext.

---

### nip44Encrypt(...)

```typescript
nip44Encrypt(packageName: string, plainText: string, id: string, pubKey: string, pubkey: string) => Promise<{ result: string; id: string }>
```

Encrypts a message using NIP-44 encryption.

| Param             | Type                | Description                                      |
| ----------------- | ------------------- | ------------------------------------------------ |
| **`packageName`** | <code>string</code> | The signer Android package name.                 |
| **`plainText`**   | <code>string</code> | The plaintext to encrypt.                        |
| **`id`**          | <code>string</code> | Caller-provided request id returned in response. |
| **`pubKey`**      | <code>string</code> | Recipient's lowercase hex public key.            |
| **`pubkey`**      | <code>string</code> | Current user's lowercase hex public key.         |

**Returns:** <code>Promise&lt;{ result: string; id: string }&gt;</code>

An object containing the encrypted text.

---

### nip44Decrypt(...)

```typescript
nip44Decrypt(packageName: string, encryptedText: string, id: string, pubKey: string, pubkey: string) => Promise<{ result: string; id: string }>
```

Decrypts a message using NIP-44 decryption.

| Param               | Type                | Description                                      |
| ------------------- | ------------------- | ------------------------------------------------ |
| **`packageName`**   | <code>string</code> | The signer Android package name.                 |
| **`encryptedText`** | <code>string</code> | The encrypted text to decrypt.                   |
| **`id`**            | <code>string</code> | Caller-provided request id returned in response. |
| **`pubKey`**        | <code>string</code> | Sender's lowercase hex public key.               |
| **`pubkey`**        | <code>string</code> | Current user's lowercase hex public key.         |

**Returns:** <code>Promise&lt;{ result: string; id: string }&gt;</code>

An object containing the decrypted plaintext.

---

### decryptZapEvent(...)

```typescript
decryptZapEvent(packageName: string, eventJson: string, id: string, pubkey: string) => Promise<{ result: string; id: string }>
```

Decrypts a zap event.

| Param             | Type                | Description                                      |
| ----------------- | ------------------- | ------------------------------------------------ |
| **`packageName`** | <code>string</code> | The signer Android package name.                 |
| **`eventJson`**   | <code>string</code> | The encrypted zap event in JSON string format.   |
| **`id`**          | <code>string</code> | Caller-provided request id returned in response. |
| **`pubkey`**      | <code>string</code> | Current user's lowercase hex public key.         |

**Returns:** <code>Promise&lt;{ result: string; id: string }&gt;</code>

An object containing the decrypted zap event in JSON string format.

---

</docgen-api>

## Notes

- On **Android**, the plugin communicates with external signer apps using intents and the Content Resolver as per [NIP-55](https://github.com/nostr-protocol/nips/blob/master/55.md).
- Ensure that the external signer app or browser extension supports the required NIP specifications.

## License

[MIT License](LICENSE)
