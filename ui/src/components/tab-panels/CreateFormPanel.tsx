import { Button, Input, Stack, useToast } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import type { Remote } from "comlink";
import type { FileHasher } from "../../file-hasher.worker";
import { BaseContainer } from "../containers";
import { FlexibleFormTable } from "../tables";
import { useAccount } from "wagmi";
import { FileHash__factory } from "../../typechain-types";
import { isAddress } from "ethers/lib/utils.js";
import { AppConfig } from "../../app-config";

type RowDatas = {
  rowTitles: string[];
  rowValues: string[];
};

type CreateFormPanelProps = {
  wasmWorkerApi: Remote<FileHasher>;
};

export const CreateFormPanel = ({ wasmWorkerApi }: CreateFormPanelProps) => {
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
        const commitment = await wasmWorkerApi.getFileCommitment(
          rowData.rowTitles,
          rowData.rowValues
        );

        setLoadingMessage("Submitting commitment...");
        await submitCommitment(targetAddress, commitment);

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
          >
            Create form
          </Button>
        </Stack>
      </Stack>
    </BaseContainer>
  );
};
