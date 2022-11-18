import { expose } from "comlink";
import { sha256 } from "js-sha256";

const getFileCommitment = async function(rowTitles: string[], rowContent: string[]) : Promise<string> {

    const multiThread = await import("file-hasher");
    await multiThread.default();
    await multiThread.initThreadPool(navigator.hardwareConcurrency);


    const rowTitlesU32 = rowTitles.map((x) => {
        const shaRes = sha256(x);
        return convertSha256HexToU32(shaRes);
      });
    const rowContentU32 = rowContent.map((x) => {
        const shaRes = sha256(x);
        return convertSha256HexToU32(shaRes);
    });

    const selectedRowIndex = 0;
    const rowSelector = Array(rowTitles.length).fill(0);
    rowSelector[selectedRowIndex] = 1;

    const [fileCommitmentHex, ] =
    multiThread.get_file_commitment_and_selected_row(
        rowTitlesU32,
        rowContentU32,
        rowSelector
    );
    
    return fileCommitmentHex;
}
 

const getProof = async function(rowTitles: string[], rowContent: string[], index: number) {

  const multiThread = await import("file-hasher");
  await multiThread.default();
  await multiThread.initThreadPool(navigator.hardwareConcurrency);

  const rowTitlesU32 = rowTitles.map((x) => {
      const shaRes = sha256(x);
      return convertSha256HexToU32(shaRes);
    });
  const rowContentU32 = rowContent.map((x) => {
      const shaRes = sha256(x);
      return convertSha256HexToU32(shaRes);
  });

  const rowSelector = Array(rowTitles.length).fill(0);
  rowSelector[index] = 1;

  const proof = multiThread.generate_proof(
      rowTitlesU32,
      rowContentU32,
      rowSelector
  );

  return proof;
}

const verifyProof = async function(proof: any, rowTitle: string, rowContent: string, fileCommitmentHex: string): Promise<Boolean> {
  const multiThread = await import("file-hasher");
  await multiThread.default();
  await multiThread.initThreadPool(navigator.hardwareConcurrency);

  const selectedRowHex = multiThread.get_selected_row(
    convertStringToU32(rowTitle),
    convertStringToU32(rowContent)
  )

  const fileCommitmentU32 = convertSha256HexToU32(fileCommitmentHex);
  const selectedRowU32 = convertSha256HexToU32(selectedRowHex);
  const verifyResult = multiThread.verify_correct_selector(
    fileCommitmentU32,
    selectedRowU32,
    proof
  )
  return verifyResult;
}


const convertStringToU32 = (input: string) => {
  const shaRes = sha256(input);
  return convertSha256HexToU32(shaRes);
};


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

const testAllFlow = async () => { 
  debugger;
  const rowTitles = ["1","1"];
  const rowContent = ["1","1"];
  const fileCommitmentHex = await getFileCommitment(rowTitles, rowContent);
  const proof = await getProof(rowTitles, rowContent, 0);
  const verifyResult = await verifyProof(proof, "1", "1", fileCommitmentHex);
  console.log("verify result is ",verifyResult);
}

const exports = {
  testAllFlow,
};
export type FileHasherWorker = typeof exports;

expose(exports);