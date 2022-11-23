import { Flex, FlexProps } from "@chakra-ui/react";

const BaseContainer = (props: FlexProps) => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      {...props}
    />
  );
};

export default BaseContainer;
