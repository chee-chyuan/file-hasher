import {
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { Navbar } from "./components";
import { CreateFormPanel } from "./components/tab-panels/CreateFormPanel";
import { GenerateProofPanel } from "./components/tab-panels/GenerateProofPanel";
import { VerifyFormPanel } from "./components/tab-panels/VerifyFormPanel";
import { FileHasherProps } from "./file-hasher-types";

export const MainPage = ({ wasmWorkerApi }: FileHasherProps) => {
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
              <CreateFormPanel wasmWorkerApi={wasmWorkerApi} />
            </TabPanel>
            <TabPanel>
              <GenerateProofPanel wasmWorkerApi={wasmWorkerApi} />
            </TabPanel>
            <TabPanel>
              <VerifyFormPanel wasmWorkerApi={wasmWorkerApi} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  );
};
