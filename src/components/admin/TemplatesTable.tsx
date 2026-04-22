'use client';

import { useState, useMemo, useTransition } from 'react';
import { toggleTemplateStatus, deleteTemplate } from '@/app/actions/admin';
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
import { Plus, Trash2, Power, PowerOff, Image as ImageIcon, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Template {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  is_active: boolean;
  thumbnail_url: string | null;
}

export function TemplatesTable({ initialTemplates }: { initialTemplates: Template[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const result = await toggleTemplateStatus(id, !currentStatus);
      if (!result.success) alert('Lỗi: ' + result.error);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa mẫu thiết kế này? Hành động này sẽ xóa dữ liệu liên quan.')) {
      startTransition(async () => {
        const result = await deleteTemplate(id);
        if (!result.success) {
          alert('Lỗi khi xóa: ' + result.error);
        } else {
          alert('Đã xóa thành công!');
        }
      });
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(initialTemplates.map(t => t.category));
    return ['all', ...Array.from(cats)];
  }, [initialTemplates]);

  const filteredTemplates = useMemo(() => {
    return initialTemplates.filter(template => {
      const matchesSearch = 
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.slug.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [initialTemplates, searchTerm, categoryFilter]);

  const handleAddTemplate = () => {
    alert('Chức năng thêm mẫu mới sẽ được cập nhật sớm!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý mẫu thiết kế</h1>
          <p className="text-muted-foreground mt-1">Quản lý các mẫu website có sẵn cho người dùng.</p>
        </div>
        <button 
          onClick={handleAddTemplate}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/25"
        >
          <Plus className="w-4 h-4" />
          Thêm mẫu mới
        </button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-card pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">Tất cả mẫu ({filteredTemplates.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Tìm tên mẫu, slug..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select 
                  className="h-10 rounded-xl bg-muted/50 border-none text-sm px-3 focus:ring-2 focus:ring-primary outline-none capitalize"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'Tất cả danh mục' : cat}
                    </option>
                  ))}
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
                  <TableHead className="w-[100px]">Thumbnail</TableHead>
                  <TableHead>Tên mẫu</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá (VNĐ)</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <TableRow key={template.id} className="hover:bg-muted/30 transition-colors group">
                      <TableCell>
                        {template.thumbnail_url ? (
                          <img 
                            src={template.thumbnail_url} 
                            alt={template.title} 
                            className="w-16 h-10 object-cover rounded-md border border-border shadow-sm group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-16 h-10 bg-muted rounded-md flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold group-hover:text-primary transition-colors">{template.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">{template.slug}</TableCell>
                      <TableCell className="capitalize">{template.category}</TableCell>
                      <TableCell className="font-medium">
                        {template.price === 0 ? (
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Miễn phí</Badge>
                        ) : (
                          `${template.price?.toLocaleString()}đ`
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={template.is_active ? 'default' : 'secondary'}>
                          {template.is_active ? 'Hoạt động' : 'Ẩn'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            disabled={isPending}
                            onClick={() => handleToggleStatus(template.id, template.is_active)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-primary disabled:opacity-50"
                            title={template.is_active ? "Tắt" : "Bật"}
                          >
                            {template.is_active ? <PowerOff className="w-4 h-4 text-amber-500" /> : <Power className="w-4 h-4 text-green-500" />}
                          </button>
                          <button 
                            disabled={isPending}
                            onClick={() => handleDelete(template.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive disabled:opacity-50"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      Không tìm thấy mẫu thiết kế nào.
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
