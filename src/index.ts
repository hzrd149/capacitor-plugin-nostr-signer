import { Capacitor, registerPlugin } from '@capacitor/core';
import type { NostrSignerNative, Permission, SignerAppInfo as AppInfo } from './definitions';

const native = registerPlugin<NostrSignerNative>('NostrSignerPlugin');

const ANDROID_ONLY = 'ANDROID_ONLY';

const ensureAndroid = () => {
  if (Capacitor.getPlatform() !== 'android') {
    const err = new Error('nostr-capacitor is Android-only. Use a NIP-07 provider on Web/iOS.');
    // @ts-expect-error attach code
    err.code = ANDROID_ONLY;
    throw err;
  }
};

export const buildPermissionsJson = (perms: Permission[]): string => JSON.stringify(perms ?? []);

function normalizePermissions(permissions?: Permission[] | string): string | undefined {
  if (permissions == null) return undefined;
  if (typeof permissions === 'string') return permissions;
  return buildPermissionsJson(permissions);
}

export const NostrSignerPlugin = {
  async setPackageName(packageName: string): Promise<void> {
    ensureAndroid();
    if (!packageName) throw new Error('MISSING_PARAMS: packageName');
    await native.setPackageName({ packageName });
  },

  async isExternalSignerInstalled(packageName?: string): Promise<{ installed: boolean }> {
    ensureAndroid();
    return native.isExternalSignerInstalled({ packageName });
  },

  async getInstalledSignerApps(): Promise<{ apps: AppInfo[] }> {
    ensureAndroid();
    return native.getInstalledSignerApps();
  },

  async getPublicKey(
    packageName?: string,
    permissions?: Permission[] | string,
  ): Promise<{ pubkey: string; package: string }> {
    ensureAndroid();
    const perm = normalizePermissions(permissions);
    return native.getPublicKey({ packageName, permissions: perm });
  },

  async signEvent(
    packageName: string,
    eventJson: string,
    id: string,
    pubkey: string,
  ): Promise<{ signature: string; id: string; event: string }> {
    ensureAndroid();
    if (!eventJson || !id || !pubkey) {
      throw new Error('MISSING_PARAMS: eventJson,id,pubkey');
    }
    return native.signEvent({ packageName, eventJson, eventId: id, pubkey });
  },

  async nip04Encrypt(
    packageName: string,
    plainText: string,
    id: string,
    pubKey: string,
    pubkey: string,
  ): Promise<{ result: string; id: string }> {
    ensureAndroid();
    if (!plainText || !pubKey || !pubkey) {
      throw new Error('MISSING_PARAMS: plainText,pubKey,pubkey');
    }
    return native.nip04Encrypt({ packageName, plainText, pubKey, pubkey, id });
  },

  async nip04Decrypt(
    packageName: string,
    encryptedText: string,
    id: string,
    pubKey: string,
    pubkey: string,
  ): Promise<{ result: string; id: string }> {
    ensureAndroid();
    if (!encryptedText || !pubKey || !pubkey) {
      throw new Error('MISSING_PARAMS: encryptedText,pubKey,pubkey');
    }
    return native.nip04Decrypt({ packageName, encryptedText, pubKey, pubkey, id });
  },

  async nip44Encrypt(
    packageName: string,
    plainText: string,
    id: string,
    pubKey: string,
    pubkey: string,
  ): Promise<{ result: string; id: string }> {
    ensureAndroid();
    if (!plainText || !pubKey || !pubkey) {
      throw new Error('MISSING_PARAMS: plainText,pubKey,pubkey');
    }
    return native.nip44Encrypt({ packageName, plainText, pubKey, pubkey, id });
  },

  async nip44Decrypt(
    packageName: string,
    encryptedText: string,
    id: string,
    pubKey: string,
    pubkey: string,
  ): Promise<{ result: string; id: string }> {
    ensureAndroid();
    if (!encryptedText || !pubKey || !pubkey) {
      throw new Error('MISSING_PARAMS: encryptedText,pubKey,pubkey');
    }
    return native.nip44Decrypt({ packageName, encryptedText, pubKey, pubkey, id });
  },

  async decryptZapEvent(
    packageName: string,
    eventJson: string,
    id: string,
    pubkey: string,
  ): Promise<{ result: string; id: string }> {
    ensureAndroid();
    if (!eventJson || !pubkey) {
      throw new Error('MISSING_PARAMS: eventJson,pubkey');
    }
    return native.decryptZapEvent({ packageName, eventJson, pubkey, id });
  },

  async signPsbt(
    packageName: string,
    psbtHex: string,
    id: string,
    pubkey: string,
  ): Promise<{ result: string; id: string }> {
    ensureAndroid();
    if (!psbtHex || !pubkey) {
      throw new Error('MISSING_PARAMS: psbtHex,pubkey');
    }
    return native.signPsbt({ packageName, psbtHex, pubkey, id });
  },
};

export type { AppInfo, Permission };
