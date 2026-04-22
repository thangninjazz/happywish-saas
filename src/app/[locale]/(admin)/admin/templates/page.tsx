import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, MoreHorizontal, Image as ImageIcon } from 'lucide-react';

export default async function TemplatesAdminPage() {
  const supabase = await createClient();

  const { data: templates, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="text-destructive">Lỗi tải danh sách mẫu: {error.message}</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý mẫu thiết kế</h1>
          <p className="text-muted-foreground mt-1">Quản lý các mẫu website có sẵn cho người dùng.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Thêm mẫu mới
        </button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-card">
          <CardTitle className="text-lg">Tất cả mẫu thiết kế ({templates?.length || 0})</CardTitle>
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
                {templates && templates.length > 0 ? (
                  templates.map((template) => (
                    <TableRow key={template.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        {template.thumbnail_url ? (
                          <img 
                            src={template.thumbnail_url} 
                            alt={template.title} 
                            className="w-16 h-10 object-cover rounded-md border border-border"
                          />
                        ) : (
                          <div className="w-16 h-10 bg-muted rounded-md flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">{template.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{template.slug}</TableCell>
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
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Chưa có mẫu thiết kế nào.
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
