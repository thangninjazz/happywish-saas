import { createClient } from '@/lib/supabase/server';
import { TemplatesTable } from '@/components/admin/TemplatesTable';

export default async function TemplatesAdminPage() {
  const supabase = await createClient();

  const { data: templates, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/10 text-destructive rounded-3xl border border-destructive/20">
        <h2 className="text-xl font-bold mb-2">Lỗi tải danh sách mẫu</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <TemplatesTable initialTemplates={templates || []} />
    </div>
  );
}
