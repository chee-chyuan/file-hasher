import { Box, Button, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { BaseContainer } from "../containers";
import { FlexibleFormTable } from "../tables";

type RowDatas = {
  rowTitles: string[];
  rowValues: string[];
};

export const CreateFormPanel = () => {
  const [rowData, setRowData] = useState<RowDatas>();

  const onDataChange = (data: RowDatas) => {
    setRowData(data);
  };
  const onCreate = () => {
    // Do something
  };

  return (
    <BaseContainer>
      <Stack padding="6" spacing="12">
        <FlexibleFormTable onChange={onDataChange} />
        <Box w="100%" marginLeft="auto" marginRight="auto">
          <Button
            loadingText="Creating..."
            variant="solid"
            size="lg"
            w="full"
            colorScheme="teal"
            onClick={onCreate}
          >
            Create form
          </Button>
        </Box>
      </Stack>
    </BaseContainer>
  );
};
