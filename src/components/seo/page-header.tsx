
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className = "" }: PageHeaderProps) {
  return (
    <header className={`mb-8 ${className}`}>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-gray-600 mb-4">
          {description}
        </p>
      )}
      {children}
    </header>
  );
}
