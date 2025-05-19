
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StringData {
  id: string;
  name: string;
  voltage: number;
  current: number;
  power: number;
}

interface StringDetailsProps {
  inverterName: string;
  strings: StringData[];
}

const StringDetails = ({ inverterName, strings }: StringDetailsProps) => {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Strings do {inverterName}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>String</TableHead>
              <TableHead>Tensão (V)</TableHead>
              <TableHead>Corrente (A)</TableHead>
              <TableHead>Potência (W)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {strings.map((string) => (
              <TableRow key={string.id}>
                <TableCell className="font-medium">{string.name}</TableCell>
                <TableCell>{string.voltage.toFixed(1)}</TableCell>
                <TableCell>{string.current.toFixed(2)}</TableCell>
                <TableCell>{string.power.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StringDetails;
