import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { PublicGreeting } from '@/components/greeting/PublicGreeting';

export default async function WishPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const decodedSlug = decodeURIComponent(slug);

  // Fetch wish data with related template and media
  const { data: wish, error } = await supabase
    .from('wishes')
    .select('*, templates(*), wish_media(*)')
    .eq('slug', decodedSlug)
    .single();

  if (error || !wish) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-red-50 text-red-900">
        <div className="max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-red-200">
          <h1 className="text-2xl font-bold mb-4">Lỗi tải dữ liệu thiệp</h1>
          <p className="mb-4">Hệ thống không thể tải thiệp của bạn. Dưới đây là thông báo lỗi từ Database để kỹ thuật viên kiểm tra:</p>
          <pre className="bg-red-100 p-4 rounded text-sm overflow-auto mb-4">
            {JSON.stringify(error || { message: "Không tìm thấy thiệp (wish is null)" }, null, 2)}
          </pre>
          <p className="text-sm opacity-70">Slug truy cập: {slug}</p>
        </div>
      </div>
    );
  }

  // Check if wish is active (unless preview/admin?)
  if (wish.status !== 'active') {
    // For now allow viewing drafts for the creator, but strictly we should check
  }

  return (
    <div className="min-h-screen">
      <PublicGreeting wish={wish} />
    </div>
  );
}
