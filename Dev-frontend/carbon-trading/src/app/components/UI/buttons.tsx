import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export function Button({
  className = "",
  variant = "default",
  ...props
}: ButtonProps) {
  // 基本樣式，包含所有按鈕共有的樣式
  const baseClasses =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none border";

  // 變體樣式
  const variantClasses =
    variant === "outline"
      ? "border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
      : "border-[#9FEF00] bg-primary text-black hover:bg-primary-hover";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    />
  );
}

// 添加一個帶有不同輪廓顏色的次要按鈕
export function SecondaryButton({
  className = "",
  ...props
}: Omit<ButtonProps, "variant">) {
  return (
    <Button
      variant="outline"
      className={`border-[#1E2D3D] text-white hover:bg-[#1E2D3D] ${className}`}
      {...props}
    />
  );
}

// 添加一個危險操作按鈕
export function DangerButton({
  className = "",
  ...props
}: Omit<ButtonProps, "variant">) {
  return (
    <Button
      className={`border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600 ${className}`}
      {...props}
    />
  );
}
