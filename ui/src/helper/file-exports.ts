import { saveAs } from "file-saver";

export const exportCertificateCSV = (key: string[], value: string[]) => {
  const rows = [key, value];

  let csvContent =
    "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
  let encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
};

export const exportProofJson = (
  address: String,
  selectedRowTitle: string,
  selectedRowContent: string,
  proof: string
) => {
  const jsonObject = {
    address: address,
    selectedRowTitle: selectedRowTitle,
    selectedRowContent: selectedRowContent,
    proof: proof,
  };

  let proofFile = new Blob([JSON.stringify(jsonObject)], {
    type: "application/json",
  });

  saveAs(proofFile, "proof.json");
};
