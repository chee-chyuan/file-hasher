import FileUpload from "../FileUpload";
import { RowSelectTable } from "../tables";

export const GenerateProofPanel = () => {
  return (
    <>
      <FileUpload />
      <RowSelectTable
        rowTitles={["1", "2"]}
        rowValues={["c", "dd"]}
        onChange={(v) => console.log(v)}
      />
    </>
  );
};
