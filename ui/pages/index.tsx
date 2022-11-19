import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Img,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Navbar } from "../components";
import FileUpload from "../components/FileUpload";
import Label from "../components/Label";
import FileHasher from "../artifacts/contracts/FileHash.sol/FileHash.json"

const Home: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  const getOwner = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const fileHasher = new ethers.Contract(
          FileHasher.contractAddress,
          FileHasher.abi,
          signer
        )

        let fileHashOwner = await fileHasher.owner()
        console.log("fileHashOwner: ", fileHashOwner)

      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => setMounted(true), []);
  return (
    <>
      <Head>
        <title>ZK Form</title>
      </Head>
      <Flex
        paddingX={12}
        flexDirection="column"
        paddingY={0}
        margin={0}
        width="100%"
        height="100%"
        maxWidth="100%"
        maxHeight="100%"
        gap={4}
      >
        <Navbar />
        <Tabs>
          <TabList>
            <Tab>Create Form</Tab>
            <Tab>Generate Proof</Tab>
            <Tab>Verify Proof</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>one!</p>
              <Label>asdfasdf</Label>
              <FileUpload />
              <Button onClick={getOwner}>Test</Button>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  );
};

export default Home;
