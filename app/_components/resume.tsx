import Container from "@/app/_components/container";

import styles from "./resume-styles.module.css";
import Image from "next/image";
import Link from "next/link";

type ItemProps = {
  children?: React.ReactNode,
  image?: React.ReactNode
}

type NoProps = {
  children?: React.ReactNode
}

type LinkProps = {
  href: string
  children?: React.ReactNode
}

function MovingArrow() {
  return (
    <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
      -&gt;
    </span>
  )
}

function ResumeItemBottom(props: NoProps) {
  return (
    <div className={styles.itembottom}>
      {props.children}
    </div>
  )
}

function ResumeBrick(props: NoProps) {
  return (
    <div className={[styles.button, styles.brick].join(" ")}>
      {props.children}
    </div>
  )
}

function ResumeLink(props: LinkProps) {
  return (
    <Link 
      href={props.href}
      className={[styles.button, styles.link].join(" ")}
    >
      {props.children} <MovingArrow />
    </Link>
  );
}

function ResumeItemTitle(props: NoProps) {
  return (
    <div className="text-2xl font-bold">
      {props.children}
    </div>
  )
}

function ResumeItemSubtitle(props: NoProps)  {
  return (
    <div className="text-1xl">
      {props.children}
    </div>
  )
}

function ResumeItemInfo(props: NoProps) {
  return (
    <div style={{fontStyle: "italic"}} className="text-1xl">
      {props.children}
    </div>
  )
}

function ResumeItem(props: ItemProps) {
  return (
    <div className={styles.item}>
      {props.image}
      <div className={styles.iteminner}>
        {props.children}
      </div>
    </div>
  )
}

type SectionProps = {
  title: string,
  children?: React.ReactNode; // Define children prop as React.ReactNode

}

function ResumeSection(props: SectionProps) {
  return (
    <div className={styles.section}>
      <div style={{paddingBottom: 15}} className="text-4xl lg:text-[2.5rem] font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
        {props.title}
      </div>
      <div className={styles.innersection}>
        {props.children}
      </div>
    </div>
  )
}

type ImageProps = {
  src: string
  innerWidth: number
}

function ResumeImage(props: ImageProps) {
  return (<div className={styles.resumeimg}>
    <Image width={props.innerWidth} height={props.innerWidth} className={styles.resumeimginside} src={props.src} alt="Resume Image"/>
  </div>);
}

export function Resume() {
  return (
    <div id="component-resume" className={["bg-neutral-50", "border-t", "border-neutral-200"].join(" ")}>
      <Container>
        <ResumeSection title="Education">
          <ResumeItem 
            image={(<ResumeImage
                  innerWidth={150}
                  src="/assets/resume/stanford.webp"/>)}>
              <ResumeItemTitle>Stanford University</ResumeItemTitle>
              <ResumeItemSubtitle>Ph.D., Computational and Mathematical Engineering</ResumeItemSubtitle>
              <ResumeItemInfo>2017 — 2022</ResumeItemInfo>
              <ResumeItemBottom>
                <ResumeLink href="https://searchworks.stanford.edu/view/14232875">Thesis</ResumeLink>
              </ResumeItemBottom>
          </ResumeItem>
          <ResumeItem  
            image={(<ResumeImage innerWidth={90} src="/assets/resume/princeton.svg"/>)}>
              <ResumeItemTitle>Princeton University</ResumeItemTitle>
              <ResumeItemSubtitle>
                B.A., Mathematics <br/>
                Minor: Computer Science, Applied Mathematics
              </ResumeItemSubtitle>
              <ResumeItemInfo>2013 — 2017</ResumeItemInfo>
              <ResumeItemBottom>
                <ResumeLink href="https://dataspace.princeton.edu/handle/88435/dsp012801pj966">Thesis</ResumeLink>
              </ResumeItemBottom>
          </ResumeItem>
        </ResumeSection>
        <ResumeSection title="Work Experience">
          <ResumeItem
            image={(<ResumeImage innerWidth={130} src="/assets/resume/meta-logo.svg"/>)}>
              <ResumeItemTitle>Meta (Promotion)</ResumeItemTitle>
              <ResumeItemSubtitle>Research Scientist L5</ResumeItemSubtitle>
              <ResumeItemInfo>2024 — Current</ResumeItemInfo>
          </ResumeItem>
          <ResumeItem
            image={(<ResumeImage innerWidth={130} src="/assets/resume/meta-logo.svg"/>)}>
              <ResumeItemTitle>Meta</ResumeItemTitle>
              <ResumeItemSubtitle>Research Scientist L4</ResumeItemSubtitle>
              <ResumeItemInfo>2022 — 2024</ResumeItemInfo>
          </ResumeItem>
          <ResumeItem 
            image={(<ResumeImage innerWidth={130} src="/assets/resume/meta-logo.svg"/>)}>
              <ResumeItemTitle>Meta</ResumeItemTitle>
              <ResumeItemSubtitle>Research Scientist Intern</ResumeItemSubtitle>
              <ResumeItemInfo>Summer 2021</ResumeItemInfo>
          </ResumeItem>
          <ResumeItem 
            image={(<ResumeImage innerWidth={90} src="/assets/resume/amazon-logo.svg"/>)}>
              <ResumeItemTitle>Amazon</ResumeItemTitle>
              <ResumeItemSubtitle>Applied Data Scientist Intern</ResumeItemSubtitle>
              <ResumeItemInfo>Summer 2020</ResumeItemInfo>
          </ResumeItem>
          <ResumeItem 
            image={(<ResumeImage innerWidth={90} src="/assets/resume/sandia.png"/>)}>
              <ResumeItemTitle>Sandia National Laboratories</ResumeItemTitle>
              <ResumeItemSubtitle>Data Scientist Intern</ResumeItemSubtitle>
              <ResumeItemInfo>Summer 2018</ResumeItemInfo>
          </ResumeItem>
          <ResumeItem 
            image={(<ResumeImage innerWidth={90} src="/assets/resume/google.svg"/>)}>
              <ResumeItemTitle>Google</ResumeItemTitle>
              <ResumeItemSubtitle>Software Engineering Intern</ResumeItemSubtitle>
              <ResumeItemInfo>Summer 2014</ResumeItemInfo>
          </ResumeItem>
        </ResumeSection>
        <ResumeSection title="Publications">
          <ResumeItem 
            image={(<ResumeImage innerWidth={100} src="/assets/resume/paper.png"/>)}>
              <ResumeItemTitle>Operator Shifting for General Noisy Matrix Systems</ResumeItemTitle>
              <ResumeItemSubtitle>Philip A. Etter, Lexing Ying</ResumeItemSubtitle>
              <ResumeItemInfo>SIAM Journal on Mathematics of Data Science</ResumeItemInfo>
              <ResumeItemBottom>
                <ResumeLink href="/posts/gen-op-shift">Blog Post</ResumeLink>
                <ResumeLink href="https://epubs.siam.org/doi/abs/10.1137/21M1416849">Paper Link</ResumeLink>
              </ResumeItemBottom>
          </ResumeItem>
          <ResumeItem 
            image={(<ResumeImage innerWidth={100} src="/assets/resume/paper.png"/>)}>
              <ResumeItemTitle>Operator Shifting for Noisy Elliptic Systems</ResumeItemTitle>
              <ResumeItemSubtitle>Philip A. Etter, Lexing Ying</ResumeItemSubtitle>
              <ResumeItemInfo>Research in the Mathematical Sciences</ResumeItemInfo>
              <ResumeItemBottom>
                <ResumeLink href="/posts/elliptic-op-shift">Blog Post</ResumeLink>
                <ResumeLink href="https://link.springer.com/article/10.1007/s40687-023-00414-x">Paper Link</ResumeLink>
              </ResumeItemBottom>
          </ResumeItem>
          <ResumeItem 
            image={(<ResumeImage innerWidth={100} src="/assets/resume/paper.png"/>)}>
              <ResumeItemTitle>Enterprise-Scale Search: Accelerating Inference for Sparse Extreme Multi-Label Ranking Trees</ResumeItemTitle>
              <ResumeItemSubtitle>Philip A. Etter, Kai Zhong, Hsiang-Fu Yu, Lexing Ying, Injerjit Dhillon</ResumeItemSubtitle>
              <ResumeItemInfo>Proceedings of the ACM Web Conference</ResumeItemInfo>
              <ResumeItemBottom>
                <ResumeLink href="/posts/sparse-xmr">Blog Post</ResumeLink>
                <ResumeLink href="https://dl.acm.org/doi/10.1145/3485447.3511973">Paper Link</ResumeLink>
              </ResumeItemBottom>
          </ResumeItem>
          <ResumeItem 
            image={(<ResumeImage innerWidth={100} src="/assets/resume/paper.png"/>)}>
              <ResumeItemTitle>Online Adaptive Basis Refinement and Compression for Reduced-Order Models via Vector-Space Sieving</ResumeItemTitle>
              <ResumeItemSubtitle>Philip A. Etter, Kevin Carlberg</ResumeItemSubtitle>
              <ResumeItemInfo>Computer Methods in Applied Mechanics and Engineering</ResumeItemInfo>
              <ResumeItemBottom>
                <ResumeLink href="/posts/adaptive-rom">Blog Post</ResumeLink>
                <ResumeLink href="https://www.sciencedirect.com/science/article/abs/pii/S0045782520301146">Paper Link</ResumeLink>
              </ResumeItemBottom>
          </ResumeItem>
          <ResumeItem 
            image={(<ResumeImage innerWidth={100} src="/assets/resume/paper.png"/>)}>
              <ResumeItemTitle>Coarse-Proxy Reduced Basis Methods for Integral Equations</ResumeItemTitle>
              <ResumeItemSubtitle>Philip A. Etter, Yuwei Fan, Lexing Ying</ResumeItemSubtitle>
              <ResumeItemInfo>Journal of Computational Physics</ResumeItemInfo>
              <ResumeItemBottom>
                <ResumeLink href="/posts/coarse-proxy">Blog Post</ResumeLink>
                <ResumeLink href="https://www.sciencedirect.com/science/article/abs/pii/S0021999122008981">Paper Link</ResumeLink>
              </ResumeItemBottom>
          </ResumeItem>
        </ResumeSection>
        <ResumeSection title="Programming Languages">
          <div style={{display: "flex", flexDirection: "row", gap: 20}}>
            <Image width={1000} height={1000} className={styles.programimg} src="/assets/resume/cpp.png" alt="Resume Image"/>
            <Image width={1000} height={1000} className={styles.programimg} src="/assets/resume/cs.png" alt="Resume Image"/>
            <Image width={1000} height={1000} className={styles.programimg} src="/assets/resume/python.png" alt="Resume Image"/>
            <Image width={1000} height={1000} className={styles.programimg} src="/assets/resume/rust.png" alt="Resume Image"/>
          </div>
        </ResumeSection>
      </Container>
      
      <div style={{height: 200}}>

      </div>
    </div>
  );
}

export default Resume;
