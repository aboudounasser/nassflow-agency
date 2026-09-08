export function IconDot({ className = '' }: { className?: string }) {
  return (
    <span
      className={[
        'inline-block h-2.5 w-2.5 rounded-full bg-[#7CC7FF] shadow-[0_0_18px_rgba(124,199,255,0.7)]',
        className,
      ].join(' ')}
    />
  );
}
