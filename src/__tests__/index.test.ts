import { Capacitor } from '@capacitor/core';

import { NostrSignerPlugin, buildPermissionsJson } from '../index';

// Mock Capacitor core
jest.mock('@capacitor/core', () => {
  const actual = jest.requireActual('@capacitor/core');
  return {
    ...actual,
    Capacitor: { getPlatform: jest.fn(() => 'android') },
    registerPlugin: jest.fn(() => ({
      setPackageName: jest.fn(async () => {}),
      isExternalSignerInstalled: jest.fn(async () => ({ installed: true })),
      getInstalledSignerApps: jest.fn(async () => ({
        apps: [{ name: 'Signer', packageName: 'com.signer', iconUrl: 'data:image/png;base64,x' }],
      })),
      getPublicKey: jest.fn(async () => ({ pubkey: '3bf0c63f...459d', package: 'com.signer' })),
      signEvent: jest.fn(async () => ({ signature: 'sig', id: '1', event: '{"k":1}' })),
      nip04Encrypt: jest.fn(async () => ({ result: 'enc', id: '1' })),
      nip04Decrypt: jest.fn(async () => ({ result: 'dec', id: '1' })),
      nip44Encrypt: jest.fn(async () => ({ result: 'enc44', id: '1' })),
      nip44Decrypt: jest.fn(async () => ({ result: 'dec44', id: '1' })),
      decryptZapEvent: jest.fn(async () => ({ result: '{"ok":true}', id: '1' })),
      signPsbt: jest.fn(async () => ({ result: 'signedpsbthex', id: '1' })),
    })),
  };
});

describe('TS bridge', () => {
  it('buildPermissionsJson serializes array', () => {
    const json = buildPermissionsJson([{ type: 'get_public_key' }]);
    expect(json).toBe('[{"type":"get_public_key"}]');
  });

  it('getPublicKey serializes permissions when array', async () => {
    await expect(NostrSignerPlugin.getPublicKey('com.signer', [{ type: 'get_public_key' }])).resolves.toEqual({
      pubkey: '3bf0c63f...459d',
      package: 'com.signer',
    });
  });

  it('signEvent passes through result', async () => {
    const res = await NostrSignerPlugin.signEvent(
      'com.signer',
      '{"k":1}',
      '1',
      '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
    );
    expect(res).toEqual({ signature: 'sig', id: '1', event: '{"k":1}' });
  });

  it('signPsbt passes through result', async () => {
    const res = await NostrSignerPlugin.signPsbt(
      'com.signer',
      '70736274ff',
      '1',
      '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
    );
    expect(res).toEqual({ result: 'signedpsbthex', id: '1' });
  });

  it('Android-only guard rejects on non-android', async () => {
    (Capacitor.getPlatform as jest.Mock).mockReturnValue('web');
    await expect(NostrSignerPlugin.getInstalledSignerApps()).rejects.toThrowError();
    (Capacitor.getPlatform as jest.Mock).mockReturnValue('android');
  });
});
