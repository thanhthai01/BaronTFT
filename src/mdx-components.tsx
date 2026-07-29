import type { ComponentType, JSX } from 'react';

type MDXComponents = Record<string, ComponentType<Record<string, unknown>> | keyof JSX.IntrinsicElements>;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
