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
import { WarningNoWallet } from "./components/WarningNoWallet";
import { FileHasherProps } from "./file-hasher-types";
import { useAccount } from "wagmi";

export const MainPage = ({ wasmWorkerApi }: FileHasherProps) => {
  const { isConnected } = useAccount();
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
              {!isConnected ?
                <WarningNoWallet /> :
                <CreateFormPanel wasmWorkerApi={wasmWorkerApi} />}
            </TabPanel>
            <TabPanel>
              {!isConnected ?
                <WarningNoWallet /> :
                <GenerateProofPanel wasmWorkerApi={wasmWorkerApi} />}
            </TabPanel>
            <TabPanel>
              {!isConnected ?
                <WarningNoWallet /> :
                <VerifyFormPanel wasmWorkerApi={wasmWorkerApi} />}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  );
};
