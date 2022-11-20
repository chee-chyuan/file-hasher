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
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Navbar } from "../components";
import FileUpload from "../components/FileUpload";
import Label from "../components/Label";
import { ExportCertificateCSV } from "../helper/export";

const Home: NextPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    ExportCertificateCSV(["test1"], ["test2"])
  }, [])

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
