import { expose } from "comlink";
import { sha256 } from "js-sha256";
import {
  convertSha256HexToU32,
  convertStringToU32,
} from "./utils/sha256-conversion";

const getFileCommitment = async function (
  rowTitles: string[],
  rowContent: string[]
): Promise<string> {
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

  const [fileCommitmentHex] = multiThread.get_file_commitment_and_selected_row(
    rowTitlesU32,
    rowContentU32,
    rowSelector
  );

  return fileCommitmentHex;
};

const getProof = async function (
  rowTitles: string[],
  rowContent: string[],
  index: number
) {
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
};

const verifyProof = async function (
  proof: any,
  rowTitle: string,
  rowContent: string,
  fileCommitmentHex: string
): Promise<Boolean> {
  const multiThread = await import("file-hasher");
  await multiThread.default();
  await multiThread.initThreadPool(navigator.hardwareConcurrency);

  const selectedRowHex = multiThread.get_selected_row(
    convertStringToU32(rowTitle),
    convertStringToU32(rowContent)
  );

  const fileCommitmentU32 = convertSha256HexToU32(fileCommitmentHex);
  const selectedRowU32 = convertSha256HexToU32(selectedRowHex);
  const verifyResult = multiThread.verify_correct_selector(
    fileCommitmentU32,
    selectedRowU32,
    proof
  );
  return verifyResult;
};

const exports = {
  getFileCommitment,
  getProof,
  verifyProof,
};

export type FileHasherWorker = typeof exports;

expose(exports);
