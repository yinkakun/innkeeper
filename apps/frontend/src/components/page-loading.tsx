import { ThreeDotsScale } from 'react-svg-spinners';
export const PageLoading = () => {
  return (
    <div className="flex h-dvh items-center justify-center bg-orange-500 text-white">
      <ThreeDotsScale width={50} height={50} color="#fff" />
    </div>
  );
};
