import { createClient } from '@/lib/supabase/server';
import { TemplateCard, TemplateType } from '@/components/templates/TemplateCard';
import { getTranslations } from 'next-intl/server';

export default async function TemplatesPage() {
  const supabase = await createClient();
  const t = await getTranslations('HomePage');

  // Fetch active templates
  const { data: templates, error } = await supabase
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching templates:', error);
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Choose a Template
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start by selecting a beautiful template for your greeting website. You can customize the colors, text, and photos later.
        </p>
      </div>

      {templates && templates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template as TemplateType} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground">No templates available at the moment. Please check back later!</p>
        </div>
      )}
    </div>
  );
}
