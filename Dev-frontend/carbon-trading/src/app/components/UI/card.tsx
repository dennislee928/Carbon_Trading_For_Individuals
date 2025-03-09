import * as React from "react";

// 使用類型別名而不是空接口
type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return <div className={`rounded-lg border ${className}`} {...props} />;
}

// 使用類型別名而不是空接口
type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={`p-6 ${className}`} {...props} />;
}
