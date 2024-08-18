import { ThreeDotsScale } from 'react-svg-spinners';

interface SpinnerProps {
  size?: number;
  className?: string;
  color?: 'white' | 'black' | 'orange';
}

const colorMap = {
  white: '#fff',
  black: '#000',
  orange: '#f54100',
};

export const Spinner: React.FC<SpinnerProps> = ({ className, size = 20, color }) => {
  return <ThreeDotsScale width={size} height={size} color={color ? colorMap[color] : '#fff'} className={className} />;
};
