import { expose } from "comlink";
import { sha256 } from "js-sha256";

// create a form (20 rows)
const rowTitles = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
];
const rowContent = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
];

async function testAllFlow2() {
  debugger;
  const multiThread = await import("file-hasher");
  await multiThread.default();
  await multiThread.initThreadPool(navigator.hardwareConcurrency);

  const shaRes = sha256("hello");
  const hash = convertSha256HexToU32(shaRes);
  const hash2 = convertSha256HexToU64(shaRes);
  const ret = multiThread.wasm_test();
}

async function testAllFlow() {
  debugger;
  const multiThread = await import("file-hasher");
  await multiThread.default();
  await multiThread.initThreadPool(navigator.hardwareConcurrency);
  //   multiThread.init_panic_hook();

  // create sha256 entry for each row_title and row_content
  // split each sha256 to 4 u64 numbers
  const rowTitlesU32 = rowTitles.map((x) => {
    const shaRes = sha256(x);
    return convertSha256HexToU32(shaRes);
  });
  const rowContentU32 = rowContent.map((x) => {
    const shaRes = sha256(x);
    return convertSha256HexToU32(shaRes);
  });

  // create selector
  const selectedRowIndex = 0;
  const rowSelector = Array(20).fill(0);
  rowSelector[selectedRowIndex] = 1; // selecting the first entry
  const rowHashHex = multiThread.generate_row_hash(
    rowTitlesU32[selectedRowIndex],
    rowContentU32[selectedRowIndex]
  );

  const [fileCommitmentHex, selectedRowHex] =
    multiThread.get_file_commitment_and_selected_row(
      rowTitlesU32,
      rowContentU32,
      rowSelector
    );

  const proof = multiThread.generate_proof(
    rowTitlesU32,
    rowContentU32,
    rowSelector
  ); // [u8]

  const fileCommitmentU64 = convertSha256HexToU64(fileCommitmentHex);
  const selectedRowU64 = convertSha256HexToU64(selectedRowHex);
  const verifyResult = multiThread.verify_correct_selector(
    fileCommitmentU64,
    selectedRowU64,
    proof
  );
}

const convertSha256HexToU64 = (hash: string) => {
  if (hash.startsWith("0x")) {
    hash = hash.slice(2);
  }

  let res = [];
  const partLength = 256 / 4 / 4;

  for (let i = 0; i < 4; i++) {
    let currentWord = hash.slice(i * partLength, (i + 1) * partLength);
    let x = BigInt("0x" + currentWord);
    // let x = parseInt(currentWord, 16);
    res.push(x);
  }

  return res;
};

const convertSha256HexToU32 = (hash: string) => {
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

const convertLEBitsToHex = (bitArray: number[]) => {
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

// async function get_play_diff() {
//     console.log('diffing');
//     const multiThread = await import('file-hasher');
//     await multiThread.default();
//     await multiThread.initThreadPool(navigator.hardwareConcurrency);
//     multiThread.init_panic_hook();
//     const ret = multiThread.get_play_diff("fluff", ["fluff", "fluff", "fluff", "fluff", "fluff", "fluff"]);
//     return ret;
// }

// async function fetch_params() {
//     const response = await fetch('http://localhost:3000/params.bin');
//     const bytes = await response.arrayBuffer();
//     const params = new Uint8Array(bytes);
//     return params;
// }

// async function prove_play() {
//     const params = await fetch_params();
//     console.log("param length", params.length);
//     console.log("params", params);

//     console.log('genning proof');
//     const multiThread = await import(
//         'halowordle'
//       );
//     await multiThread.default();
//     await multiThread.initThreadPool(navigator.hardwareConcurrency);
//     console.log('here we go');
//     const ret = multiThread.prove_play("fluff", ["fluff", "fluff", "fluff", "fluff", "fluff", "fluff"], params);
//     return ret;
// }

// async function verify_play(proof: any, diffs_js: any) {
//     const params = await fetch_params();
//     console.log("param length", params.length);
//     console.log("params", params);

//     console.log('verifying proof');
//     const multiThread = await import(
//         'halowordle'
//       );
//     await multiThread.default();
//     await multiThread.initThreadPool(navigator.hardwareConcurrency);
//     console.log('here we go');
//     const ret = multiThread.verify_play("fluff", proof, diffs_js, params);
//     return ret;
// }

const exports = {
  testAllFlow,
};
export type FileHasherWorker = typeof exports;

expose(exports);
