import { Box, Button, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { BaseContainer } from "../containers";
import { FileUpload } from "../FileUpload";
import { RowSelectTable } from "../tables";

export const GenerateProofPanel = () => {
  const [isUploaded, setIsUploaded] = useState<boolean>(true);

  return (
    <BaseContainer>
      <Stack padding="6" spacing="12" alignItems="center" w="100%">
        <Box margin="auto">
          <FileUpload onFileUploaded={() => {}} accept="text/csv" />
        </Box>
        {isUploaded ? (
          <Stack w="100%" spacing="12" margin="auto">
            <RowSelectTable
              rowTitles={["1", "2"]}
              rowValues={["c", "dd"]}
              onChange={(v) => console.log(v)}
            />
            <Button
              loadingText="Generating..."
              variant="solid"
              size="lg"
              w="full"
              colorScheme="teal"
            >
              Generate proof
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </BaseContainer>
  );
};
