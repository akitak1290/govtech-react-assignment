import React from "react";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

/*
 * A styled input component that exposes
 * its ref to the parent
 */
const Input = forwardRef(function Input(
  props: InputProps,
  ref: React.Ref<HTMLInputElement | null>
) {
  const { label, className, ...rest } = props;
  return (
    <>
      {label && <label>{label}</label>}
      <input
        className={`w-full h-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-10 ${className ?? ""}`}
        ref={ref}
        {...rest}
      />
    </>
  );
});

export default Input;
