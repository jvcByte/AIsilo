import { TextLoop } from "@/components/motion-primitives/text-loop";

const rotatingStatements = [
  "Your files, encrypted and private.",
  "Grant access to specific people instantly.",
  "No passwords. No accounts. Just your wallet.",
  "Your data stays yours forever.",
  "Decentralized. Secure. Simple.",
  "Upload once. Control access forever.",
  "Works with any EVM compatible wallet.",
  "No central authority can block you."
];

export function HeroTextLoop() {
  return (
    <TextLoop className="font-mono md:text-2xl text-xl"
      interval={3}
    >
      {rotatingStatements.map((statement, index) => (
        <span key={index}>{statement}</span>
      ))}
    </TextLoop>
  );
}
