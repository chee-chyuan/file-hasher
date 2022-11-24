import { parse } from "papaparse";
import type { RowData } from "../file-hasher-types";

export const importCsvFile = async (file: File) => {
  return new Promise<RowData>((resolve, reject) => {
    parse<string[]>(file, {
      header: false,
      complete: (results, file) => {
        if (
          results.data.length !== 2 &&
          results.data[0].length !== results.data[1].length
        ) {
          return reject(new Error("Incorrect certificate format."));
        }

        const parsedData = {
          rowTitles: results.data[0],
          rowValues: results.data[1],
        };
        return resolve(parsedData);
      },
      error: (error, file) => {
        return reject(error);
      },
    });
  });
};
