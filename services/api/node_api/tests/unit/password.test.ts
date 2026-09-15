import { hashPassword, verifyPassword } from '../../src/utils/password';

describe('hashPassword / verifyPassword', () => {
  it('hashes a password so the plaintext is not stored', async () => {
    const hash = await hashPassword('S3curePass!');
    expect(hash).not.toBe('S3curePass!');
    expect(hash).toMatch(/^\$2[aby]\$/);
  });

  it('verifies a correct password', async () => {
    const hash = await hashPassword('S3curePass!');
    await expect(verifyPassword('S3curePass!', hash)).resolves.toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('S3curePass!');
    await expect(verifyPassword('wrongpass', hash)).resolves.toBe(false);
  });

  it('uses a random salt so identical inputs hash differently', async () => {
    const [a, b] = await Promise.all([hashPassword('same-password'), hashPassword('same-password')]);
    expect(a).not.toBe(b);
  });
});