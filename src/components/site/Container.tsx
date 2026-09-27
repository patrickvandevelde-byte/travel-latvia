export function Container({
  children,
  className = "",
  narrow = false,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
  id?: string;
}) {
  return (
    <div id={id} className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${narrow ? "max-w-3xl" : "max-w-6xl"} ${className}`}>
      {children}
    </div>
  );
}
