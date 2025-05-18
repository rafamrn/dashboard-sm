
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sun } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      
      // Simple validation for demo purposes
      if (username.trim() && password.trim()) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema de monitoramento",
        });
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Usuário ou senha inválidos",
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="solar-gradient rounded-full p-3 shadow-lg dark:bg-gray-800 dark:shadow-gray-700/30">
            <Sun className="h-10 w-10 text-yellow-300" />
          </div>
        </div>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold dark:text-white">SolarMonitor</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Sistema de Monitoramento de Usina Solar Fotovoltaica
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="dark:text-gray-300">Usuário</Label>
                <Input
                  id="username"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-gray-300">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full dark:bg-blue-600 dark:hover:bg-blue-700" 
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
