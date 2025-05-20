import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar as CalendarIcon, 
  Filter, 
  Plus,
  Save,
  Trash2
} from "lucide-react";

// Mock data for service orders
const mockServiceOrders = [
  {
    id: "OS001",
    title: "Falha de comunicação Inversor 01",
    equipment: "Inversor 01",
    priority: "Alta",
    status: "Em andamento",
    createdAt: "2025-05-15T14:30:00",
    scheduledDate: "2025-05-20T10:00:00",
    assignedTo: "Técnico João Silva",
    description: "Inversor não está se comunicando com o sistema de monitoramento."
  },
  {
    id: "OS002",
    title: "Manutenção preventiva String Box 02",
    equipment: "String Box 02",
    priority: "Média",
    status: "Agendado",
    createdAt: "2025-05-16T09:15:00",
    scheduledDate: "2025-05-25T09:00:00",
    assignedTo: "Técnico Pedro Santos",
    description: "Manutenção preventiva mensal da String Box 02."
  },
  {
    id: "OS003",
    title: "Limpeza dos módulos - Setor A",
    equipment: "Módulos Fotovoltaicos",
    priority: "Baixa",
    status: "Concluído",
    createdAt: "2025-05-10T11:00:00",
    scheduledDate: "2025-05-12T08:00:00",
    assignedTo: "Equipe de Limpeza",
    description: "Limpeza programada dos módulos fotovoltaicos do setor A."
  },
  {
    id: "OS004",
    title: "Substituição de fusível - String Box 01",
    equipment: "String Box 01",
    priority: "Alta",
    status: "Pendente",
    createdAt: "2025-05-18T16:45:00",
    scheduledDate: "2025-05-22T14:00:00",
    assignedTo: "Não atribuído",
    description: "Fusível queimado na String A do String Box 01."
  },
  {
    id: "OS005",
    title: "Verificação de temperatura - Inversor 03",
    equipment: "Inversor 03",
    priority: "Média",
    status: "Em andamento",
    createdAt: "2025-05-17T13:20:00",
    scheduledDate: "2025-05-21T11:30:00",
    assignedTo: "Técnico Roberto Alves",
    description: "Verificar alta temperatura registrada no Inversor 03 nas últimas 24 horas."
  },
];

const ServiceOrders = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orderData, setOrderData] = useState(mockServiceOrders);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    id: "",
    title: "",
    equipment: "",
    priority: "Média",
    status: "Pendente",
    createdAt: "",
    scheduledDate: new Date(),
    assignedTo: "",
    description: ""
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewOrder({
      ...newOrder,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewOrder({
      ...newOrder,
      [name]: value
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewOrder({
        ...newOrder,
        scheduledDate: date
      });
    }
  };

  const generateOrderId = () => {
    const lastOrderId = orderData.length > 0 
      ? parseInt(orderData[orderData.length - 1].id.replace("OS", ""))
      : 0;
    return `OS${String(lastOrderId + 1).padStart(3, '0')}`;
  };

  const handleCreateOrder = () => {
    // Validate form
    if (!newOrder.title || !newOrder.equipment || !newOrder.description) {
      toast({
        title: "Erro ao criar ordem",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Create new order with current date and generated ID
    const currentDate = new Date().toISOString();
    const orderId = generateOrderId();
    
    const createdOrder = {
      ...newOrder,
      id: orderId,
      createdAt: currentDate,
      scheduledDate: newOrder.scheduledDate.toISOString(),
      status: newOrder.status || "Pendente"
    };

    // Add to orders list
    const updatedOrders = [...orderData, createdOrder];
    setOrderData(updatedOrders);
    
    // Reset form and close dialog
    setNewOrder({
      id: "",
      title: "",
      equipment: "",
      priority: "Média",
      status: "Pendente",
      createdAt: "",
      scheduledDate: new Date(),
      assignedTo: "",
      description: ""
    });
    
    setDialogOpen(false);
    
    // Show success toast
    toast({
      title: "Ordem de serviço criada",
      description: `Ordem ${orderId} criada com sucesso.`,
      variant: "default"
    });
    
    // Select the newly created order
    setSelectedOrder(orderId);
  };

  const handleDeleteOrder = () => {
    if (selectedOrder) {
      const updatedOrders = orderData.filter(order => order.id !== selectedOrder);
      setOrderData(updatedOrders);
      setDeleteDialogOpen(false);
      setSelectedOrder(null);
      
      toast({
        title: "Ordem de serviço excluída",
        description: `Ordem ${selectedOrder} foi excluída com sucesso.`,
        variant: "default"
      });
    }
  };

  const filterOrders = (status?: string) => {
    if (status && status !== "all") {
      const statusMap: Record<string, string> = {
        "pending": "Pendente",
        "inProgress": "Em andamento",
        "scheduled": "Agendado",
        "completed": "Concluído"
      };
      return orderData.filter(order => order.status === statusMap[status]);
    }
    return orderData;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pendente":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case "Em andamento":
        return <Badge className="bg-blue-500">Em andamento</Badge>;
      case "Agendado":
        return <Badge className="bg-purple-500">Agendado</Badge>;
      case "Concluído":
        return <Badge className="bg-green-500">Concluído</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Alta":
        return <Badge className="bg-red-500">Alta</Badge>;
      case "Média":
        return <Badge className="bg-orange-500">Média</Badge>;
      case "Baixa":
        return <Badge className="bg-green-500">Baixa</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getOrderDetails = (id: string) => {
    return orderData.find(order => order.id === id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ordens de Serviço</h1>
          <p className="text-muted-foreground">
            Gerenciamento de manutenções e chamados técnicos da usina
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          <Button 
            className="flex items-center gap-2" 
            variant="default"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Nova Ordem
          </Button>
        </div>
      </div>

      {/* Nova Ordem Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nova Ordem de Serviço</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar uma nova ordem de serviço.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Título da ordem de serviço"
                  value={newOrder.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipamento</Label>
                <Input
                  id="equipment"
                  name="equipment"
                  placeholder="Nome do equipamento"
                  value={newOrder.equipment}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select 
                  value={newOrder.priority} 
                  onValueChange={(value) => handleSelectChange("priority", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newOrder.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Agendado">Agendado</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Data de Agendamento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newOrder.scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newOrder.scheduledDate ? (
                      format(newOrder.scheduledDate, "dd/MM/yyyy")
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newOrder.scheduledDate}
                    onSelect={handleDateChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Responsável</Label>
              <Input
                id="assignedTo"
                name="assignedTo"
                placeholder="Nome do responsável"
                value={newOrder.assignedTo}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descreva o problema ou serviço a ser realizado"
                value={newOrder.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button 
              type="submit" 
              onClick={handleCreateOrder}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Criar Ordem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Ordem de Serviço</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta ordem de serviço? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteOrder}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="inProgress">Em andamento</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Lista de Ordens de Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Equipamento</TableHead>
                        <TableHead>Prioridade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterOrders(activeTab).map((order) => (
                        <TableRow 
                          key={order.id}
                          className={`cursor-pointer hover:bg-muted ${selectedOrder === order.id ? 'bg-muted' : ''}`}
                          onClick={() => setSelectedOrder(order.id)}
                        >
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.title}</TableCell>
                          <TableCell>{order.equipment}</TableCell>
                          <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            <div>
              {selectedOrder ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Detalhes da OS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(() => {
                      const order = getOrderDetails(selectedOrder);
                      if (!order) return <p>Ordem não encontrada</p>;
                      
                      return (
                        <>
                          <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold">{order.id}</h2>
                            {getStatusBadge(order.status)}
                          </div>
                          
                          <h3 className="text-lg font-semibold">{order.title}</h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span>Criada em: {formatDate(order.createdAt)}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Agendada para: {formatDate(order.scheduledDate)}</span>
                            </div>
                            
                            <div className="border-t pt-2">
                              <p className="text-sm font-medium mb-1">Equipamento:</p>
                              <p>{order.equipment}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Prioridade:</p>
                              <div>{getPriorityBadge(order.priority)}</div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Responsável:</p>
                              <p>{order.assignedTo}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Descrição:</p>
                              <p className="text-sm">{order.description}</p>
                            </div>
                          </div>
                          
                          <div className="pt-4 flex gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Relatório
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="w-full"
                            >
                              {order.status === "Concluído" ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Concluído
                                </>
                              ) : (
                                <>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Atualizar
                                </>
                              )}
                            </Button>
                          </div>
                          
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => setDeleteDialogOpen(true)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir Ordem
                          </Button>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-[300px]">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma ordem selecionada</h3>
                    <p className="text-sm text-muted-foreground">
                      Selecione uma ordem de serviço para visualizar seus detalhes.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {/* Same content structure as "all" but with filtered data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Ordens Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Equipamento</TableHead>
                        <TableHead>Prioridade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterOrders("pending").map((order) => (
                        <TableRow 
                          key={order.id}
                          className={`cursor-pointer hover:bg-muted ${selectedOrder === order.id ? 'bg-muted' : ''}`}
                          onClick={() => setSelectedOrder(order.id)}
                        >
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.title}</TableCell>
                          <TableCell>{order.equipment}</TableCell>
                          <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            <div>
              {selectedOrder && filterOrders("pending").some(order => order.id === selectedOrder) ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Detalhes da OS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(() => {
                      const order = getOrderDetails(selectedOrder);
                      if (!order) return <p>Ordem não encontrada</p>;
                      
                      return (
                        <>
                          <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold">{order.id}</h2>
                            {getStatusBadge(order.status)}
                          </div>
                          
                          <h3 className="text-lg font-semibold">{order.title}</h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span>Criada em: {formatDate(order.createdAt)}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Agendada para: {formatDate(order.scheduledDate)}</span>
                            </div>
                            
                            <div className="border-t pt-2">
                              <p className="text-sm font-medium mb-1">Equipamento:</p>
                              <p>{order.equipment}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Prioridade:</p>
                              <div>{getPriorityBadge(order.priority)}</div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Responsável:</p>
                              <p>{order.assignedTo}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Descrição:</p>
                              <p className="text-sm">{order.description}</p>
                            </div>
                          </div>
                          
                          <div className="pt-4 flex gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Relatório
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="w-full"
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Atualizar
                            </Button>
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-[300px]">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma ordem selecionada</h3>
                    <p className="text-sm text-muted-foreground">
                      Selecione uma ordem de serviço para visualizar seus detalhes.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inProgress">
          {/* Same structure but with "in progress" filtered data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Ordens em Andamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Equipamento</TableHead>
                        <TableHead>Prioridade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterOrders("inProgress").map((order) => (
                        <TableRow 
                          key={order.id}
                          className={`cursor-pointer hover:bg-muted ${selectedOrder === order.id ? 'bg-muted' : ''}`}
                          onClick={() => setSelectedOrder(order.id)}
                        >
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.title}</TableCell>
                          <TableCell>{order.equipment}</TableCell>
                          <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            {/* Order details panel - same as previous tabs */}
            <div>
              {selectedOrder && filterOrders("inProgress").some(order => order.id === selectedOrder) ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Detalhes da OS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Same order details structure */}
                    {(() => {
                      const order = getOrderDetails(selectedOrder);
                      if (!order) return <p>Ordem não encontrada</p>;
                      
                      return (
                        <>
                          <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold">{order.id}</h2>
                            {getStatusBadge(order.status)}
                          </div>
                          
                          <h3 className="text-lg font-semibold">{order.title}</h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span>Criada em: {formatDate(order.createdAt)}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Agendada para: {formatDate(order.scheduledDate)}</span>
                            </div>
                            
                            <div className="border-t pt-2">
                              <p className="text-sm font-medium mb-1">Equipamento:</p>
                              <p>{order.equipment}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Prioridade:</p>
                              <div>{getPriorityBadge(order.priority)}</div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Responsável:</p>
                              <p>{order.assignedTo}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Descrição:</p>
                              <p className="text-sm">{order.description}</p>
                            </div>
                          </div>
                          
                          <div className="pt-4 flex gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Relatório
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="w-full"
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Atualizar
                            </Button>
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-[300px]">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma ordem selecionada</h3>
                    <p className="text-sm text-muted-foreground">
                      Selecione uma ordem de serviço para visualizar seus detalhes.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="completed">
          {/* Same structure but with completed filtered data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Ordens Concluídas</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Equipamento</TableHead>
                        <TableHead>Prioridade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterOrders("completed").map((order) => (
                        <TableRow 
                          key={order.id}
                          className={`cursor-pointer hover:bg-muted ${selectedOrder === order.id ? 'bg-muted' : ''}`}
                          onClick={() => setSelectedOrder(order.id)}
                        >
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.title}</TableCell>
                          <TableCell>{order.equipment}</TableCell>
                          <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            {/* Order details panel - same as previous tabs */}
            <div>
              {selectedOrder && filterOrders("completed").some(order => order.id === selectedOrder) ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Detalhes da OS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Same order details structure */}
                    {(() => {
                      const order = getOrderDetails(selectedOrder);
                      if (!order) return <p>Ordem não encontrada</p>;
                      
                      return (
                        <>
                          <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold">{order.id}</h2>
                            {getStatusBadge(order.status)}
                          </div>
                          
                          <h3 className="text-lg font-semibold">{order.title}</h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span>Criada em: {formatDate(order.createdAt)}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Agendada para: {formatDate(order.scheduledDate)}</span>
                            </div>
                            
                            <div className="border-t pt-2">
                              <p className="text-sm font-medium mb-1">Equipamento:</p>
                              <p>{order.equipment}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Prioridade:</p>
                              <div>{getPriorityBadge(order.priority)}</div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Responsável:</p>
                              <p>{order.assignedTo}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Descrição:</p>
                              <p className="text-sm">{order.description}</p>
                            </div>
                          </div>
                          
                          <div className="pt-4 flex gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Relatório
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="w-full"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Concluído
                            </Button>
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-[300px]">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma ordem selecionada</h3>
                    <p className="text-sm text-muted-foreground">
                      Selecione uma ordem de serviço para visualizar seus detalhes.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceOrders;
