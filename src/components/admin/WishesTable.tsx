'use client';

import { useState, useMemo } from 'react';
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
import { Gift, ExternalLink, Trash2, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/routing';

interface Wish {
  id: string;
  slug: string;
  status: string;
  created_at: string;
  users?: {
    email: string;
    full_name: string | null;
  };
  templates?: {
    title: string;
  };
}

export function WishesTable({ initialWishes }: { initialWishes: Wish[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredWishes = useMemo(() => {
    return initialWishes.filter(wish => {
      const customerName = wish.users?.full_name || '';
      const customerEmail = wish.users?.email || '';
      const templateTitle = wish.templates?.title || '';
      
      const matchesSearch = 
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        templateTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wish.slug.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || wish.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [initialWishes, searchTerm, statusFilter]);

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa lời chúc này?')) {
      alert(`Đã xóa lời chúc ${id} (giả định)`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý lời chúc</h1>
          <p className="text-muted-foreground mt-1">Danh sách tất cả các thiệp chúc mừng đã được tạo.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-card pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">Tất cả lời chúc ({filteredWishes.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Tìm người tạo, mẫu, slug..." 
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
                  <option value="active">Hoạt động</option>
                  <option value="draft">Bản nháp</option>
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
                  <TableHead>Người tạo</TableHead>
                  <TableHead>Mẫu sử dụng</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWishes.length > 0 ? (
                  filteredWishes.map((wish) => (
                    <TableRow key={wish.id} className="hover:bg-muted/30 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{wish.users?.full_name || 'Khách'}</span>
                          <span className="text-xs text-muted-foreground">{wish.users?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-purple-600">
                        {wish.templates?.title || 'Mẫu thiết kế'}
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-1.5 py-0.5 rounded text-xs">/{wish.slug}</code>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={wish.status === 'active' ? 'default' : 'outline'}
                          className={wish.status === 'active' ? 'bg-green-600' : 'text-amber-600 border-amber-200 bg-amber-50'}
                        >
                          {wish.status === 'active' ? 'Hoạt động' : 'Bản nháp'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(wish.created_at).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link 
                            href={`/wishes/${wish.slug}`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-primary"
                            target="_blank"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(wish.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      Không tìm thấy lời chúc nào.
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
