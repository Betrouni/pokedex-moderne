export default function CardSkeleton() {
  return (
    <div className="glass animate-pulse-glow rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div className="h-3 w-10 rounded bg-white/10" />
        <div className="h-4 w-14 rounded-full bg-white/10" />
      </div>
      <div className="mx-auto my-4 h-32 w-32 rounded-full bg-white/10" />
      <div className="mx-auto h-4 w-20 rounded bg-white/10" />
    </div>
  );
}
