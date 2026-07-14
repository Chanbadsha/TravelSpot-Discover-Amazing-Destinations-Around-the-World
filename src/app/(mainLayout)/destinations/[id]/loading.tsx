import GlobalLoader from "@/src/Components/UI/GlobalLoader";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <GlobalLoader variant="spinner" size="lg" text="Loading destination..." />
    </div>
  );
}
