import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Code2 } from 'lucide-react';
import { getContactHref, formatContactLabel } from '../templateUtils';

export interface ContactItemProps {
  type: 'email' | 'phone' | 'location' | 'github' | 'linkedin' | 'portfolio' | 'leetcode' | 'website';
  value?: string;
  className?: string;
  iconClassName?: string;
  showIcon?: boolean;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  type,
  value,
  className = 'inline-flex items-center gap-1 text-inherit hover:underline',
  iconClassName = 'w-3 h-3 inline-block shrink-0',
  showIcon = true,
}) => {
  if (!value || !value.trim()) return null;

  const label = formatContactLabel(type, value);
  const href = type !== 'location' ? getContactHref(type, value) : undefined;

  const renderIcon = () => {
    if (!showIcon) return null;
    switch (type) {
      case 'email':
        return <Mail className={iconClassName} />;
      case 'phone':
        return <Phone className={iconClassName} />;
      case 'location':
        return <MapPin className={iconClassName} />;
      case 'github':
        return <Github className={iconClassName} />;
      case 'linkedin':
        return <Linkedin className={iconClassName} />;
      case 'leetcode':
        return <Code2 className={iconClassName} />;
      case 'portfolio':
      case 'website':
      default:
        return <Globe className={iconClassName} />;
    }
  };

  if (type === 'location' || !href) {
    return (
      <span className={className}>
        {renderIcon()}
        <span>{value}</span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target={type === 'email' || type === 'phone' ? undefined : '_blank'}
      rel={type === 'email' || type === 'phone' ? undefined : 'noreferrer'}
      className={className}
    >
      {renderIcon()}
      <span>{label}</span>
    </a>
  );
};
