import Link from "next/link";
import { Container } from "@/components/site/Container";

export default function NotFound() {
  return (
    <Container narrow className="py-24 text-center">
      <p className="text-forest text-sm font-semibold tracking-widest uppercase">Page not found</p>
      <h1 className="display mt-3 text-5xl">This path leads nowhere, like a trail into the bog</h1>
      <p className="mt-4">The page may have moved. Try the home page or browse experiences.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/" className="btn btn-solid">
          Home
        </Link>
        <Link href="/experiences" className="btn">
          Experiences
        </Link>
      </div>
    </Container>
  );
}
