export default function Loading() {
  return (
    <div className="min-h-screen bg-cm-ice flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner ring */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-cm-slate-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cm-navy animate-spin" />
        </div>
        <p className="text-sm text-cm-slate-500 font-heading font-medium animate-pulse">
          Loading…
        </p>
      </div>
    </div>
  );
}
