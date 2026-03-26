import { Loader2 } from 'lucide-react';

export default function Loading({ fullScreen = false, message = 'Đang tải...' }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1B83A1] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-[#1B83A1] animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}
