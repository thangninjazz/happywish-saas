'use client';

import { useState, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/routing';
import { UploadGallery } from '@/components/builder/UploadGallery';

interface GreetingBuilderProps {
  template: any;
  user: any;
}

const GreetingBuilder = memo(function GreetingBuilder({ template, user }: GreetingBuilderProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState({
    recipient_name: '',
    sender_name: '',
    message: '',
    event_date: '',
    theme_color: '#EC4899', // Default Pink
    music_url: '',
  });

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleNext = useCallback(() => setStep((s) => Math.min(s + 1, 4)), []);
  const handlePrev = useCallback(() => setStep((s) => Math.max(s - 1, 1)), []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    
    // 1. Generate unique slug
    const baseSlug = `${formData.recipient_name.toLowerCase().replace(/\s+/g, '-')}-${template.slug}`;
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    // 2. Insert into wishes table
    const { data: wishData, error: wishError } = await supabase
      .from('wishes')
      .insert({
        user_id: user?.id,
        template_id: template.id,
        slug: uniqueSlug,
        recipient_name: formData.recipient_name,
        sender_name: formData.sender_name,
        message: formData.message,
        event_date: formData.event_date || null,
        theme_color: formData.theme_color,
        music_url: formData.music_url,
        status: 'active' // Set directly to active since payment is mocked
      })
      .select()
      .single();

    if (wishError || !wishData) {
      console.error('Error saving wish:', wishError);
      alert(`Lỗi khi lưu thiệp: ${wishError?.message} (${wishError?.code})`);
      setLoading(false);
      return;
    }

    // 3. Upload images to Supabase Storage and insert to wish_media
    if (mediaFiles.length > 0) {
      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${wishData.id}/${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('wish-media')
          .upload(fileName, file);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('wish-media')
            .getPublicUrl(fileName);

          await supabase.from('wish_media').insert({
            wish_id: wishData.id,
            url: publicUrlData.publicUrl,
            type: 'image',
            sort_order: i
          });
        }
      }
    }

    setLoading(false);
    // 3. Navigate to checkout (Mockup)
    alert('Mock Payment Successful! Your greeting is ready.');
    router.push(`/dashboard`); 
  }, [formData, template, user, supabase, mediaFiles, router]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customize Greeting</h1>
          <p className="text-muted-foreground">Template: {template.title}</p>
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          Step {step} of 4
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            {/* STEP 1: Details */}
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Who is this greeting for?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient_name">Recipient Name</Label>
                    <Input 
                      id="recipient_name" 
                      name="recipient_name" 
                      placeholder="e.g. Linh" 
                      value={formData.recipient_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender_name">Sender Name (Your Name)</Label>
                    <Input 
                      id="sender_name" 
                      name="sender_name" 
                      placeholder="e.g. Minh" 
                      value={formData.sender_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      rows={5}
                      placeholder="Write your heartfelt message here..." 
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event_date">Event Date (Optional)</Label>
                    <Input 
                      id="event_date" 
                      name="event_date" 
                      type="date" 
                      value={formData.event_date}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
              </>
            )}

            {/* STEP 2: Media */}
            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Media & Music</CardTitle>
                  <CardDescription>Add photos and background music</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <UploadGallery 
                    maxFiles={10} 
                    onFilesChange={setMediaFiles} 
                  />

                  <div className="space-y-2">
                    <Label htmlFor="music_url">Background Music URL (YouTube/Spotify link)</Label>
                    <Input 
                      id="music_url" 
                      name="music_url" 
                      placeholder="https://www.youtube.com/watch?v=..." 
                      value={formData.music_url}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
              </>
            )}

            {/* STEP 3: Theme */}
            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Theme Colors</CardTitle>
                  <CardDescription>Choose a color palette for your greeting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {[
                      { name: 'Pink', hex: '#EC4899' },
                      { name: 'Purple', hex: '#7C3AED' },
                      { name: 'Gold', hex: '#F59E0B' },
                      { name: 'Blue', hex: '#3B82F6' },
                    ].map((color) => (
                      <button
                        key={color.hex}
                        className={`w-16 h-16 rounded-full border-4 transition-all ${
                          formData.theme_color === color.hex ? 'border-primary scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setFormData({ ...formData, theme_color: color.hex })}
                        aria-label={`Select ${color.name} theme color`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </CardContent>
              </>
            )}

            {/* STEP 4: Review */}
            {step === 4 && (
              <>
                <CardHeader>
                  <CardTitle>Review & Payment</CardTitle>
                  <CardDescription>Finalize your greeting and checkout</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p><strong>To:</strong> {formData.recipient_name || 'N/A'}</p>
                    <p><strong>From:</strong> {formData.sender_name || 'N/A'}</p>
                    <p><strong>Date:</strong> {formData.event_date || 'N/A'}</p>
                    <div className="mt-2 text-sm italic">"{formData.message || 'No message provided'}"</div>
                  </div>
                  
                  <div className="p-6 border rounded-lg flex justify-between items-center bg-card">
                    <div>
                      <h3 className="font-semibold text-lg">{template.title}</h3>
                      <p className="text-muted-foreground">One-time payment</p>
                    </div>
                    <div className="text-2xl font-bold">
                      {template.price === 0 ? 'Free' : `${template.price.toLocaleString()} VNĐ`}
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            <CardFooter className="flex justify-between border-t p-6">
              <Button variant="outline" onClick={handlePrev} disabled={step === 1}>
                Back
              </Button>
              
              {step < 4 ? (
                <Button onClick={handleNext}>Next Step</Button>
              ) : (
                <Button 
                  onClick={user ? handleSubmit : () => router.push('/login')} 
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (user ? 'Complete & Pay' : 'Login to Continue')}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Live Preview Sidebar */}
        <div className="hidden md:block">
          <div className="sticky top-8 border rounded-xl overflow-hidden bg-card shadow-sm h-[600px] flex flex-col">
            <div className="bg-muted p-3 text-center text-sm font-medium border-b">
              Live Preview
            </div>
            <div className="flex-1 flex items-center justify-center p-4 relative" style={{ backgroundColor: formData.theme_color + '20' }}>
               <div className="text-center space-y-4">
                  <div className="text-sm font-medium uppercase tracking-widest text-primary">A message for</div>
                  <h2 className="text-4xl font-serif text-foreground">{formData.recipient_name || 'Recipient'}</h2>
                  <p className="text-muted-foreground line-clamp-3">
                    {formData.message || 'Your beautiful message will appear here...'}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export { GreetingBuilder };
