type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[#CDD5DD]',
        className,
      ].join(' ')}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#7CC7FF]" />
      {children}
    </span>
  );
}
