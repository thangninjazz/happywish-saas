'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteWish(wishId: string) {
  try {
    const supabase = await createClient();
    
    // Check if admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };
    
    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (userData?.role !== 'admin') return { success: false, error: 'Access denied' };

    // Delete wish
    const { error } = await supabase.from('wishes').delete().eq('id', wishId);
    
    if (error) {
      console.error('Delete wish error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/wishes');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const supabase = await createClient();
    
    // Check if admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };
    
    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (userData?.role !== 'admin') return { success: false, error: 'Access denied' };

    // Update order
    const { error } = await supabase.from('orders').update({ payment_status: status }).eq('id', orderId);
    
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/orders');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleTemplateStatus(templateId: string, isActive: boolean) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from('templates').update({ is_active: isActive }).eq('id', templateId);
    
    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/templates');
    revalidatePath('/templates');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteTemplate(templateId: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('templates').delete().eq('id', templateId);
    
    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/templates');
    revalidatePath('/templates');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('users').update({ role }).eq('id', userId);
    
    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/users');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
