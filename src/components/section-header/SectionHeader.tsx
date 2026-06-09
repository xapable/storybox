import './SectionHeader.css';

interface SectionHeaderProps {
  title: string;
  label?: string;
}

export default function SectionHeader({ title, label }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <h2 className="section-header__title">{title}</h2>
      {label && <span className="section-header__label">{label}</span>}
    </div>
  );
}
