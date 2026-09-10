import Link from 'next/link';

type ButtonSecondaryProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
};

const base =
  'group inline-flex items-center justify-center gap-2 rounded-full border border-[#2A333C] bg-transparent px-5 py-3 text-sm font-medium text-[#F4F7FA] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#7CC7FF]/60 hover:bg-[#111A23] hover:text-[#A9D9FF] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D12]';

export function ButtonSecondary({
  children,
  href,
  className = '',
  type = 'button',
  onClick,
}: ButtonSecondaryProps) {
  const classes = [base, className].join(' ');

  const content = (
    <>
      {children}
      <span
        aria-hidden="true"
        className="inline-block text-[#7CC7FF] transition-transform duration-200 ease-out group-hover:translate-y-0.5"
      >
        ↓
      </span>
    </>
  );

  if (href?.startsWith('/')) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {content}
    </button>
  );
}
