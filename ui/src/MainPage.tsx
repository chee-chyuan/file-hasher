import {
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { Navbar } from "./components";
import { FileHasher } from "./file-hasher.worker";
import { Remote } from "comlink";
import { CreateFormPanel } from "./components/tab-panels/CreateFormPanel";
import { GenerateProofPanel } from "./components/tab-panels/GenerateProofPanel";
import { VerifyProofPanel } from "./components/tab-panels/VerifyProofPanel";

export type MainPageProps = {
  wasmWorkerApi: Remote<FileHasher>;
};

export const MainPage = ({ wasmWorkerApi }: MainPageProps) => {
  return (
    <>
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

          {/* Content */}
          <TabPanels>
            <TabPanel>
              <CreateFormPanel />
            </TabPanel>
            <TabPanel>
              <GenerateProofPanel />
            </TabPanel>
            <TabPanel>
              <VerifyProofPanel />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  );
};
