'use client';
import { TRPCReact } from '@/utils/api';
import type { RouterOutputs } from '@/utils/api';

export const Example = () => {
  const greet = TRPCReact.example.hello.useQuery({ text: 'Yinka' });

  const handleClick = async () => {
    await greet.refetch();
  };

  return (
    <div>
      <h1>Example</h1>

      <button onClick={handleClick}>Fetch</button>
    </div>
  );
};
