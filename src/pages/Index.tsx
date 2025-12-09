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
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  phone: string;
  car: string;
  lastVisit: string;
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
  service: string;
  time: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Иван Петров', phone: '+7 (999) 123-45-67', car: 'Toyota Camry', lastVisit: '2024-12-05' },
    { id: '2', name: 'Мария Сидорова', phone: '+7 (999) 765-43-21', car: 'Honda Accord', lastVisit: '2024-12-08' },
    { id: '3', name: 'Алексей Смирнов', phone: '+7 (999) 555-12-34', car: 'BMW X5', lastVisit: '2024-12-01' },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', date: '2024-12-05', category: 'Запчасти', amount: 25000, description: 'Тормозные колодки' },
    { id: '2', date: '2024-12-06', category: 'Аренда', amount: 50000, description: 'Аренда помещения' },
    { id: '3', date: '2024-12-07', category: 'Инструменты', amount: 15000, description: 'Компрессор' },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', date: new Date(2024, 11, 10), clientName: 'Иван Петров', service: 'ТО', time: '10:00' },
    { id: '2', date: new Date(2024, 11, 10), clientName: 'Мария Сидорова', service: 'Диагностика', time: '14:00' },
  ]);

  const totalIncome = 450000;
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const profit = totalIncome - totalExpenses;

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

  const addExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newExpense: Expense = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      category: formData.get('category') as string,
      amount: Number(formData.get('amount')),
      description: formData.get('description') as string,
    };
    setExpenses([...expenses, newExpense]);
    toast.success('Расход добавлен');
    e.currentTarget.reset();
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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
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
            <TabsTrigger value="expenses" className="gap-2">
              <Icon name="Wallet" size={18} />
              <span className="hidden sm:inline">Расходы</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Icon name="Calendar" size={18} />
              <span className="hidden sm:inline">Календарь</span>
            </TabsTrigger>
          </TabsList>

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
                    <Icon name="Bell" size={20} />
                    Предстоящие записи
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {appointments.slice(0, 3).map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{apt.clientName}</p>
                        <p className="text-sm text-muted-foreground">{apt.service}</p>
                      </div>
                      <Badge variant="outline">{apt.time}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Users" size={20} />
                    Последние клиенты
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {clients.slice(0, 3).map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.car}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{client.lastVisit}</span>
                    </div>
                  ))}
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
                      <div className="h-full bg-green-500" style={{ width: '80%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Расходы</span>
                      <span className="text-sm font-bold">{totalExpenses.toLocaleString()} ₽</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: '40%' }} />
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="font-semibold mb-4">Расходы по категориям</h3>
                    <div className="space-y-4">
                      {expenses.reduce((acc: { [key: string]: number }, exp) => {
                        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                        return acc;
                      }, {} as { [key: string]: number })
                        ? Object.entries(
                            expenses.reduce((acc: { [key: string]: number }, exp) => {
                              acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                              return acc;
                            }, {})
                          ).map(([category, amount]) => (
                            <div key={category} className="flex items-center justify-between">
                              <span className="text-sm">{category}</span>
                              <span className="font-semibold">{amount.toLocaleString()} ₽</span>
                            </div>
                          ))
                        : null}
                    </div>
                  </div>
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clients.map((client) => (
                <Card key={client.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
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
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Учёт расходов</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="Plus" size={18} />
                    Добавить расход
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новый расход</DialogTitle>
                    <DialogDescription>Заполните информацию о расходе</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={addExpense} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Категория</Label>
                      <Select name="category" required>
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
                      <Input id="amount" name="amount" type="number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Описание</Label>
                      <Textarea id="description" name="description" required />
                    </div>
                    <Button type="submit" className="w-full">Добавить</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 font-medium">Дата</th>
                        <th className="text-left p-4 font-medium">Категория</th>
                        <th className="text-left p-4 font-medium">Описание</th>
                        <th className="text-right p-4 font-medium">Сумма</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((expense, idx) => (
                        <tr key={expense.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                          <td className="p-4">{expense.date}</td>
                          <td className="p-4">
                            <Badge variant="outline">{expense.category}</Badge>
                          </td>
                          <td className="p-4">{expense.description}</td>
                          <td className="p-4 text-right font-semibold">{expense.amount.toLocaleString()} ₽</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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
                  <CardTitle>
                    Записи на {selectedDate?.toLocaleDateString('ru-RU')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {appointments
                    .filter(
                      (apt) =>
                        apt.date.toDateString() === selectedDate?.toDateString()
                    )
                    .map((apt) => (
                      <div key={apt.id} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">{apt.clientName}</p>
                          <Badge>{apt.time}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{apt.service}</p>
                      </div>
                    ))}
                  {appointments.filter(
                    (apt) =>
                      apt.date.toDateString() === selectedDate?.toDateString()
                  ).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Нет записей на эту дату
                    </p>
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
