import Link from "next/link";
import { BLOG_NAME } from "@/lib/constants";

const Header = () => {
  return (
    <div>
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
      <Link href="/blog" className="hover:underline">
        {BLOG_NAME}
      </Link>
      .
    </h2>
    </div>
  );
};

export default Header;
