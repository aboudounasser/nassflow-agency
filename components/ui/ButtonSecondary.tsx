type ButtonSecondaryProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

export function ButtonSecondary({
  children,
  href,
  className = '',
  type = 'button',
}: ButtonSecondaryProps) {
  const classes = [
    'inline-flex items-center justify-center rounded-full border border-[#2A333C] bg-transparent px-5 py-3 text-sm font-medium text-[#F4F7FA] transition-colors duration-200 ease-out hover:border-[#7CC7FF] hover:text-[#A9D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D12]',
    className,
  ].join(' ');

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
