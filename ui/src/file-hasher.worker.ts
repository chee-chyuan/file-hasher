import { expose } from "comlink";
import { sha256 } from "js-sha256";
import {
  convertSha256HexToU32,
  convertStringToU32,
} from "./utils/sha256-conversion";

export class FileHasher {
  private multiThread?: typeof import("file-hasher");

  async initialize() {
    this.multiThread = await import("file-hasher");
    await this.multiThread.default();
    await this.multiThread.initThreadPool(navigator.hardwareConcurrency);
  }

  async getFileCommitment(
    rowTitles: string[],
    rowContent: string[]
  ): Promise<string> {
    if (!this.multiThread) {
      throw new Error("Not initialized");
    }

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

    const [fileCommitmentHex] =
      this.multiThread.get_file_commitment_and_selected_row(
        rowTitlesU32,
        rowContentU32,
        rowSelector
      );

    return fileCommitmentHex;
  }

  async getProof(rowTitles: string[], rowContent: string[], index: number) {
    if (!this.multiThread) {
      throw new Error("Not initialized");
    }

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

    const proof = this.multiThread.generate_proof(
      rowTitlesU32,
      rowContentU32,
      rowSelector
    );

    return proof;
  }

  async verifyProof(
    proof: any,
    rowTitle: string,
    rowContent: string,
    fileCommitmentHex: string
  ): Promise<Boolean> {
    if (!this.multiThread) {
      throw new Error("Not initialized");
    }
    const selectedRowHex = this.multiThread.get_selected_row(
      convertStringToU32(rowTitle),
      convertStringToU32(rowContent)
    );

    const fileCommitmentU32 = convertSha256HexToU32(fileCommitmentHex);
    const selectedRowU32 = convertSha256HexToU32(selectedRowHex);
    const verifyResult = this.multiThread.verify_correct_selector(
      fileCommitmentU32,
      selectedRowU32,
      proof
    );
    return verifyResult;
  }
}

expose(new FileHasher());
