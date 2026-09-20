import { motion } from "framer-motion";

export default function Pokeball({ size = 48 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="32" cy="32" r="29" fill="#f4f4f8" stroke="#16161f" strokeWidth="3" />
      <path d="M3 32a29 29 0 0 1 58 0z" fill="#ff3b3b" stroke="#16161f" strokeWidth="3" />
      <rect x="3" y="29" width="58" height="6" fill="#16161f" />
      <circle cx="32" cy="32" r="9" fill="#16161f" />
      <circle cx="32" cy="32" r="5" fill="#f4f4f8" />
    </motion.svg>
  );
}
