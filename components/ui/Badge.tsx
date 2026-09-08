type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border border-[#2A333C] bg-[#10161D] px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[#CDD5DD]',
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
