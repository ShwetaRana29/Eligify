import assert from 'node:assert/strict';
import {
  createVault, unlockVault, unlockWithRecoveryKey, changePassword, resetPasswordWithRecoveryKey,
  encryptJSON, decryptJSON, checkPasswordStrength, VaultError, computeLoginProof,
} from './src/services/vault.js';

const KDF = { name: 'PBKDF2-SHA256', iterations: 100000 }; // fast for tests; prod default is 600k
let n = 0;
const t = async (name, fn) => { await fn(); n++; console.log('  ok -', name); };
const rejects = async (p, code) => {
  try { await p; } catch (e) { assert.ok(e instanceof VaultError, 'VaultError expected'); assert.equal(e.code, code); return; }
  assert.fail('expected rejection ' + code);
};

const PW = 'Correct-Horse-9!';
const profile = { name: 'Sunita', income: 120000, aadhaarLast4: '8261' };

await t('weak passwords rejected', async () => {
  assert.equal(checkPasswordStrength('short').ok, false);
  assert.equal(checkPasswordStrength('password1234').ok, false);
  assert.equal(checkPasswordStrength('aaaaaaaaaaaa').ok, false);
  assert.equal(checkPasswordStrength("alllowercase").ok, false);
  assert.equal(checkPasswordStrength(PW).ok, true);
  await rejects(createVault('weak', KDF), 'WEAK_PASSWORD');
});

const { record, recoveryKey, loginProof, dek } = await createVault(PW, KDF);

await t('record holds no plaintext secrets', async () => {
  const s = JSON.stringify(record);
  assert.ok(!s.includes(PW) && !s.includes(recoveryKey));
  assert.match(recoveryKey, /^([A-Z2-9]{4}-){7}[A-Z2-9]{4}$/);
});

await t('encrypt/decrypt round trip, ciphertext hides data', async () => {
  const box = await encryptJSON(dek, profile, 'sunita');
  assert.ok(!JSON.stringify(box).includes('Sunita') && !JSON.stringify(box).includes('8261'));
  assert.deepEqual(await decryptJSON(dek, box, 'sunita'), profile);
});

await t('fresh IV every encryption', async () => {
  const a = await encryptJSON(dek, profile, 'x'), b = await encryptJSON(dek, profile, 'x');
  assert.notEqual(a.iv, b.iv); assert.notEqual(a.ct, b.ct);
});

await t('data key is non-extractable', async () => {
  await assert.rejects(globalThis.crypto.subtle.exportKey('raw', dek));
});

await t('correct password unlocks same key; login proof is stable', async () => {
  const u = await unlockVault(PW, record);
  const box = await encryptJSON(dek, profile, 'a');
  assert.deepEqual(await decryptJSON(u.dek, box, 'a'), profile);
  assert.equal(u.loginProof, loginProof);
  assert.equal(await computeLoginProof(PW, record.salt, record.kdf), loginProof);
});

await t('wrong password fails', async () => {
  await rejects(unlockVault('Wrong-Horse-9!x', record), 'BAD_PASSWORD');
});

await t('ciphertext tampering detected', async () => {
  const box = await encryptJSON(dek, profile, 'a');
  const bad = { ...box, ct: box.ct.slice(0, -4) + (box.ct.endsWith('AAAA') ? 'BBBB' : 'AAAA') };
  await rejects(decryptJSON(dek, bad, 'a'), 'CORRUPT');
});

await t('blob cannot be swapped between accounts (AAD binding)', async () => {
  const box = await encryptJSON(dek, profile, 'alice');
  await rejects(decryptJSON(dek, box, 'mallory'), 'CORRUPT');
});

await t('another user key cannot read blob', async () => {
  const other = await createVault('Another-Secret-77!', KDF);
  const box = await encryptJSON(dek, profile, 'a');
  await rejects(decryptJSON(other.dek, box, 'a'), 'CORRUPT');
});

await t('recovery key unlocks; wrong one fails', async () => {
  const r = await unlockWithRecoveryKey(recoveryKey, record);
  const box = await encryptJSON(dek, profile, 'a');
  assert.deepEqual(await decryptJSON(r.dek, box, 'a'), profile);
  await rejects(unlockWithRecoveryKey('AAAA-AAAA-AAAA-AAAA-AAAA-AAAA-AAAA-AAAA', record), 'BAD_RECOVERY_KEY');
  await rejects(unlockWithRecoveryKey('not-a-key', record), 'BAD_RECOVERY_KEY');
});

let rec2;
await t('change password keeps data readable, old password dies', async () => {
  const NEW = 'Brand-New-Pass-42?';
  const c = await changePassword(PW, NEW, record, KDF);
  rec2 = c.record;
  assert.notEqual(c.record.salt, record.salt);
  assert.notEqual(c.loginProof, loginProof);
  const box = await encryptJSON(dek, profile, 'a');
  assert.deepEqual(await decryptJSON((await unlockVault(NEW, c.record)).dek, box, 'a'), profile);
  await rejects(unlockVault(PW, c.record), 'BAD_PASSWORD');
  await rejects(changePassword('nope-nope-1A!', 'Xx-Yy-Zz-12345!', record, KDF), 'BAD_PASSWORD');
});

await t('forgot-password reset via recovery key keeps data', async () => {
  const NEW2 = 'Reset-After-Forgot-5#';
  const r = await resetPasswordWithRecoveryKey(recoveryKey, NEW2, rec2, KDF);
  const box = await encryptJSON(dek, profile, 'a');
  assert.deepEqual(await decryptJSON((await unlockVault(NEW2, r.record)).dek, box, 'a'), profile);
  await rejects(resetPasswordWithRecoveryKey(recoveryKey, 'weak', rec2, KDF), 'WEAK_PASSWORD');
});

await t('unsafe KDF params refused', async () => {
  await rejects(unlockVault(PW, { ...record, kdf: { name: 'PBKDF2-SHA256', iterations: 10 } }), 'UNSUPPORTED');
});

console.log(`\n${n} vault tests passed`);
