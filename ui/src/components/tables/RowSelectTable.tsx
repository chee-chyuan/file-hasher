import { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";

export type RowSelectTableProps = {
  rowTitles?: string[];
  rowValues?: string[];
  onChange?: (nextVal: string) => any;
};

export const RowSelectTable = ({
  rowTitles = [],
  rowValues = [],
  onChange = () => {},
}: RowSelectTableProps) => {
  const [selectedRow, setSelectedRow] = useState(rowTitles[0]);

  const onRowSelected = (nextVal: string) => {
    setSelectedRow(nextVal);
    onChange(nextVal);
  };

  return (
    <TableContainer w="100%">
      <form>
        <RadioGroup value={selectedRow} onChange={onRowSelected}>
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th>Keys</Th>
                <Th>Value</Th>
                <Th>Selection</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rowTitles.map((row, idx) => (
                <Tr key={idx}>
                  <Td>{row}</Td>
                  <Td>{rowValues[idx]}</Td>
                  <Td>
                    <Radio value={row} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </RadioGroup>
      </form>
    </TableContainer>
  );
};
