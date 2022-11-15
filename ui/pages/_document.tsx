import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";

class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="description" content="Rainplate" />
        </Head>
        <body>
          {/* Make Color mode to persists when you refresh the page. */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
