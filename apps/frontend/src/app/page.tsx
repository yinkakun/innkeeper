'use client';
import { trpcAPI } from '@/app/providers';

export default function HomePage() {
  const greetingQuery = trpcAPI.example.hello.useQuery({ text: 'Yinka' });

  const handleClick = async () => {
    await greetingQuery.refetch();
  };

  return (
    <main className="p-2">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg">{greetingQuery.data?.greeting}</h1>
        <button onClick={handleClick} className="w-fit border bg-blue-600 px-3 py-1 text-white">
          Say Hello
        </button>
      </div>
    </main>
  );
}
