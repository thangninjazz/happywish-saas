import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";

export interface TemplateType {
  id: string;
  slug: string;
  title: string;
  category: string;
  thumbnail_url: string | null;
  price: number;
}

export function TemplateCard({ template }: { template: TemplateType }) {
  // Use a placeholder if no thumbnail is available
  const thumbnailUrl = template.thumbnail_url || 'https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=600&auto=format&fit=crop';

  return (
    <Card className="overflow-hidden flex flex-col group transition-all hover:shadow-xl hover:border-primary/50">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={thumbnailUrl}
          alt={template.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {template.category}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <h3 className="font-semibold text-lg line-clamp-1">{template.title}</h3>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-1">
        <p className="text-muted-foreground text-sm font-medium">
          {template.price === 0 ? 'Free' : `${template.price.toLocaleString('vi-VN')} VNĐ`}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link href={`/templates/${template.slug}/preview`} className={buttonVariants({ variant: "outline", className: "flex-1 text-xs px-2" })}>
          Preview
        </Link>
        <Link href={`/create/${template.slug}`} className={buttonVariants({ variant: "default", className: "flex-1 text-xs px-2" })}>
          Dùng mẫu này
        </Link>
      </CardFooter>
    </Card>
  );
}
