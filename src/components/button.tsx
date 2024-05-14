import cx from "classnames";

type ButtonProps = React.ComponentPropsWithoutRef<"button">;

export default function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      className={cx(
        "bg-cyan-400 px-2 py-1 rounded text-xs font-bold",
        props.className,
      )}
    />
  );
}
