import { Button, Input, Stack, useToast } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { BaseContainer } from "../containers";
import { FlexibleFormTable } from "../tables";
import { useAccount } from "wagmi";
import { FileHash__factory } from "../../typechain-types";
import { isAddress } from "ethers/lib/utils.js";
import { AppConfig } from "../../app-config";
import { exportCertificateCSV } from "../../helper/file-exports";
import { FileHasherProps } from "../../file-hasher-types";

type RowDatas = {
  rowTitles: string[];
  rowValues: string[];
};

export const CreateFormPanel = ({ wasmWorkerApi }: FileHasherProps) => {
  const { address, connector } = useAccount();

  const [rowData, setRowData] = useState<RowDatas>({
    rowTitles: [],
    rowValues: [],
  });
  const [targetAddress, setTargetAddress] = useState<string>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Creating...");

  const toast = useToast();

  const onDataChange = (data: RowDatas) => {
    setRowData(data);
  };

  const onTargetAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTargetAddress(event.target.value);
  };

  const onCreate = async () => {
    setIsLoading(true);
    if (
      targetAddress &&
      targetAddress?.length > 0 &&
      isAddress(targetAddress) &&
      rowData.rowTitles.length > 1 &&
      rowData.rowValues.length > 1 &&
      rowData.rowTitles.length === rowData.rowValues.length
    ) {
      try {
        setLoadingMessage("Creating commitment...");
        // Hack for filling up to 10 inputs
        let submitRowTitles = [...rowData.rowTitles];
        let submitRowValues = [...rowData.rowValues];
        if (rowData.rowTitles.length != 10 && rowData.rowValues.length != 10) {
          const fillUpLength = 10 - rowData.rowTitles.length;
          submitRowTitles = [...submitRowTitles, ...new Array(fillUpLength).fill("-")]
          submitRowValues = [...submitRowValues, ...new Array(fillUpLength).fill("-")]
        }
        console.log("submitRowTitles: ", submitRowTitles)
        console.log("submitRowValues: ", submitRowValues)
        const commitment = await wasmWorkerApi.getFileCommitment(
          submitRowTitles,
          submitRowValues
        );

        setLoadingMessage("Submitting commitment...");
        await submitCommitment(targetAddress, commitment);

        setLoadingMessage("Exporting certificate...");
        exportCertificateCSV(rowData.rowTitles, rowData.rowValues);

        setIsLoading(false);
        return toast({
          title: "Successful",
          status: "success",
          isClosable: true,
        });
      } catch (err: any) {
        setIsLoading(false);

        return toast({
          title: "Create error",
          description: err.message,
          status: "error",
          isClosable: true,
        });
      }
    }

    setIsLoading(false);

    return toast({
      title: "Create error",
      description:
        "Please make sure all fields are filled in completely, or that there are at least 2 rows of data.",
      status: "error",
      isClosable: true,
    });
  };

  const submitCommitment = async (
    targetAddress: string,
    commitment: string
  ) => {
    const signer = await connector?.getSigner({
      chainId: await connector.getChainId(),
    });
    if (!address || !signer) {
      throw new Error("Signer not available.");
    }
    const contract = FileHash__factory.connect(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      signer
    );
    const tx = await contract.commitFileHash(targetAddress, commitment);
    return tx.wait();
  };

  return (
    <BaseContainer>
      <Stack padding="6" spacing="12">
        <FlexibleFormTable onChange={onDataChange} />
        <Stack
          spacing="4"
          direction="row"
          w="100%"
          marginLeft="auto"
          marginRight="auto"
          alignItems="center"
        >
          <Input
            type="text"
            placeholder="Target user address"
            required
            onChange={onTargetAddressChange}
            value={targetAddress}
          />
          <Button
            isLoading={isLoading}
            loadingText={loadingMessage}
            variant="solid"
            size="lg"
            w="full"
            colorScheme="teal"
            onClick={onCreate}
            disabled={rowData.rowTitles.filter((row, idx) => row != "-" && rowData.rowValues[idx] != "-").length == 0}
          >
            Create form
          </Button>
        </Stack>
      </Stack>
    </BaseContainer>
  );
};
