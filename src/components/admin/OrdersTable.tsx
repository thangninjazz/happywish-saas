'use client';

import { useState, useMemo, useTransition } from 'react';
import { updateOrderStatus } from '@/app/actions/admin';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Search, Filter, MoreHorizontal, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Order {
  id: string;
  user_id: string;
  wish_id: string;
  amount: number;
  payment_status: string;
  transaction_ref: string | null;
  created_at: string;
  users?: {
    email: string;
    full_name: string | null;
  };
}

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (orderId: string, newStatus: string) => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (!result.success) {
        alert('Lỗi cập nhật trạng thái: ' + result.error);
      } else {
        alert('Đã cập nhật trạng thái thành công!');
      }
    });
  };

  const filteredOrders = useMemo(() => {
    return initialOrders.filter(order => {
      const customerName = order.users?.full_name || '';
      const customerEmail = order.users?.email || '';
      const matchesSearch = 
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.payment_status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [initialOrders, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Thành công</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 flex items-center gap-1"><Clock className="w-3 h-3" /> Đang chờ</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 flex items-center gap-1"><XCircle className="w-3 h-3" /> Thất bại</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h1>
          <p className="text-muted-foreground mt-1">Theo dõi doanh thu và trạng thái thanh toán.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-card pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">Tất cả đơn hàng ({filteredOrders.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Tìm mã đơn, email khách..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select 
                  className="h-10 rounded-xl bg-muted/50 border-none text-sm px-3 focus:ring-2 focus:ring-primary outline-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="completed">Thành công</option>
                  <option value="pending">Đang chờ</option>
                  <option value="failed">Thất bại</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/30 transition-colors group">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{order.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{order.users?.full_name || 'Khách vãng lai'}</span>
                          <span className="text-xs text-muted-foreground">{order.users?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-primary">
                        {order.amount.toLocaleString()}đ
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(order.created_at).toLocaleDateString('vi-VN', { 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.payment_status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <select
                          disabled={isPending}
                          value={order.payment_status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-sm p-2 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer outline-none"
                        >
                          <option value="pending">Đang chờ</option>
                          <option value="completed">Thành công</option>
                          <option value="failed">Thất bại</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      Không tìm thấy đơn hàng nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
