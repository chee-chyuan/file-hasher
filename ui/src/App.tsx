import React, { Component, useEffect } from "react";
import { Helmet } from "react-helmet";
import { wrap } from "comlink";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./styles";
import {
  darkTheme,
  DisclaimerComponent,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import "material-react-toastify/dist/ReactToastify.css";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MainPage } from "./MainPage";

const { chains, provider } = configureChains(
  [
    chain.mainnet,
    chain.goerli,
    chain.polygon,
    chain.polygonMumbai,
    chain.optimism,
    chain.arbitrum,
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "zk-form",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the{" "}
    <Link href="https://termsofservice.xyz">Terms of Service</Link> and
    acknowledge you have read and understand the protocol{" "}
    <Link href="https://disclaimer.xyz">Disclaimer</Link>
  </Text>
);

const App = () => {
  const worker = new Worker(new URL("./file-hasher-worker", import.meta.url), {
    name: "file-hasher-worker",
    type: "module",
  });
  const workerApi =
    wrap<import("./file-hasher-worker").FileHasherWorker>(worker);

  // const testAllFlow = async () => {
  //   const rowTitles = ["1", "1"];
  //   const rowContent = ["1", "1"];
  //   const fileCommitmentHex = await workerApi.getFileCommitment(
  //     rowTitles,
  //     rowContent
  //   );
  //   const proof = await workerApi.getProof(rowTitles, rowContent, 0);
  //   const verifyResult = await workerApi.verifyProof(
  //     proof,
  //     "1",
  //     "1",
  //     fileCommitmentHex
  //   );
  //   console.log("verify result is ", verifyResult);
  // };

  // testAllFlow();

  workerApi.testAllFlow();

  return (
    <>
      <Helmet>
        <title>Zk Form</title>
      </Helmet>

      {/* <FileHasherWorkerProvider worker={workerApiRef}> */}
      <ChakraProvider resetCSS theme={theme}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            chains={chains}
            theme={darkTheme({
              ...darkTheme.accentColors.blue,
            })}
            appInfo={{
              disclaimer: Disclaimer,
            }}
            coolMode
          >
            <MainPage />
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
      {/* </FileHasherWorkerProvider> */}
    </>
  );
};

export default App;
