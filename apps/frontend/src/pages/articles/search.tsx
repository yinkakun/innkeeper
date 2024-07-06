import React from 'react';
import type { Article } from '../../lib/queries';
import { useGetArticles } from '../../lib/queries';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

export const SearchArticles = () => {
  const query = useGetArticles();
  const form = useForm<{ title: string }>();
  const [filteredArticles, setFilteredArticles] = React.useState<Article[]>([]);

  if (query.isError) {
    return (
      <div className="flex w-full grow flex-col items-center justify-center">
        <div>Error fetching articles.</div>
      </div>
    );
  }

  if (query.isLoading) {
    return (
      <div className="flex w-full grow flex-col items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  const onSubmit: SubmitHandler<{ title: string }> = ({ title }) => {
    if (!title) return;
    const filteredArticles = query.data?.filter((article) => article.title.includes(title));
    setFilteredArticles(filteredArticles ?? []);
  };

  const noMatch = form.watch('title') && filteredArticles.length === 0;

  return (
    <div className="flex w-full grow flex-col items-center justify-start gap-8">
      <div className="flex w-full flex-col gap-4 rounded-3xl border border-neutral-200 bg-neutral-100 p-6">
        <h1 className="font-serif text-3xl text-stone-800">Search Articles</h1>
        <form className="flex w-full items-center gap-2" onSubmit={form.handleSubmit(onSubmit)}>
          <input
            type="text"
            id="search"
            placeholder="Search articles"
            {...form.register('title', { required: false })}
            className="grow rounded-xl border border-neutral-300 px-2 py-2"
          />
          <button className="flex h-[40px] w-[100px] items-center justify-center rounded-xl bg-neutral-800 px-2 py-2 text-white">
            Search
          </button>
        </form>
      </div>

      {noMatch && <div className="self-start text-left font-serif text-xl text-stone-800">No articles match the search</div>}

      {form.watch('title').length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="font-serif text-xl">
            {filteredArticles.length} article
            {filteredArticles.length > 1 ? 's' : ''} found
          </h2>
          <div className="grid w-full grid-cols-3 gap-4">
            {filteredArticles.map((article) => (
              <div key={article.id} className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-neutral-100 p-4">
                <h2 className="text-base capitalize text-stone-800">{article.title}</h2>
                <p className="text-sm text-stone-800">
                  {
                    // truncate the body to 100 characters
                    article.body.slice(0, 100)
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
