type ButtonPrimaryProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
};

export function ButtonPrimary({
  children,
  href,
  className = '',
  type = 'button',
  onClick,
}: ButtonPrimaryProps) {
  const classes = [
    'inline-flex items-center justify-center rounded-full border border-transparent bg-[#7CC7FF] px-5 py-3 text-sm font-medium text-[#0A0D12] transition-colors duration-200 ease-out hover:bg-[#A9D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D12]',
    className,
  ].join(' ');

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}