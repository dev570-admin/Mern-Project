import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'trix-editor': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          input?: string;
          value?: string;
          className?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

export {};
