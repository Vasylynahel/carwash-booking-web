export default function Loading() {
  return (
    <div role="status" className="flex justify-center p-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600" />
      <span className="sr-only">Завантаження...</span>
    </div>
  );
}
