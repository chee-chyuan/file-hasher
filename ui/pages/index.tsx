import {
  Flex,
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
import { FlexibleFormTable } from "../components/tables/FlexibleFormTable";
import FileUpload from "../components/FileUpload";
import FileHasher from "../artifacts/contracts/FileHash.sol/FileHash.json";

const Home: NextPage = () => {
  const [mounted, setMounted] = useState(false);
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
              <FlexibleFormTable />
              <FileUpload />
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
