type SystemNodeProps = {
  label: string;
  className?: string;
};

export function SystemNode({ label, className = '' }: SystemNodeProps) {
  return (
    <div
      className={[
        'flex items-center gap-2 rounded-full border border-[#2A333C] bg-[#10161D] px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[#CDD5DD]',
        className,
      ].join(' ')}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#7CC7FF]" />
      {label}
    </div>
  );
}
