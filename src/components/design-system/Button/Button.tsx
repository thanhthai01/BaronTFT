import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type CommonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  className?: string;
};

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type ButtonAsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function getClasses({
  variant = 'primary',
  size = 'md',
  block = false,
  className = '',
}: Pick<CommonProps, 'variant' | 'size' | 'block' | 'className'>) {
  return [styles.button, styles[variant], styles[size], block && styles.block, className].filter(Boolean).join(' ');
}

export function Button(props: ButtonProps) {
  if (typeof props.href === 'string') {
    const { children, href, variant, size, block, className, ...anchorProps } = props;
    return (
      <Link className={getClasses({ variant, size, block, className })} href={href} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { children, variant, size, block, className, ...buttonProps } = props;
  return (
    <button className={getClasses({ variant, size, block, className })} {...buttonProps}>
      {children}
    </button>
  );
}
