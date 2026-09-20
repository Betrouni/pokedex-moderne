import { motion } from "framer-motion";
import { POKEMON_TYPES, typeStyle } from "../lib/types";

interface TypeFilterProps {
  selected: string | null;
  onSelect: (type: string | null) => void;
}

export default function TypeFilter({ selected, onSelect }: TypeFilterProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
        <Chip label="Tous" active={selected === null} onClick={() => onSelect(null)} />
        {POKEMON_TYPES.map((type) => (
          <Chip
            key={type}
            label={type}
            active={selected === type}
            color={typeStyle(type).solid}
            onClick={() => onSelect(selected === type ? null : type)}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition-colors sm:text-sm ${
        active
          ? "border-transparent text-white shadow-lg"
          : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
      }`}
      style={active ? { backgroundColor: color ?? "#a855f7", boxShadow: `0 0 24px ${color ?? "#a855f7"}55` } : undefined}
    >
      {label}
    </motion.button>
  );
}
