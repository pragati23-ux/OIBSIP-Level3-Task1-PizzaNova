export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[28px] border border-white/10 bg-white/5 p-4">
      <div className="mb-4 h-40 rounded-2xl bg-white/10" />
      <div className="mb-3 h-4 w-24 rounded-full bg-white/10" />
      <div className="mb-2 h-3 rounded-full bg-white/10" />
      <div className="h-3 w-2/3 rounded-full bg-white/10" />
    </div>
  );
}
