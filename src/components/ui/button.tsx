import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "rounded-md bg-brand-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-900 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
