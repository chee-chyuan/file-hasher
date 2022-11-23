import { Input } from "@chakra-ui/react";
import { FileUpload } from "../FileUpload";

export const VerifyProofPanel = () => {
  return (
    <>
      <FileUpload />
      <FileUpload />
      <Input type="text" placeholder="Owner address" />
    </>
  );
};
