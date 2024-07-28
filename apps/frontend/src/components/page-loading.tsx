import { ThreeDotsScale } from 'react-svg-spinners';
export const PageLoading = () => {
  return (
    <div className="flex h-dvh items-center justify-center bg-orange-500 text-white">
      <ThreeDotsScale width={100} height={100} color="#fff" />
    </div>
  );
};
