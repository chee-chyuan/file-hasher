import { Input, useMultiStyleConfig } from "@chakra-ui/react";

export default function FileUpload() {
  const styles = useMultiStyleConfig("Button", { variant: "outline" });

  return (
    <Input
      type="file"
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
    />
  );
};