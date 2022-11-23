import { Input, useMultiStyleConfig } from "@chakra-ui/react";
import * as React from "react";
import { ethers } from "ethers";
// import { getFileCommitment } from "../api/utils";
// import "dotenv"
import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, StackDivider, Box, Text, Button, Center } from '@chakra-ui/react'
import { Remote } from "comlink";
import { FileHasher } from "../file-hasher.worker";

export type VerifyProps = {
    wasmWorkerApi: Remote<FileHasher>;
  };

export default function Verify({ wasmWorkerApi} : VerifyProps) {
  const styles = useMultiStyleConfig("Button", { variant: "outline" });
  const [jsonFileContent, setJsonFileContent] = React.useState<any>();

  const verification = async function (e: any) {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      console.log(e)
      const result = e?.target?.result;
      const jsonResult = JSON.parse(result);
      setJsonFileContent(jsonResult)
      // setJsonFileContent({})
      // console.log(JSON.parse(result));
      const abi = `
      [{
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "fileHashRingBuffers",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "ringBufferIndexes",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }]`
    // console.log("Contract address is ",process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, abi, new ethers.providers.AlchemyProvider("goerli",process.env.NEXT_PUBLIC_ALCHEMY_API_KEY))
    const currIndex = await contract.ringBufferIndexes(jsonResult.address)
    const commitmentHash = await contract.fileHashRingBuffers(currIndex);
    const verifyResult = await wasmWorkerApi.verifyProof(jsonFileContent.proof, jsonFileContent.selectedRow, jsonFileContent.selectedContent, commitmentHash);
    alert(verifyResult);
    // console.log(contract)
    // await getFileCommitment(["1","2"], ["3","4"])
    }
    // console.log(data);
    reader.readAsText(e.target?.files[0]);
  }

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
        onChange={verification}
      />

      {jsonFileContent ? 
        (<>
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
                {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}
              </Text>
            </Box>
            <Box>
              <Heading size='xs' textTransform='uppercase'>
                Verifier Address
              </Heading>
              <Text pt='2' fontSize='sm'>
                {jsonFileContent.address}
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
      <Center>
        <Button colorScheme='blue' size='lg'>
        Verify
        </Button>
      </Center>
     </>
      ) : <></>
      }
    </>
  );
};