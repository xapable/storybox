import type { ReactNode } from 'react';
import './Heading.css';

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
}

export default function Heading({
  children,
  level = 2,
  className = '',
}: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag className={`heading heading--${level} ${className}`}>{children}</Tag>;
}
