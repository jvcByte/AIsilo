import { TextLoop } from "@/components/motion-primitives/text-loop";

const rotatingStatements = [
  "Monetize AI models",
  "discover high-quality datasets",
  "verifiable provenance",
];

export function HeroTextLoop() {
  return (
    <TextLoop className="font-mono md:text-2xl text-xl" interval={3}>
      {rotatingStatements.map((statement, index) => (
        <span key={index}>{statement}</span>
      ))}
    </TextLoop>
  );
}
