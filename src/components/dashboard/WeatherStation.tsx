
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Sun, Thermometer } from "lucide-react";

// Mock data for weather station
const generateWeatherData = () => {
  const data = [];
  const now = new Date();
  const startHour = now.getHours() - 8; // Last 8 hours
  
  for (let i = 0; i <= 8; i++) {
    const hour = (startHour + i) % 24;
    const irradiance = 200 + Math.random() * 800 * Math.sin(Math.PI * (hour - 6) / 12);
    const temperature = 25 + Math.random() * 15 * Math.sin(Math.PI * (hour - 7) / 13);
    
    data.push({
      time: `${hour}:00`,
      irradiance: Math.max(0, irradiance < 200 ? 0 : Math.round(irradiance)),
      temperature: Math.round(temperature * 10) / 10,
    });
  }
  
  return data;
};

const WeatherStation = () => {
  const [weatherData] = React.useState(generateWeatherData());
  
  const currentIrradiance = weatherData[weatherData.length - 1].irradiance;
  const currentTemperature = weatherData[weatherData.length - 1].temperature;
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-5 w-5" />
          Estação Meteorológica
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3 border rounded-lg p-3">
            <Sun className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Irradiância</p>
              <p className="text-2xl font-bold">{currentIrradiance} W/m²</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border rounded-lg p-3">
            <Thermometer className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Temperatura</p>
              <p className="text-2xl font-bold">{currentTemperature}°C</p>
            </div>
          </div>
        </div>
        
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={weatherData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" label={{ value: 'Irradiância (W/m²)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Temperatura (°C)', angle: -90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="irradiance" name="Irradiância" stroke="#F59E0B" dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="temperature" name="Temperatura" stroke="#EF4444" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherStation;
