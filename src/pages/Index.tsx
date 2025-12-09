import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  phone: string;
  car: string;
  lastVisit: string;
}

interface Income {
  id: string;
  date: string;
  source: string;
  amount: number;
  description: string;
}

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}

interface Appointment {
  id: string;
  date: Date;
  clientName: string;
  car: string;
  plateNumber: string;
  phone: string;
  time: string;
}

interface Vehicle {
  id: string;
  name: string;
  year: string;
  vin: string;
  registration: string;
  previousOwner: string;
  price: number;
  expenses: VehicleExpense[];
}

interface VehicleExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

interface RepairJob {
  id: string;
  carBrand: string;
  carModel: string;
  clientName: string;
  clientPhone: string;
  parts: RepairPart[];
  notes: string;
  status: 'waiting' | 'in_progress' | 'completed';
  createdAt: string;
}

interface RepairPart {
  id: string;
  name: string;
  quantity: number;
  purchased: boolean;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('repairs');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isRepairDialogOpen, setIsRepairDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<RepairJob | null>(null);
  const [newPartName, setNewPartName] = useState('');
  const [newPartQuantity, setNewPartQuantity] = useState(1);

  const [clients, setClients] = useState<Client[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [repairJobs, setRepairJobs] = useState<RepairJob[]>([]);

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const profit = totalIncome - totalExpenses;

  const addRepairJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newJob: RepairJob = {
      id: Date.now().toString(),
      carBrand: formData.get('carBrand') as string,
      carModel: formData.get('carModel') as string,
      clientName: formData.get('clientName') as string,
      clientPhone: formData.get('clientPhone') as string,
      parts: [],
      notes: formData.get('notes') as string,
      status: 'waiting',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRepairJobs([newJob, ...repairJobs]);
    toast.success('Автомобиль добавлен в ремонт');
    setIsRepairDialogOpen(false);
    e.currentTarget.reset();
  };

  const addPartToRepair = (repairId: string) => {
    if (!newPartName.trim()) {
      toast.error('Введите название детали');
      return;
    }
    
    const newPart: RepairPart = {
      id: Date.now().toString(),
      name: newPartName,
      quantity: newPartQuantity,
      purchased: false,
    };
    
    setRepairJobs(
      repairJobs.map((job) =>
        job.id === repairId ? { ...job, parts: [...job.parts, newPart] } : job
      )
    );
    setNewPartName('');
    setNewPartQuantity(1);
    toast.success('Деталь добавлена');
  };

  const togglePartPurchased = (repairId: string, partId: string) => {
    setRepairJobs(
      repairJobs.map((job) =>
        job.id === repairId
          ? {
              ...job,
              parts: job.parts.map((part) =>
                part.id === partId ? { ...part, purchased: !part.purchased } : part
              ),
            }
          : job
      )
    );
  };

  const updateRepairStatus = (repairId: string, status: RepairJob['status']) => {
    setRepairJobs(repairJobs.map((job) => (job.id === repairId ? { ...job, status } : job)));
    toast.success('Статус обновлён');
  };

  const deleteRepairJob = (id: string) => {
    setRepairJobs(repairJobs.filter((job) => job.id !== id));
    toast.success('Запись удалена');
  };

  const addAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!selectedDate) {
      toast.error('Выберите дату');
      return;
    }
    
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      date: selectedDate,
      clientName: formData.get('clientName') as string,
      car: formData.get('car') as string,
      plateNumber: formData.get('plateNumber') as string,
      phone: formData.get('phone') as string,
      time: formData.get('time') as string,
    };
    
    setAppointments([...appointments, newAppointment]);
    toast.success('Клиент записан');
    setIsAppointmentDialogOpen(false);
    e.currentTarget.reset();
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
    toast.success('Запись удалена');
  };

  const addClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      car: formData.get('car') as string,
      lastVisit: new Date().toISOString().split('T')[0],
    };
    setClients([...clients, newClient]);
    toast.success('Клиент добавлен');
    e.currentTarget.reset();
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter((c) => c.id !== id));
    toast.success('Клиент удалён');
  };

  const addOrUpdateIncome = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const incomeData: Income = {
      id: editingIncome?.id || Date.now().toString(),
      date: formData.get('date') as string || new Date().toISOString().split('T')[0],
      source: formData.get('source') as string,
      amount: Number(formData.get('amount')),
      description: formData.get('description') as string,
    };

    if (editingIncome) {
      setIncomes(incomes.map((inc) => (inc.id === editingIncome.id ? incomeData : inc)));
      toast.success('Доход обновлён');
    } else {
      setIncomes([...incomes, incomeData]);
      toast.success('Доход добавлен');
    }
    
    setEditingIncome(null);
    setIsIncomeDialogOpen(false);
    e.currentTarget.reset();
  };

  const deleteIncome = (id: string) => {
    setIncomes(incomes.filter((inc) => inc.id !== id));
    toast.success('Доход удалён');
  };

  const addOrUpdateExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!selectedCategory) {
      toast.error('Выберите категорию');
      return;
    }
    
    const expenseData: Expense = {
      id: editingExpense?.id || Date.now().toString(),
      date: formData.get('date') as string || new Date().toISOString().split('T')[0],
      category: selectedCategory,
      amount: Number(formData.get('amount')),
      description: formData.get('description') as string,
    };

    if (editingExpense) {
      setExpenses(expenses.map((exp) => (exp.id === editingExpense.id ? expenseData : exp)));
      toast.success('Расход обновлён');
    } else {
      setExpenses([...expenses, expenseData]);
      toast.success('Расход добавлен');
    }
    
    setEditingExpense(null);
    setSelectedCategory('');
    setIsExpenseDialogOpen(false);
    e.currentTarget.reset();
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
    toast.success('Расход удалён');
  };

  const addVehicle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      year: formData.get('year') as string,
      vin: formData.get('vin') as string,
      registration: formData.get('registration') as string,
      previousOwner: formData.get('previousOwner') as string,
      price: Number(formData.get('price')),
      expenses: [],
    };
    setVehicles([...vehicles, newVehicle]);
    toast.success('Автомобиль добавлен');
    setIsVehicleDialogOpen(false);
    e.currentTarget.reset();
  };

  const deleteVehicle = (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
    toast.success('Автомобиль удалён');
  };

  const addVehicleExpense = (vehicleId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newExpense: VehicleExpense = {
      id: Date.now().toString(),
      description: formData.get('description') as string,
      amount: Number(formData.get('amount')),
      date: new Date().toISOString().split('T')[0],
    };
    
    setVehicles(
      vehicles.map((v) =>
        v.id === vehicleId ? { ...v, expenses: [...v.expenses, newExpense] } : v
      )
    );
    toast.success('Расход на автомобиль добавлен');
    e.currentTarget.reset();
  };

  const getStatusBadge = (status: RepairJob['status']) => {
    const variants = {
      waiting: { label: 'Ожидание', className: 'bg-yellow-500/10 text-yellow-500' },
      in_progress: { label: 'В работе', className: 'bg-blue-500/10 text-blue-500' },
      completed: { label: 'Завершён', className: 'bg-green-500/10 text-green-500' },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Wrench" className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">АвтоМастер</h1>
                <p className="text-sm text-muted-foreground">Управление мастерской</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="repairs" className="gap-2">
              <Icon name="Wrench" size={18} />
              <span className="hidden sm:inline">В ремонте</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <Icon name="LayoutDashboard" size={18} />
              <span className="hidden sm:inline">Главная</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <Icon name="TrendingUp" size={18} />
              <span className="hidden sm:inline">Статистика</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="gap-2">
              <Icon name="Users" size={18} />
              <span className="hidden sm:inline">Клиенты</span>
            </TabsTrigger>
            <TabsTrigger value="finances" className="gap-2">
              <Icon name="Wallet" size={18} />
              <span className="hidden sm:inline">Финансы</span>
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="gap-2">
              <Icon name="Car" size={18} />
              <span className="hidden sm:inline">Автомобили</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Icon name="Calendar" size={18} />
              <span className="hidden sm:inline">Календарь</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="repairs" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Автомобили в ремонте</h2>
              <Dialog open={isRepairDialogOpen} onOpenChange={setIsRepairDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="Plus" size={18} />
                    Добавить автомобиль
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новый автомобиль в ремонт</DialogTitle>
                    <DialogDescription>Заполните информацию об автомобиле клиента</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={addRepairJob} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="carBrand">Марка</Label>
                        <Input id="carBrand" name="carBrand" placeholder="Toyota" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="carModel">Модель</Label>
                        <Input id="carModel" name="carModel" placeholder="Camry" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Имя клиента</Label>
                      <Input id="clientName" name="clientName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientPhone">Контактный номер</Label>
                      <Input id="clientPhone" name="clientPhone" type="tel" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Заметки</Label>
                      <Textarea id="notes" name="notes" placeholder="Описание работ, проблемы..." />
                    </div>
                    <Button type="submit" className="w-full">Добавить</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {repairJobs.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <p className="text-center text-muted-foreground">Нет автомобилей в ремонте</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {repairJobs.map((job) => (
                  <Card key={job.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <Icon name="Car" size={20} />
                            {job.carBrand} {job.carModel}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">{job.clientName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(job.status)}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <Icon name="Trash2" size={16} className="text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Удалить запись?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Это действие нельзя отменить.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteRepairJob(job.id)}>
                                  Удалить
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Icon name="Phone" size={16} className="text-muted-foreground" />
                          <span>{job.clientPhone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Calendar" size={16} className="text-muted-foreground" />
                          <span>Добавлено: {job.createdAt}</span>
                        </div>
                        {job.notes && (
                          <div className="pt-2 border-t">
                            <p className="text-muted-foreground text-xs mb-1">Заметки:</p>
                            <p className="text-sm">{job.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Статус работы</Label>
                        <Select
                          value={job.status}
                          onValueChange={(value) => updateRepairStatus(job.id, value as RepairJob['status'])}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="waiting">Ожидание</SelectItem>
                            <SelectItem value="in_progress">В работе</SelectItem>
                            <SelectItem value="completed">Завершён</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-sm mb-3">Детали к покупке</h4>
                        
                        <div className="flex gap-2 mb-3">
                          <Input
                            placeholder="Название детали"
                            value={newPartName}
                            onChange={(e) => setNewPartName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPartToRepair(job.id))}
                          />
                          <Input
                            type="number"
                            min="1"
                            value={newPartQuantity}
                            onChange={(e) => setNewPartQuantity(Number(e.target.value))}
                            className="w-20"
                          />
                          <Button size="sm" onClick={() => addPartToRepair(job.id)}>
                            <Icon name="Plus" size={14} />
                          </Button>
                        </div>

                        {job.parts.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-2">
                            Нет деталей
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {job.parts.map((part) => (
                              <div
                                key={part.id}
                                className="flex items-center justify-between text-sm p-2 bg-muted rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={() => togglePartPurchased(job.id, part.id)}
                                  >
                                    <Icon
                                      name={part.purchased ? 'CheckSquare' : 'Square'}
                                      size={16}
                                      className={part.purchased ? 'text-green-500' : ''}
                                    />
                                  </Button>
                                  <span className={part.purchased ? 'line-through text-muted-foreground' : ''}>
                                    {part.name} × {part.quantity}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Доходы</CardTitle>
                  <Icon name="TrendingUp" className="text-green-500" size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalIncome.toLocaleString()} ₽</div>
                  <p className="text-xs text-muted-foreground mt-1">За текущий месяц</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Расходы</CardTitle>
                  <Icon name="TrendingDown" className="text-red-500" size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalExpenses.toLocaleString()} ₽</div>
                  <p className="text-xs text-muted-foreground mt-1">За текущий месяц</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Прибыль</CardTitle>
                  <Icon name="DollarSign" className="text-primary" size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{profit.toLocaleString()} ₽</div>
                  <p className="text-xs text-muted-foreground mt-1">Чистая прибыль</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Wrench" size={20} />
                    В ремонте
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {repairJobs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Нет автомобилей в ремонте</p>
                  ) : (
                    <div className="space-y-3">
                      {repairJobs.slice(0, 3).map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">
                              {job.carBrand} {job.carModel}
                            </p>
                            <p className="text-sm text-muted-foreground">{job.clientName}</p>
                          </div>
                          {getStatusBadge(job.status)}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Calendar" size={20} />
                    Ближайшие записи
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {appointments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Нет записей</p>
                  ) : (
                    <div className="space-y-3">
                      {appointments.slice(0, 3).map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{apt.clientName}</p>
                            <p className="text-sm text-muted-foreground">{apt.car}</p>
                          </div>
                          <Badge variant="outline">{apt.time}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Статистика доходов и расходов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Доходы</span>
                      <span className="text-sm font-bold">{totalIncome.toLocaleString()} ₽</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{
                          width: totalIncome > 0 ? `${Math.min((totalIncome / (totalIncome + totalExpenses)) * 100, 100)}%` : '0%',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Расходы</span>
                      <span className="text-sm font-bold">{totalExpenses.toLocaleString()} ₽</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all"
                        style={{
                          width: totalExpenses > 0 ? `${Math.min((totalExpenses / (totalIncome + totalExpenses)) * 100, 100)}%` : '0%',
                        }}
                      />
                    </div>
                  </div>

                  {expenses.length > 0 && (
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold mb-4">Расходы по категориям</h3>
                      <div className="space-y-4">
                        {Object.entries(
                          expenses.reduce((acc: { [key: string]: number }, exp) => {
                            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                            return acc;
                          }, {})
                        ).map(([category, amount]) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-sm">{category}</span>
                            <span className="font-semibold">{amount.toLocaleString()} ₽</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">База клиентов</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="Plus" size={18} />
                    Добавить клиента
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новый клиент</DialogTitle>
                    <DialogDescription>Заполните информацию о клиенте</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={addClient} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">ФИО</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input id="phone" name="phone" type="tel" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="car">Автомобиль</Label>
                      <Input id="car" name="car" required />
                    </div>
                    <Button type="submit" className="w-full">Добавить</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {clients.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <p className="text-center text-muted-foreground">Добавьте первого клиента</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {clients.map((client) => (
                  <Card key={client.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Icon name="Trash2" size={16} className="text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Удалить клиента?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Это действие нельзя отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteClient(client.id)}>
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Phone" size={16} className="text-muted-foreground" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Car" size={16} className="text-muted-foreground" />
                        <span>{client.car}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                        <Icon name="Calendar" size={16} />
                        <span>Последний визит: {client.lastVisit}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="finances" className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Доходы и расходы</h2>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="TrendingUp" size={20} className="text-green-500" />
                      Доходы
                    </CardTitle>
                    <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => setEditingIncome(null)}>
                          <Icon name="Plus" size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingIncome ? 'Редактировать доход' : 'Новый доход'}</DialogTitle>
                          <DialogDescription>Заполните информацию о доходе</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={addOrUpdateIncome} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="income-date">Дата</Label>
                            <Input id="income-date" name="date" type="date" defaultValue={editingIncome?.date} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="source">Источник</Label>
                            <Input id="source" name="source" defaultValue={editingIncome?.source} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="income-amount">Сумма (₽)</Label>
                            <Input id="income-amount" name="amount" type="number" defaultValue={editingIncome?.amount} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="income-description">Описание</Label>
                            <Textarea id="income-description" name="description" defaultValue={editingIncome?.description} required />
                          </div>
                          <Button type="submit" className="w-full">{editingIncome ? 'Сохранить' : 'Добавить'}</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {incomes.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Добавьте первый доход</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {incomes.map((income) => (
                        <div key={income.id} className="flex items-center justify-between p-3 bg-muted rounded-lg group">
                          <div className="flex-1">
                            <p className="font-medium">{income.source}</p>
                            <p className="text-sm text-muted-foreground">{income.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{income.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-green-600">{income.amount.toLocaleString()} ₽</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingIncome(income);
                                setIsIncomeDialogOpen(true);
                              }}
                            >
                              <Icon name="Pencil" size={14} />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <Icon name="Trash2" size={14} className="text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Удалить доход?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Это действие нельзя отменить.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteIncome(income.id)}>
                                    Удалить
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="TrendingDown" size={20} className="text-red-500" />
                      Расходы
                    </CardTitle>
                    <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => setEditingExpense(null)}>
                          <Icon name="Plus" size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingExpense ? 'Редактировать расход' : 'Новый расход'}</DialogTitle>
                          <DialogDescription>Заполните информацию о расходе</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={addOrUpdateExpense} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="expense-date">Дата</Label>
                            <Input id="expense-date" name="date" type="date" defaultValue={editingExpense?.date} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category">Категория</Label>
                            <Select
                              value={selectedCategory || editingExpense?.category}
                              onValueChange={setSelectedCategory}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите категорию" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Запчасти">Запчасти</SelectItem>
                                <SelectItem value="Аренда">Аренда</SelectItem>
                                <SelectItem value="Инструменты">Инструменты</SelectItem>
                                <SelectItem value="Зарплата">Зарплата</SelectItem>
                                <SelectItem value="Коммунальные услуги">Коммунальные услуги</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="amount">Сумма (₽)</Label>
                            <Input id="amount" name="amount" type="number" defaultValue={editingExpense?.amount} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Описание</Label>
                            <Textarea id="description" name="description" defaultValue={editingExpense?.description} required />
                          </div>
                          <Button type="submit" className="w-full">{editingExpense ? 'Сохранить' : 'Добавить'}</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {expenses.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Добавьте первый расход</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">{expense.category}</Badge>
                            </div>
                            <p className="text-sm">{expense.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{expense.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-red-600">{expense.amount.toLocaleString()} ₽</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingExpense(expense);
                                setSelectedCategory(expense.category);
                                setIsExpenseDialogOpen(true);
                              }}
                            >
                              <Icon name="Pencil" size={14} />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <Icon name="Trash2" size={14} className="text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Удалить расход?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Это действие нельзя отменить.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteExpense(expense.id)}>
                                    Удалить
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Автомобили</h2>
              <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="Plus" size={18} />
                    Добавить автомобиль
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Новый автомобиль</DialogTitle>
                    <DialogDescription>Заполните информацию об автомобиле</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={addVehicle} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vehicle-name">Название</Label>
                        <Input id="vehicle-name" name="name" placeholder="Toyota Camry" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Год</Label>
                        <Input id="year" name="year" placeholder="2018" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vin">VIN / ХТА</Label>
                      <Input id="vin" name="vin" placeholder="JTDBT923XY1234567" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registration">СТС</Label>
                      <Input id="registration" name="registration" placeholder="77 АА 123456" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="previousOwner">Предыдущий владелец</Label>
                      <Input id="previousOwner" name="previousOwner" placeholder="Иванов И.И." required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicle-price">Цена покупки (₽)</Label>
                      <Input id="vehicle-price" name="price" type="number" required />
                    </div>
                    <Button type="submit" className="w-full">Добавить</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {vehicles.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <p className="text-center text-muted-foreground">Добавьте первый автомобиль</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Icon name="Car" size={20} />
                            {vehicle.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{vehicle.year} год</p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Icon name="Trash2" size={16} className="text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Удалить автомобиль?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Это действие нельзя отменить. Все расходы на автомобиль также будут удалены.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteVehicle(vehicle.id)}>
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">VIN / ХТА</p>
                          <p className="font-mono">{vehicle.vin}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">СТС</p>
                          <p className="font-mono">{vehicle.registration}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Предыдущий владелец</p>
                          <p>{vehicle.previousOwner}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Цена покупки</p>
                          <p className="font-semibold">{vehicle.price.toLocaleString()} ₽</p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-sm">Расходы на автомобиль</h4>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Icon name="Plus" size={14} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Добавить расход</DialogTitle>
                                <DialogDescription>
                                  Расход для {vehicle.name}
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={(e) => addVehicleExpense(vehicle.id, e)} className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`desc-${vehicle.id}`}>Описание</Label>
                                  <Input id={`desc-${vehicle.id}`} name="description" required />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`amt-${vehicle.id}`}>Сумма (₽)</Label>
                                  <Input id={`amt-${vehicle.id}`} name="amount" type="number" required />
                                </div>
                                <Button type="submit" className="w-full">Добавить</Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>

                        {vehicle.expenses.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">Нет расходов</p>
                        ) : (
                          <div className="space-y-2">
                            {vehicle.expenses.map((exp) => (
                              <div
                                key={exp.id}
                                className="flex items-center justify-between text-sm p-2 bg-muted rounded"
                              >
                                <span>{exp.description}</span>
                                <span className="font-semibold">{exp.amount.toLocaleString()} ₽</span>
                              </div>
                            ))}
                            <div className="flex items-center justify-between text-sm font-bold pt-2 border-t">
                              <span>Итого расходов:</span>
                              <span>
                                {vehicle.expenses
                                  .reduce((sum, exp) => sum + exp.amount, 0)
                                  .toLocaleString()}{' '}
                                ₽
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Календарь записей</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Выберите дату</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Записи на {selectedDate?.toLocaleDateString('ru-RU')}</CardTitle>
                    <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Icon name="Plus" size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Новая запись</DialogTitle>
                          <DialogDescription>
                            Запись на {selectedDate?.toLocaleDateString('ru-RU')}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={addAppointment} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="apt-clientName">Имя клиента</Label>
                            <Input id="apt-clientName" name="clientName" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="apt-car">Автомобиль</Label>
                            <Input id="apt-car" name="car" placeholder="Toyota Camry" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="plateNumber">Госномер</Label>
                            <Input id="plateNumber" name="plateNumber" placeholder="А123БВ777" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="apt-phone">Телефон</Label>
                            <Input id="apt-phone" name="phone" type="tel" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="time">Время</Label>
                            <Input id="time" name="time" type="time" required />
                          </div>
                          <Button type="submit" className="w-full">Записать</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {appointments.filter(
                    (apt) => apt.date.toDateString() === selectedDate?.toDateString()
                  ).length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Нет записей на эту дату</p>
                  ) : (
                    appointments
                      .filter((apt) => apt.date.toDateString() === selectedDate?.toDateString())
                      .map((apt) => (
                        <div key={apt.id} className="p-4 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{apt.clientName}</p>
                              <Badge>{apt.time}</Badge>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <Icon name="Trash2" size={14} className="text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Удалить запись?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Это действие нельзя отменить.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteAppointment(apt.id)}>
                                    Удалить
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>🚗 {apt.car}</p>
                            <p>🔢 {apt.plateNumber}</p>
                            <p>📞 {apt.phone}</p>
                          </div>
                        </div>
                      ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
