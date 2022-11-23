import { Button, ButtonProps, Card } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { gradient1LinearString } from "../styles/gradients";

export const HighlightedButtonSection = (
  props: PropsWithChildren<ButtonProps>
) => {
  return (
    <Card
      w="100%"
      h="100px"
      bgGradient={gradient1LinearString}
      borderRadius="lg"
      justifyContent="center"
      alignContent="center"
    >
      <Button {...props} />
    </Card>
  );
};
