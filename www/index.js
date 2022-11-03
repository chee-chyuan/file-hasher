import {
  generate_row_hash,
  get_file_commitment_and_selected_row,
  generate_proof,
  verify_correct_selector,
} from "file-hasher";
import { sha256 } from "js-sha256";

// // create a form (20 rows)
// const rowTitles = [
//   "1",
//   "2",
//   "3",
//   "4",
//   "5",
//   "6",
//   "7",
//   "8",
//   "9",
//   "10",
//   "11",
//   "12",
//   "13",
//   "14",
//   "15",
//   "16",
//   "17",
//   "18",
//   "19",
//   "20",
// ];
// const rowContent = [
//   "1",
//   "2",
//   "3",
//   "4",
//   "5",
//   "6",
//   "7",
//   "8",
//   "9",
//   "10",
//   "11",
//   "12",
//   "13",
//   "14",
//   "15",
//   "16",
//   "17",
//   "18",
//   "19",
//   "20",
// ];

// const run = () => {
//   debugger;
//   // create sha256 entry for each row_title and row_content
//   // split each sha256 to 4 u64 numbers
//   const rowTitlesU64 = rowTitles.map((x) => {
//     const shaRes = sha256(x);
//     return convertSha256HexToU64(shaRes);
//   });
//   const rowContentU64 = rowContent.map((x) => {
//     const shaRes = sha256(x);
//     return convertSha256HexToU64(shaRes);
//   });

//   // create selector
//   const selectedRowIndex = 0;
//   const rowSelector = Array(20).fill(0);
//   rowSelector[selectedRowIndex] = 1; // selecting the first entry

//   // generate a row hash
//   const rowHashInBits = generate_row_hash(
//     rowTitles[selectedRowIndex],
//     rowContent[selectedRowIndex]
//   );
//   const rowHashHex = convertLEBitsToHex(rowHashInBits);

//   const [fileCommitmentInBits, selectedRowInBits] =
//     get_file_commitment_and_selected_row(
//       rowTitlesU64,
//       rowContentU64,
//       rowSelector
//     );
//   const fileCommitmentHex = convertLEBitsToHex(fileCommitmentInBits);
//   const selectedRowHex = convertLEBitsToHex(selectedRowInBits);

//   const proof = generate_proof(rowTitlesU64, rowContentU64, rowSelector); // [u8]

//   const fileCommitmentU64 = convertSha256HexToU64(fileCommitmentHex);
//   const selectedRowU64 = convertSha256HexToU64(selectedRowHex);
//   const verifyResult = verify_correct_selector(
//     fileCommitmentU64,
//     selectedRowU64,
//     proof
//   );
// };

// const convertSha256HexToU64 = (hash) => {
//   if (hash.startsWith("0x")) {
//     hash = hash.slice(2);
//   }

//   let res = [];
//   const partLength = 256 / 4;

//   for (let i = 0; i < 4; i++) {
//     let currentWord = hash.slice(i * partLength, (i + 1) * partLength);
//     let x = parseInt(currentWord, 16);
//     res.push(x);
//   }

//   return res;
// };

// const convertLEBitsToHex = (bitArray) => {
//   let totalLength = bitArray.length;

//   let hexString = "";
//   const bitsInHex = 4;

//   const currentCount = 0;
//   for (let i = 0; i < totalLength; i++) {
//     const powerOf = i % bitsInHex;
//     currentCount += bitArray[i] ** powerOf;

//     if (powerOf == bitsInHex - 1) {
//       const hexChar = currentCount.toString(16);
//       hexString.concat(hexChar);

//       currentCount = 0;
//     }
//   }

//   return hexString;
// };

// run();
