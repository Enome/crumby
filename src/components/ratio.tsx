import { useState, useRef } from "react";

type InputRatioProps = {
  defaultValue: string;
  length: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputRatio(props: InputRatioProps) {
  const [value, setValue] = useState(props.defaultValue);
  const lastValidValue = useRef(props.defaultValue);
  const totalLength = props.length + props.length - 1;
  const totalStringRegex = /^(\d:)+\d{1}$/;

  return (
    <input
      className="input"
      style={{
        width: (value ? value.length : 1) + "ch",
      }}
      value={value}
      maxLength={totalLength}
      onChange={(e) => {
        let isValid = true;
        const value = e.target.value;

        // Is partial string valid?
        for (let i = 0; i < value.length; i++) {
          isValid = i % 2 === 0 ? /\d/.test(value[i]) : value[i] === ":";

          if (!isValid) {
            break;
          }
        }

        if (isValid) {
          setValue(value);

          // Is total string valid?
          if (
            totalStringRegex.test(e.target.value) &&
            totalLength === value.length
          ) {
            lastValidValue.current = value;
            props.onChange(e);
          }
        }
      }}
      onBlur={(e) => {
        // If total string is invalid, revert to last valid value
        if (
          !totalStringRegex.test(e.target.value) ||
          totalLength !== value.length
        ) {
          setValue(lastValidValue.current);
        }
      }}
    />
  );
}
