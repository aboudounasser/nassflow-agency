type SurfacePanelProps = {
  children: React.ReactNode;
  className?: string;
};

export function SurfacePanel({ children, className = '' }: SurfacePanelProps) {
  return (
    <div
      className={[
        'rounded-[1.5rem] border border-[#2A333C] bg-[#141B22] text-[#F4F7FA]',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
