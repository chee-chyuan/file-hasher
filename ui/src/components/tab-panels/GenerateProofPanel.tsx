import { Box, Button, Stack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { BaseContainer } from "../containers";
import { FileUpload } from "../FileUpload";
import { RowSelectTable } from "../tables";
import type { FileHasherProps, RowData } from "../../file-hasher-types";
import { importCsvFile } from "../../helper/file-imports";
import { exportProofJson } from "../../helper/file-exports";
import { useAccount } from "wagmi";

export const GenerateProofPanel = ({ wasmWorkerApi }: FileHasherProps) => {
  const { address } = useAccount();

  const toast = useToast();
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [rowData, setRowData] = useState<RowData>({
    rowTitles: [],
    rowValues: [],
  });
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSelectedRow = async (nextValue: string) => {
    const intNumber = parseInt(nextValue);
    console.log(intNumber);
    if (!isNaN(intNumber)) {
      setSelectedRow(intNumber);
    }
  };

  const onFileUploaded = async (data: FileList | null) => {
    if (data && data.length !== 0) {
      const file = data[0];
      try {
        const importedCsv = await importCsvFile(file);
        setRowData(importedCsv);
        setIsUploaded(true);
      } catch (err: any) {
        return toast({
          title: "Csv format error",
          description: err.message,
          status: "error",
          isClosable: true,
        });
      }
    } else {
      return toast({
        title: "Upload error",
        description:
          "Failed to upload file(s). Please make sure only 1 file is uploaded.",
        status: "error",
        isClosable: true,
      });
    }
  };

  const generateProof = async () => {
    setIsLoading(true);
    if (!address) {
      return toast({
        title: "Wallet not connected",
        description: "Address cannot be found because wallet is not connected.",
        status: "error",
        isClosable: true,
      });
    }
    // Hack for filling up to 10 inputs
    let submitRowTitles = [...rowData.rowTitles];
    let submitRowValues = [...rowData.rowValues];
    if (rowData.rowTitles.length != 10 && rowData.rowValues.length != 10) {
      const fillUpLength = 10 - rowData.rowTitles.length;
      submitRowTitles = [...submitRowTitles, ...new Array(fillUpLength).fill("-")]
      submitRowValues = [...submitRowValues, ...new Array(fillUpLength).fill("-")]
    }
    try {
      const proof = await wasmWorkerApi.getProof(
        submitRowTitles,
        submitRowValues,
        selectedRow
      );
      exportProofJson(
        address,
        rowData.rowTitles[selectedRow],
        rowData.rowValues[selectedRow],
        proof
      );
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      return toast({
        title: "Proof geenration failed",
        description: `Failed to generate proof: ${err.message}`,
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <BaseContainer>
      <FileUpload onFileUploaded={onFileUploaded} accept="text/csv" />
      <Stack padding="6" spacing="12" alignItems="center" w="100%">
        {isUploaded ? (
          <Stack w="100%" spacing="12" margin="auto">
            <RowSelectTable
              rowTitles={rowData.rowTitles}
              rowValues={rowData.rowValues}
              selectedRow={selectedRow}
              onChange={onSelectedRow}
            />
            <Button
              loadingText="Generating proof..."
              variant="solid"
              size="lg"
              w="full"
              colorScheme="teal"
              isLoading={isLoading}
              onClick={generateProof}
            >
              Generate proof
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </BaseContainer>
  );
};
