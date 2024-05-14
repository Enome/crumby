import cx from "classnames";

type FormulaProps = {
  value: number;
  suffix: string;
  highlight?: boolean;
  bold?: boolean;
  error?: boolean;
};

export default function Formula(props: FormulaProps) {
  if (isNaN(props.value)) {
    return <span className="text-red-500 font-bold">Error</span>;
  }

  const className = cx(
    props.bold ? "font-bold" : "font-normal",
    props.highlight && "text-sky-500",
    props.error && "text-red-500",
  );

  return (
    <span className={className}>
      {props.value.toFixed(2)}
      {props.suffix}
    </span>
  );
}
