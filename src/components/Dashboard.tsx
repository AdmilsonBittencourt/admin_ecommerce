import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Dashboard() {
    // Mock data - replace with actual API calls
    const totalRevenue = 12500.75;
    const perfumesSold = 342;
    const recentOrders = [
        { id: "ORD001", customer: "Alice Wonderland", date: "2024-07-29", total: 75.50, status: "Processing" },
        { id: "ORD002", customer: "Bob The Builder", date: "2024-07-28", total: 120.00, status: "Shipped" },
        { id: "ORD003", customer: "Charlie Brown", date: "2024-07-28", total: 45.99, status: "Delivered" },
        { id: "ORD004", customer: "Diana Prince", date: "2024-07-27", total: 210.25, status: "Shipped" },
        { id: "ORD005", customer: "Edward Scissorhands", date: "2024-07-26", total: 99.00, status: "Processing" },
    ];

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8">
            <header className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Dashboard de Perfumes</h1>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Faturamento Total
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Perfumes Vendidos
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M21 10c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM3.5 21h17M5.5 21V11c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v10m-8-4h4m-4-4h4m6.5-2c0-3.87-3.13-7-7-7s-7 3.13-7 7" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{perfumesSold}</div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
                {/* Add more cards for other metrics like Active Users, Sales, etc. if needed */}
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Pedidos Recentes</CardTitle>
                        <CardDescription>
                            Você tem {recentOrders.length} pedidos recentes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pedido ID</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>{order.customer}</TableCell>
                                        <TableCell>{order.date}</TableCell>
                                        <TableCell>R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}