import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "API Simplification",
    description: (
      <>
        Streamline your frontend development effortlessly. Combine multiple
        upstream APIs into a single, tailored API layer that enhances security
        and optimizes performance.
      </>
    ),
  },
  {
    title: "Easy Configuration",
    description: (
      <>
        Set up your API gateway using a simple YAML file. Define endpoints,
        apply built-in policies like CORS and JWT validation, and add custom
        middleware with ease.
      </>
    ),
  },
  {
    title: "Developer-Friendly",
    description: (
      <>
        Get started quickly with the node CLI or Docker image. Compatible with
        any frontend framework and API architecture, it adapts seamlessly to
        your development workflow.
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
