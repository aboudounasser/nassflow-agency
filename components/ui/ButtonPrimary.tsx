import Link from 'next/link';

type ButtonPrimaryProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
};

const base =
  'sheen group inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-[#7CC7FF] px-5 py-3 text-sm font-medium text-[#0A0D12] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#A9D9FF] hover:shadow-[0_12px_34px_rgba(124,199,255,0.26)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D12]';

export function ButtonPrimary({
  children,
  href,
  className = '',
  type = 'button',
  onClick,
}: ButtonPrimaryProps) {
  const classes = [base, className].join(' ');

  const content = (
    <>
      {children}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-0.5"
      >
        →
      </span>
    </>
  );

  // Les liens internes passent par next/link : navigation client et
  // préchargement, au lieu d'un rechargement complet de la page.
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
