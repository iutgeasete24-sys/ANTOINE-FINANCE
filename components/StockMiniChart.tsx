export function StockMiniChart() {
  const bars = [28, 45, 38, 60, 54, 72, 66, 78, 91, 84, 96, 88];

  return (
    <div className="premium-card mt-5 rounded-3xl p-4 text-ink">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-mint">
            Vue rapide
          </p>
          <h2 className="mt-1 text-xl font-black">Qualité + prix + risque</h2>
        </div>
        <div className="rounded-full border border-mint/20 bg-mint/10 px-3 py-1 text-xs font-black text-mint">
          Aperçu
        </div>
      </div>
      <div className="mt-6 flex h-28 items-end gap-2">
        {bars.map((height, index) => (
          <div
            key={index}
            className="flex-1 rounded-t bg-white/80"
            style={{
              height: `${height}%`,
              opacity: 0.35 + index / 20
            }}
          />
        ))}
      </div>
    </div>
  );
}
