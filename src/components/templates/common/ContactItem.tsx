import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  className,
  iconClassName,
  showIcon = true,
}) => {
  if (!value || !value.trim()) return null;

  const label = formatContactLabel(type, value);
  const href = type !== 'location' ? getContactHref(type, value) : undefined;
  const mergedIconClass = cn('w-3 h-3 shrink-0', iconClassName);
  const mergedBaseClass = cn(
    'inline-flex items-center gap-1 leading-tight align-middle text-inherit break-words',
    href ? 'hover:underline' : '',
    className
  );

  const renderIcon = () => {
    if (!showIcon) return null;
    switch (type) {
      case 'email':
        return <Mail className={mergedIconClass} aria-hidden="true" />;
      case 'phone':
        return <Phone className={mergedIconClass} aria-hidden="true" />;
      case 'location':
        return <MapPin className={mergedIconClass} aria-hidden="true" />;
      case 'github':
        return <Github className={mergedIconClass} aria-hidden="true" />;
      case 'linkedin':
        return <Linkedin className={mergedIconClass} aria-hidden="true" />;
      case 'leetcode':
        return <Code2 className={mergedIconClass} aria-hidden="true" />;
      case 'portfolio':
      case 'website':
      default:
        return <Globe className={mergedIconClass} aria-hidden="true" />;
    }
  };

  if (type === 'location' || !href) {
    return (
      <span className={mergedBaseClass}>
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
      className={mergedBaseClass}
    >
      {renderIcon()}
      <span>{label}</span>
    </a>
  );
};
