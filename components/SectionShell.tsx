type SectionShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionShell({ children, className = '' }: SectionShellProps) {
  return (
    <section className={['mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8', className].join(' ')}>
      {children}
    </section>
  );
}
