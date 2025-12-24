import { hashPassword, comparePassword } from '../modules/auth/passwordUtils';

describe('passwordUtils', () => {
  it('debe generar un hash diferente al texto plano', async () => {
    const plain = 'mi_clave';
    const hash = await hashPassword(plain);

    expect(hash).not.toBe(plain);
    expect(hash.length).toBeGreaterThan(0);
  });

  it('debe validar correctamente una contrasea', async () => {
    const plain = 'mi_clave_segura';
    const hash = await hashPassword(plain);

    const isValid = await comparePassword(plain, hash);
    const isInvalid = await comparePassword('otra_clave', hash);

    expect(isValid).toBe(true);
    expect(isInvalid).toBe(false);
  });
});
