export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
      {Icon && <Icon className="mx-auto mb-4 text-gray-400" size={48} />}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-6">{description}</p>}
      {action}
    </div>
  );
}
