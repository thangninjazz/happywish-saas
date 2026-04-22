'use client';

import { TrendingUp, ArrowUpRight } from 'lucide-react';

export function ExportReportButton() {
  return (
    <button 
      onClick={() => alert('Chức năng xuất báo cáo sẽ được cập nhật sớm!')}
      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/25"
    >
      <TrendingUp className="w-4 h-4" />
      Xuất báo cáo
    </button>
  );
}

export function DetailLink({ label, id }: { label: string, id: string | number }) {
  return (
    <div 
      onClick={() => alert(`Xem chi tiết cho ${label} #${id}`)}
      className="text-xs font-medium text-primary cursor-pointer hover:underline"
    >
      Chi tiết
    </div>
  );
}
