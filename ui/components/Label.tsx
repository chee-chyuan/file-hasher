import { Box, Flex, Heading } from "@chakra-ui/react";

type LabelProps = {
  size?: string,
  children: JSX.Element | string
}

const Label = ({ size = 'sm', children }: LabelProps) => {
  return (
    <Heading as='div' size={size} sx={{ marginBottom: "0.25rem" }}>
      {children}
    </Heading>
  );
};

export default Label;
