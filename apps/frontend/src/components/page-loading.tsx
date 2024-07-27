import { Spinner } from './spinner';
export const PageLoading = () => {
  return (
    <div className="flex h-dvh items-center justify-center">
      <Spinner className="text-orange-600" />
    </div>
  );
};
