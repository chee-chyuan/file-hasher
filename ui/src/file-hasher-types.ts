import type { Remote } from "comlink";
import type { FileHasher } from "./file-hasher.worker";

export type FileHasherProps = {
  wasmWorkerApi: Remote<FileHasher>;
};

export type RowData = {
  rowTitles: string[];
  rowValues: string[];
};
