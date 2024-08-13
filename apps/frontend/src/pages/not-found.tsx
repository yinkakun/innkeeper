import { Link } from '@tanstack/react-router';

export const NotFound = () => {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center -space-y-8">
        <h1 className="flex flex-row items-baseline">
          <span className="font-serif text-[13vw]">404</span>
          {/* <span className="text-3xl">404s and heartbreak.</span> */}
        </h1>
        <p className="text-lg">Either you're lost or I am, but either way, this page doesn't exist.</p>
      </div>
      <Link
        to="/journal"
        className="flex h-10 w-full max-w-[200px] items-center justify-center rounded-3xl border border-orange-400 bg-white px-8 py-2 text-sm font-normal text-orange-500 duration-200 hover:bg-orange-400 hover:text-white"
      >
        Go Home
      </Link>
    </div>
  );
};
