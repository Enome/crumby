import cx from "classnames";

type InputTextProps = {
  type?: string;
  className?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function InputText(props: InputTextProps) {
  return (
    <input
      type={props.type || "text"}
      className={cx("input", props.className)}
      style={{
        width: (props.defaultValue ? props.defaultValue.length : 1) + "ch",
      }}
      {...props}
      onChange={(e) => {
        props.onChange && props.onChange(e);
      }}
      onBlur={(e) => {
        props.onBlur && props.onBlur(e);
      }}
    />
  );
}
