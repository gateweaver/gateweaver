import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Easy Configuration",
    description: (
      <>
        Set up your BFF with ease using a simple YAML file. Get started quickly,
        letting you focus on development.
      </>
    ),
  },
  {
    title: "Secure by Design",
    description: (
      <>
        Gateweaver prioritizes your application's security, enabling safe API
        interactions through straightforward policy implementations.
      </>
    ),
  },
  {
    title: "Effortless Integration",
    description: (
      <>
        Seamlessly integrate APIs into your projects, offering both local
        development ease and versatile deployment options.
      </>
    ),
  },
];

function Feature({ title, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center"></div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
