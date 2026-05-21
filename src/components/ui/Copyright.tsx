interface CopyrightProps {
  year?: number;
}

export const Copyright = ({ year }: CopyrightProps) => {
  const currentYear = year ?? new Date().getFullYear();
  return <span>&copy; {currentYear}</span>;
};
