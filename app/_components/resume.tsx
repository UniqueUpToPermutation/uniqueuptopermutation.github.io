import Container from "@/app/_components/container";

import styles from "./resume-styles.module.css";
import Image from "next/image";

type ItemProps = {
  title: string,
  underTitle?: string,
  children?: React.ReactNode,
  image?: React.ReactNode
}

function ResumeItem(props: ItemProps) {
  return (
    <div className={styles.item}>
      {props.image}
      <div>
        <div style={{paddingTop: 15}} className="text-2xl font-bold">
          {props.title}
        </div>
        <div className="text-1xl">
          {props.underTitle}
        </div>
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
    <div id="component-resume" className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <ResumeSection title="Education">
          <ResumeItem 
            title="Stanford University" 
            image={(<ResumeImage
                  innerWidth={150}
                  src="/assets/resume/stanford.webp"/>)}
            underTitle="Ph.D., Computational and Mathematical Engineering">
          </ResumeItem>
          <ResumeItem 
            title="Princeton University" 
            image={(<ResumeImage innerWidth={90} src="/assets/resume/princeton.svg"/>)}
            underTitle="B.A., Mathematics">
          </ResumeItem>
        </ResumeSection>
        <ResumeSection title="Work Experience">
          <ResumeItem 
            title="Meta" 
            image={(<ResumeImage innerWidth={130} src="/assets/resume/meta-logo.svg"/>)}
            underTitle="Research Scientist">
          </ResumeItem>
          <ResumeItem 
            title="Meta" 
            image={(<ResumeImage innerWidth={130} src="/assets/resume/meta-logo.svg"/>)}
            underTitle="Research Scientist Intern">
          </ResumeItem>
          <ResumeItem 
            title="Amazon" 
            image={(<ResumeImage innerWidth={90} src="/assets/resume/amazon-logo.svg"/>)}
            underTitle="Applied Data Scientist Intern">
          </ResumeItem>
          <ResumeItem 
            title="Sandia National Laboratories" 
            image={(<ResumeImage innerWidth={90} src="/assets/resume/sandia.png"/>)}
            underTitle="Data Scientist Intern">
          </ResumeItem>
          <ResumeItem 
            title="Google" 
            image={(<ResumeImage innerWidth={90} src="/assets/resume/google.svg"/>)}
            underTitle="Software Engineering Intern">
          </ResumeItem>
        </ResumeSection>
        <ResumeSection title="Publications">
          <div style={{height: 200}}>
              Contents Forthcoming
          </div>
        </ResumeSection>
      </Container>
    </div>
  );
}

export default Resume;
