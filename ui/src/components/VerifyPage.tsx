import { Input, useMultiStyleConfig } from "@chakra-ui/react";
import * as React from "react";
import { ethers } from "ethers";
// import { getFileCommitment } from "../api/utils";
// import "dotenv"
import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, StackDivider, Box, Text, Button, Center } from '@chakra-ui/react'
import { Remote } from "comlink";
import { FileHasher } from "../file-hasher.worker";
import { useAccount } from 'wagmi'
import fileHashContractDetails from "../artifacts/contracts/FileHash.sol/FileHash.json"

export type VerifyProps = {
  wasmWorkerApi: Remote<FileHasher>;
};

export type JsonFileContentType = {
  selectedRow: string;
  selectedContent: string;
  proof: any
}

export default function Verify({ wasmWorkerApi }: VerifyProps) {
  const { address, isConnected } = useAccount()
  const styles = useMultiStyleConfig("Button", { variant: "outline" });
  const [jsonFileContent, setJsonFileContent] = React.useState<JsonFileContentType>();

  const uploadFile = async function (e: any) {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      console.log(e)
      const result = e?.target?.result;
      const jsonResult = JSON.parse(result);
      setJsonFileContent(jsonResult)
    }
    reader.readAsText(e.target?.files[0]);
  }
  const verifyProof = async (wasmWorkerApi: Remote<FileHasher>, address: string, jsonFileContet: JsonFileContentType) => {
    console.log("Contract address is ", process.env.REACT_APP_PUBLIC_CONTRACT_ADDRESS);
    console.log("REACT_APP_PUBLIC_ALCHEMY_API_KEY is ", process.env.REACT_APP_ALCHEMY_API_KEY);
    const contract = new ethers.Contract(process.env.REACT_APP_PUBLIC_CONTRACT_ADDRESS!, fileHashContractDetails.abi, new ethers.providers.AlchemyProvider("goerli", process.env.REACT_APP_ALCHEMY_API_KEY))
    const currIndex = await contract.ringBufferIndexes(address)
    const commitmentHash = await contract.fileHashRingBuffers(address, currIndex);
    const verifyResult = await wasmWorkerApi.verifyProof(jsonFileContet.proof, jsonFileContet.selectedRow, jsonFileContet.selectedContent, commitmentHash);
    alert(verifyResult);
    console.log("verifyResults: ", verifyResult);
    // return { verifyResult }
  }
  if (!isConnected) return (
    <Center>
      <Text>Please Connect wallet to proceed</Text>
    </Center>
  )
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

      {jsonFileContent ?
        (<>
          <Box mt="2">
            <Card>
              <CardHeader>
                <Heading size='md'>Proof</Heading>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing='4'>
                  <Box>
                    <Heading size='xs' textTransform='uppercase'>
                      Smart contract address
                    </Heading>
                    <Text pt='2' fontSize='sm'>
                      {process.env.REACT_APP_PUBLIC_CONTRACT_ADDRESS}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size='xs' textTransform='uppercase'>
                      Verifier Address
                    </Heading>
                    <Text pt='2' fontSize='sm'>
                      {address}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size='xs' textTransform='uppercase'>
                      Selected Row
                    </Heading>
                    <Text pt='2' fontSize='sm'>
                      {jsonFileContent.selectedRow}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size='xs' textTransform='uppercase'>
                      Selected Content
                    </Heading>
                    <Text pt='2' fontSize='sm'>
                      {jsonFileContent.selectedContent}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size='xs' textTransform='uppercase'>
                      Proof
                    </Heading>
                    <Text pt='2' fontSize='sm'>
                      {jsonFileContent.proof}
                    </Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </Box>
          <Box mt="2">
            {
              (isConnected && address) && (
                <Center>
                  <Button colorScheme='blue' size='lg' onClick={() => verifyProof(wasmWorkerApi, address, jsonFileContent)}>
                    Verify Proof
                  </Button>
                </Center>
              )
            }
          </Box>
        </>
        ) : <></>
      }
    </>
  );
};