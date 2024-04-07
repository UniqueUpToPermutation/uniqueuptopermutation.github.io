import Image from "next/image";
import Link from "next/link";

import "./globals.css";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
      </div>

      <div className="place-items-center flex">
        <div className="drop-shadow-[0_0_1.5rem_#00000030] circular-image-container">
          <Image
            className="circular-image relative"
            src="/assets/blog/authors/me_hires.jpg"
            alt="My Photo"
            width={180*2}
            height={37*2}
            priority
          />
        </div>
      <div style={{marginLeft: 50 + 'px'}}>
      <h1 className={`mb-3 text-4xl font-semibold main-name-title`}>
        Philip A. Etter, Ph.D.
      </h1>
      <h3 className={`mb-3 text-2xl main-name-title opacity-50`}>
        Research Scientist, <Link href="https://about.meta.com/realitylabs/">Meta Reality Labs</Link>
      </h3>
      </div>
      </div>
      
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Link 
            href="/blog"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            rel="noopener"
          >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Résumé{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            See my work history, research publications, and educational credentials.
          </p>
        </Link>
        
        <Link 
          href="/blog"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Blog{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            See my blog about research in data science, computational mathematics, and other topics.
          </p>
        </Link>

        <Link 
          href="/blog"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Tutorials{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            See my collection of mathematics tutorials and explainers.
          </p>
        </Link>

        <Link
          href="https://github.com/uniqueuptopermutation"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            GitHub{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            See my GitHub projects and experiments.
          </p>
        </Link>
      </div>
    </main>
  );
}
