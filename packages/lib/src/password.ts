import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (password: string, salt: string, keyLength: number) => Promise<Buffer>;

const SALT_LENGTH_IN_BYTES = 16;
const KEY_LENGTH_IN_BYTES = 64;
const HASH_SEPARATOR = ":";

export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH_IN_BYTES).toString("hex");
  const derivedKey = await scryptAsync(plainPassword, salt, KEY_LENGTH_IN_BYTES);

  return `${salt}${HASH_SEPARATOR}${derivedKey.toString("hex")}`;
}

export async function verifyPassword(plainPassword: string, storedHash: string): Promise<boolean> {
  const [salt, expectedKeyInHex] = storedHash.split(HASH_SEPARATOR);

  if (!salt || !expectedKeyInHex) {
    return false;
  }

  const expectedKey = Buffer.from(expectedKeyInHex, "hex");
  const derivedKey = await scryptAsync(plainPassword, salt, expectedKey.length);

  return expectedKey.length === derivedKey.length && timingSafeEqual(expectedKey, derivedKey);
}
