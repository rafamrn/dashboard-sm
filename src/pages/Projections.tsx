
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type MonthProjection = {
  month: string;
  name: string;
  projected: number;
  actual?: number;
}

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const initialProjections: MonthProjection[] = months.map((month, index) => {
  const baseValue = 2000 + Math.cos((index / 12) * Math.PI * 2) * 1000;
  const projected = Math.round(baseValue);
  const actual = index < new Date().getMonth() 
    ? Math.round(projected * (0.85 + Math.random() * 0.3)) 
    : undefined;
  
  return {
    month: month.substring(0, 3),
    name: month,
    projected,
    actual
  };
});

const Projections = () => {
  const [projections, setProjections] = useState<MonthProjection[]>(initialProjections);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(projections[index].projected.toString());
  };
  
  const saveEdit = () => {
    if (editingIndex !== null) {
      const newValue = parseFloat(editValue);
      if (!isNaN(newValue) && newValue >= 0) {
        const updatedProjections = [...projections];
        updatedProjections[editingIndex] = {
          ...updatedProjections[editingIndex],
          projected: newValue
        };
        setProjections(updatedProjections);
      }
      setEditingIndex(null);
    }
  };
  
  const cancelEdit = () => {
    setEditingIndex(null);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projeções Mensais</h1>
        <p className="text-muted-foreground">
          Defina as metas de produção para cada mês do ano
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Metas de Geração</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projections.map((projection, index) => (
                <div key={projection.name} className="flex items-center justify-between">
                  <Label className="w-24">{projection.name}</Label>
                  
                  {editingIndex === index ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-28"
                      />
                      <div>
                        <Button variant="outline" size="sm" onClick={saveEdit} className="mr-1">
                          Salvar
                        </Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="w-28 text-right font-medium">
                        {projection.projected.toLocaleString()} kWh
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => startEditing(index)}>
                        Editar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Projections;
