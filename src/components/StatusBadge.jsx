const configs = {
  Available:   { label: 'Sẵn sàng',    cls: 'bg-green-100 text-green-700 border border-green-200' },
  Rented:      { label: 'Đã thuê',     cls: 'bg-yellow-100 text-yellow-700 border border-yellow-200' },
  Ongoing:     { label: 'Đang thuê',   cls: 'bg-green-100 text-green-700 border border-green-200' },
  Maintenance: { label: 'Bảo trì',     cls: 'bg-orange-100 text-orange-700 border border-orange-200' },
  Confirmed:   { label: 'Đã xác nhận', cls: 'bg-blue-100 text-blue-700 border border-blue-200' },
  Pending:     { label: 'Chờ duyệt',   cls: 'bg-yellow-100 text-yellow-700 border border-yellow-200' },
  Completed:   { label: 'Hoàn thành',  cls: 'bg-gray-100 text-gray-600 border border-gray-200' },
  Cancelled:   { label: 'Đã hủy',      cls: 'bg-red-100 text-red-600 border border-red-200' },
};

export default function StatusBadge({ status }) {
  const cfg = configs[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}
