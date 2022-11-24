import { Input, useMultiStyleConfig, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Box,
  Text,
  Button,
  Center,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";

import { FileHasherProps } from "../../file-hasher-types";
import { FileHash__factory } from "../../typechain-types";
import { BaseContainer } from "../containers";

export type JsonFileContentType = {
  selectedRowTitle: string;
  selectedRowContent: string;
  proof: any;
};

export function VerifyFormPanel({ wasmWorkerApi }: FileHasherProps) {
  const { address, isConnected, connector } = useAccount();
  const toast = useToast();

  const styles = useMultiStyleConfig("Button", { variant: "outline" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [jsonFileContent, setJsonFileContent] =
    React.useState<Record<string, string>>();

  const uploadFile = async function (e: any) {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const result = e?.target?.result;
      const jsonResult = JSON.parse(result);
      setJsonFileContent(jsonResult);
    };
    reader.readAsText(e.target?.files[0]);
  };

  const onVerifyProof = async () => {
    setIsLoading(true);
    if (!address || !connector) {
      return toast({
        title: "Unable to get address or connector",
        description:
          "Unable to get address or connector. Please try to reconnect.",
        isClosable: true,
        status: "error",
      });
    }

    const contract = FileHash__factory.connect(
      process.env.REACT_APP_PUBLIC_CONTRACT_ADDRESS!,
      await connector.getSigner()
    );

    const ringBuffer = [0, 1, 2, 3, 4];
    const nextIndex = await contract.ringBufferIndexes(address);

    const currIndex = ringBuffer[nextIndex - 1] ?? 4;

    const commitmentHash = await contract.fileHashRingBuffers(
      address,
      currIndex
    );

    if (
      jsonFileContent &&
      jsonFileContent.proof &&
      jsonFileContent.selectedRowTitle &&
      jsonFileContent.selectedRowContent
    ) {
      const verifyResult = await wasmWorkerApi.verifyProof(
        jsonFileContent.proof,
        jsonFileContent.selectedRowTitle,
        jsonFileContent.selectedRowContent,
        commitmentHash.toHexString()
      );

      setIsLoading(false);
      return toast({
        title: "Verification Result",
        description: `The proof is verified to be ${verifyResult}.`,
        status: "success",
        isClosable: true,
      });
    }

    setIsLoading(false);
    return toast({
      title: "Invalid proof.json format",
      description: "The provided proof.json file is in an invalid format.",
      status: "error",
      isClosable: true,
    });
  };

  if (!isConnected)
    return (
      <Center>
        <Text>Please Connect wallet to proceed</Text>
      </Center>
    );
  return (
    <>
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
        disabled={!isConnected}
        onChange={uploadFile}
      />

      {jsonFileContent ? (
        <>
          <Box mt="2">
            <Card>
              <CardHeader>
                <Heading size="md">Proof</Heading>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Smart contract address
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {process.env.REACT_APP_PUBLIC_CONTRACT_ADDRESS}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Verifier Address
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {address}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Selected Row
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {jsonFileContent.selectedRowTitle}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Selected Content
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {jsonFileContent.selectedRowContent}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Proof
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {jsonFileContent.proof}
                    </Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </Box>
          <Box mt="2">
            {isConnected && address && (
              <Center>
                <Button
                  colorScheme="blue"
                  size="lg"
                  loadingText="Verifying the proof..."
                  isLoading={isLoading}
                  onClick={onVerifyProof}
                >
                  Verify Proof
                </Button>
              </Center>
            )}
          </Box>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
