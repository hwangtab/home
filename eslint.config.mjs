import nextVitals from 'eslint-config-next/core-web-vitals';

export default [
  ...nextVitals,
  {
    rules: {
      // display-name is redundant with React.FC and React.memo
      'react/display-name': 'off',
      // Korean text uses unescaped entities naturally
      'react/no-unescaped-entities': 'off',
      // next/image migration is in progress — allow <img> as warning
      '@next/next/no-img-element': 'warn',
      // Anonymous exports are intentional for page routes
      'import/no-anonymous-default-export': 'off',
      // State in useEffect is needed for event listeners and scroll handling
      'react-hooks/set-state-in-effect': 'off',
      // Component purity rules conflict with practical React patterns
      'react-hooks/purity': 'off',
      // Manual memoization is intentional — enforce only when problematic
      'react-hooks/preserve-manual-memoization': 'warn'
    }
  }
];
