
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StringData {
  id: string;
  voltage: number;
  current: number;
}

interface StringBoxProps {
  title: string;
  data: StringData[];
}

const StringBox = ({ title, data }: StringBoxProps) => {
  return (
    <Card>
      <CardHeader className="bg-primary text-primary-foreground pb-2 pt-2 px-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-2 gap-2">
          {data.map((string) => (
            <div key={string.id} className="border rounded p-2 text-center">
              <div className="mb-1 text-xs text-muted-foreground">{string.id}</div>
              <div className="font-semibold">{string.voltage.toFixed(1)} V</div>
              <div className="text-sm">{string.current.toFixed(2)} A</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StringBox;
