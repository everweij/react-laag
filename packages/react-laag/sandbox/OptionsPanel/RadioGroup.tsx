import * as React from "react";

type RadioGroupProps = {
  items: { value: any; display: string }[];
  value: any;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function RadioGroup({
  items,
  value,
  onChange,
  disabled
}: RadioGroupProps) {
  return (
    <div style={{ display: "flex", marginTop: 6 }}>
      {items.map(item => {
        return (
          <div
            key={item.value}
            style={{ display: "flex", alignItems: "center" }}
            onClick={() => {
              if (disabled) {
                return;
              }

              onChange(item.value);
            }}
          >
            <input
              type="radio"
              style={{ marginRight: 4 }}
              disabled={disabled}
              checked={item.value === value}
              readOnly
            />
            <div>{item.display}</div>
          </div>
        );
      })}
    </div>
  );
}
