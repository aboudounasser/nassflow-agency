type ConnectionLineProps = {
  className?: string;
};

export function ConnectionLine({ className = '' }: ConnectionLineProps) {
  return (
    <div
      className={[
        'h-px w-12 bg-gradient-to-r from-transparent via-[#7CC7FF]/70 to-transparent',
        className,
      ].join(' ')}
    />
  );
}
