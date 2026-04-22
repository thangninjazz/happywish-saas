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
import { Gift, ExternalLink, Trash2 } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default async function WishesAdminPage() {
  const supabase = await createClient();

  const { data: wishes, error } = await supabase
    .from('wishes')
    .select('*, users(full_name, email), templates(title)')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="text-destructive">Lỗi tải danh sách lời chúc: {error.message}</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý lời chúc</h1>
        <p className="text-muted-foreground mt-1">Danh sách tất cả các thiệp chúc mừng đã được tạo.</p>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-card">
          <CardTitle className="text-lg">Tất cả lời chúc ({wishes?.length || 0})</CardTitle>
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
                {wishes && wishes.length > 0 ? (
                  wishes.map((wish: any) => (
                    <TableRow key={wish.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{wish.users?.full_name || 'Anonymous'}</span>
                          <span className="text-xs text-muted-foreground">{wish.users?.email || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-purple-600">
                        {wish.templates?.title || 'Unknown Template'}
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
                          <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Chưa có lời chúc nào được tạo.
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
