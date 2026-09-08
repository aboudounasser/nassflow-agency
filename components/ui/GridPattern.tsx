type GridPatternProps = {
  className?: string;
};

export function GridPattern({ className = '' }: GridPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(124,199,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(124,199,255,0.08)_1px,transparent_1px)] [background-size:32px_32px]',
        className,
      ].join(' ')}
    />
  );
}
