import Link from "next/link";
import { Container } from "@/components/site/Container";

export default function NotFound() {
  return (
    <Container narrow className="py-24 text-center">
      <p className="text-sea text-sm font-semibold tracking-widest uppercase">Page not found</p>
      <h1 className="text-forest mt-3 text-4xl font-semibold">This path leads nowhere, like a trail into the bog</h1>
      <p className="mt-4">The page may have moved. Try the home page or browse experiences.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/" className="bg-forest text-linen rounded-full px-5 py-2.5 font-semibold">
          Home
        </Link>
        <Link href="/experiences" className="ring-forest text-forest rounded-full px-5 py-2.5 font-semibold ring-1">
          Experiences
        </Link>
      </div>
    </Container>
  );
}
