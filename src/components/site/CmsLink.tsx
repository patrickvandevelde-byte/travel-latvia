import Link from "next/link";
import { hrefFor, type LinkValue } from "@/modules/content/links";

type Props = { link: LinkValue | undefined; className?: string; children?: React.ReactNode };

export function CmsLink({ link, className, children }: Props) {
  const href = hrefFor(link);
  const label = children ?? link?.label;
  if (!href) return null;
  if (link?.kind === "external") {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
