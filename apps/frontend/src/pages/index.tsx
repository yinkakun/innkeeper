import { Link } from '@tanstack/react-router';

export const Index = () => {
  return (
    <div className="flex w-full grow flex-col items-center justify-center">
      <div className="flex w-full max-w-lg flex-col gap-8 rounded-3xl border border-neutral-200 bg-neutral-100 p-8">
        <h1 className="font-serif text-3xl text-stone-800">Articles</h1>
        <div className="flex w-full flex-col gap-4 text-center">
          <Link
            to="/articles/search"
            className="w-full rounded-2xl border border-stone-300 bg-neutral-800 px-2 py-2 text-lg capitalize tracking-wide text-stone-50 duration-200 hover:text-neutral-200"
          >
            Search Articles Blah Blah Blah
          </Link>

          <Link
            to="/articles/create"
            className="w-full rounded-2xl border border-stone-300 bg-neutral-800 px-2 py-2 text-lg capitalize tracking-wide text-stone-50 duration-200 hover:text-neutral-200"
          >
            Create Article
          </Link>
        </div>
      </div>
    </div>
  );
};
