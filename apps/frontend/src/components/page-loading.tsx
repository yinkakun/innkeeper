import { ThreeDotsScale } from 'react-svg-spinners';
export const PageLoading = () => {
  return (
    <div className="flex h-dvh items-center justify-center bg-white text-orange-500">
      <ThreeDotsScale width={50} height={50} color="#f54100" />
    </div>
  );
};
