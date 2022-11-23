import { Input, useMultiStyleConfig } from "@chakra-ui/react";
import { ChangeEvent } from "react";

type FileUploadProps = {
  accept?: string;
  onFileUploaded?: (data: FileList | null) => void;
};

export const FileUpload = ({ onFileUploaded, accept }: FileUploadProps) => {
  const styles = useMultiStyleConfig("Button", { variant: "outline" });

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onFileUploaded) {
      onFileUploaded(event.target.files);
    }
  };

  return (
    <Input
      type="file"
      accept={accept}
      sx={{
        padding: "10px",
        height: "auto",
        "::file-selector-button": {
          border: "none",
          outline: "none",
          height: "auto",
          mr: 2,
          ...styles,
        },
      }}
      onChange={onChange}
    />
  );
};
