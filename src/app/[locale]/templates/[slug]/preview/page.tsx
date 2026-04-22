import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { PublicGreeting } from '@/components/greeting/PublicGreeting';
import { Link } from '@/i18n/routing';
import { buttonVariants } from '@/components/ui/button';

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch template data
  const { data: template, error } = await supabase
    .from('templates')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !template) {
    notFound();
  }

  // Create a dummy wish object for preview
  const dummyWish = {
    id: 'preview-id',
    recipient_name: 'Người Nhận',
    sender_name: 'Người Gửi',
    message: 'Chúc mừng sinh nhật! Đây là bản xem trước của mẫu thiệp bạn đã chọn. Bạn có thể thay đổi tin nhắn, âm nhạc và hình ảnh theo ý muốn.',
    event_date: new Date().toISOString(),
    music_url: '',
    theme_color: '#EC4899',
    template: template,
    wish_media: [
      { url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop', type: 'image' },
      { url: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&auto=format&fit=crop', type: 'image' }
    ]
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex gap-4">
        <div className="bg-background/80 backdrop-blur-md px-6 py-3 rounded-full border shadow-xl flex items-center gap-6">
          <span className="text-sm font-semibold hidden md:inline">Đang xem mẫu: {template.title}</span>
          <Link 
            href={`/create/${template.slug}`} 
            className={buttonVariants({ variant: "default", className: "rounded-full px-8 shadow-lg shadow-primary/25" })}
          >
            Dùng mẫu này ngay
          </Link>
          <Link href="/templates" className="text-sm text-muted-foreground hover:text-foreground">
            Quay lại
          </Link>
        </div>
      </div>
      <PublicGreeting wish={dummyWish as any} isPreview={true} />
    </div>
  );
}
