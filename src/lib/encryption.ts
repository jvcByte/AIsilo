import { type Address } from "viem";
import { getRandomBytes } from "ethereum-cryptography/random";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, bytesToHex, hexToBytes } from "ethereum-cryptography/utils";


function deriveEncryptionKey(signature: Address): Uint8Array {
  if (!signature) throw new Error("Invalid signature");
  const keyMaterial = keccak256(utf8ToBytes(signature)); // Uint8Array(32)
  return keyMaterial.slice(0, 32); // 32-byte AES key
}

export async function encryptFile(fileContent: File, signature: Address) {
  const iv = await getRandomBytes(16);

  const fileBase64 = await fileToBase64(fileContent);
  const fileBytes = base64ToBytes(fileBase64);

  const key = await crypto.subtle.importKey(
    "raw",
    deriveEncryptionKey(signature),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    fileBytes
  );

  return {
    encrypted: bytesToHex(new Uint8Array(encrypted)),
    iv: bytesToHex(iv),
  };
}

export async function decryptFile(
  encryptedHex: string,
  ivHex: string,
  signature: Address,
  fileName: string,
  mimeType: string
): Promise<File> {
  const encryptedBytes = hexToBytes(encryptedHex);
  const iv = hexToBytes(ivHex);

  const key = await crypto.subtle.importKey(
    "raw",
    deriveEncryptionKey(signature),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedBytes
  );

  const decryptedBytes = new Uint8Array(decrypted);

  // Build file back
  const blob = new Blob([decryptedBytes], { type: mimeType });
  return new File([blob], fileName, { type: mimeType });
}

// Strip base64 prefix + decode
function base64ToBytes(base64: string): Uint8Array {
  const cleaned = base64.split(",")[1] ?? base64; // remove dataURL prefix if present
  const bin = atob(cleaned);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

// Convert Uint8Array back to Base64 string
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}


// File -> Base64
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });


// Base64 -> File
export const base64ToFile = (base64: string, fileName: string): File => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};