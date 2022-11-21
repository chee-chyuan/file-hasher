import { sha256 } from "js-sha256";

export const convertStringToU32 = (input: string) => {
  const shaRes = sha256(input);
  return convertSha256HexToU32(shaRes);
};

export const convertSha256HexToU64 = (hash: string) => {
  if (hash.startsWith("0x")) {
    hash = hash.slice(2);
  }

  let res = [];
  const partLength = 256 / 4 / 4;

  for (let i = 0; i < 4; i++) {
    let currentWord = hash.slice(i * partLength, (i + 1) * partLength);
    let x = BigInt("0x" + currentWord);

    res.push(x);
  }

  return res;
};

export const convertSha256HexToU32 = (hash: string) => {
  if (hash.startsWith("0x")) {
    hash = hash.slice(2);
  }

  let res = [];
  const partLength = 256 / 4 / 4 / 2;

  for (let i = 0; i < 8; i++) {
    let currentWord = hash.slice(i * partLength, (i + 1) * partLength);
    let x = parseInt(currentWord, 16);
    res.push(x);
  }

  return res;
};

export const convertLEBitsToHex = (bitArray: number[]) => {
  let totalLength = bitArray.length;

  let hexString = "";
  const bitsInHex = 4;

  let currentCount = 0;
  for (let i = 0; i < totalLength; i++) {
    const powerOf = i % bitsInHex;
    currentCount += bitArray[i] ** powerOf;

    if (powerOf === bitsInHex - 1) {
      const hexChar = currentCount.toString(16);
      hexString.concat(hexChar);

      currentCount = 0;
    }
  }

  return hexString;
};
