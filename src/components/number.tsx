import { useState, useRef } from "react";

type InputNumberProps = {
  defaultValue: number;
  onChangeNumber: (n: number) => void;
  pattern?: RegExp;
  fixed?: number;
};

export default function InputNumber(props: InputNumberProps) {
  const fixed = props.fixed ?? 2;
  const pattern = props.pattern || /^\d+\.?\d*$/;
  const [value, setValue] = useState(props.defaultValue.toFixed(fixed));
  const lastValidValue = useRef(props.defaultValue);

  return (
    <input
      className="input"
      style={{
        width: (value ? value.length : 1) + "ch",
      }}
      value={value.toString()}
      onChange={(e) => {
        if (pattern.test(e.target.value)) {
          setValue(e.target.value);
          props.onChangeNumber(parseFloat(e.target.value));
          lastValidValue.current = parseFloat(e.target.value);
        }

        if (e.target.value === "") {
          setValue("");
        }
      }}
      onBlur={(e) => {
        let value = parseFloat(e.target.value);

        if (isNaN(value)) {
          value = lastValidValue.current;
        }

        setValue(value.toFixed(fixed));
      }}
    />
  );
}
