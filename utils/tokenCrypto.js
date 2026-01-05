import crypto from "crypto";

const SECRET = process.env.TOKEN_SECRET_KEY;

if (!SECRET) {
  throw new Error("TOKEN_SECRET_KEY is missing");
}

const KEY = crypto.createHash("sha256").update(SECRET).digest();

export function encryptToken(token) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);

  let encrypted = cipher.update(token, "utf8", "base64");
  encrypted += cipher.final("base64");

  return `${iv.toString("base64")}:${encrypted}`;
}

export function decryptToken(encryptedToken) {
  const [ivBase64, encrypted] = encryptedToken.split(":");

  if (!ivBase64 || !encrypted) {
    throw new Error("Invalid encrypted token format");
  }

  const iv = Buffer.from(ivBase64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv);

  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
