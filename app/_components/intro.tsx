import { BLOG_NAME } from "@/lib/constants";

export function Intro() {
  return (
    <section className="flex-col md:flex-col flex items-left md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        {BLOG_NAME}.
      </h1>
      <h2 className="text-2xl md:text-5xl md:pr-8">
        Philip A. Etter{`'s`} Blog
      </h2>
    </section>
  );
}
