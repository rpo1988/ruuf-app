"use client";

import { ChangeEvent, InputHTMLAttributes, RefObject } from "react";

export type InputProps = {
  label?: string;
  innerRef?: RefObject<HTMLInputElement>;
  prefix?: string;
  onChange: (
    value: string | number,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps): JSX.Element {
  return (
    <div className={props.className + " flex flex-row items-center"}>
      {typeof props.label === "string" ? (
        <label htmlFor={props.id}>{props.label}</label>
      ) : null}
      <input
        className="border-b-2 flex-1 outline-none focus:border-b-primary mx-2"
        type={props.type}
        value={props.value}
        ref={props.innerRef}
        disabled={props.disabled}
        onChange={($event) => {
          const parsedValue =
            props.type === "number"
              ? +$event.target.value
              : $event.target.value;
          props.onChange(parsedValue, $event);
        }}
      />
    </div>
  );
}
