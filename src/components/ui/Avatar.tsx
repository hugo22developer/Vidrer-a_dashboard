const PALETTE = ["#8fe3f2", "#f2a65a", "#7bd88f", "#c792ea", "#f2726a", "#5b6470"];

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
  const color = PALETTE[hashString(name) % PALETTE.length];

  return (
    <div
      style={{ width: size, height: size, backgroundColor: `${color}26`, color, borderColor: `${color}40` }}
      className="flex shrink-0 items-center justify-center rounded-full border font-display text-xs font-semibold"
    >
      {initials || "?"}
    </div>
  );
}
