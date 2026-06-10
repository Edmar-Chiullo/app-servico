"use client"

import { forwardRef } from "react"

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  as?: "input" | "textarea"
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", as = "input", ...props }, ref) => {
    const baseClass = `block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} ${className}`

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        {as === "textarea" ? (
          <textarea
            className={baseClass}
            {...(props as any)}
          />
        ) : (
          <input
            ref={ref}
            className={baseClass}
            {...props}
          />
        )}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    )
  }
)

Input.displayName = "Input"
