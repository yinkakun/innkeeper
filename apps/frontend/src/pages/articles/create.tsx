import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useCreateArticle } from '../../lib/queries';

interface Input {
  body: string;
  title: string;
  authorName?: string;
  authorEmail?: string;
}

export const CreateArticle = () => {
  const form = useForm<Input>();
  const mutation = useCreateArticle();

  const onSubmit: SubmitHandler<Input> = ({ body, title }) => {
    mutation.mutate(
      { body, title },
      {
        onSuccess: () => {
          form.reset();
          alert('Article created successfully');
        },
      },
    );
  };

  const formErrors = form.formState.errors;

  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-2">
      <div className="flex w-full max-w-lg flex-col gap-8 rounded-3xl border border-neutral-200 bg-neutral-100 p-8">
        <h1 className="font-serif text-3xl text-stone-800">Create Article</h1>
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" {...form.register('title', { required: true })} className="w-full rounded-xl border px-2 py-2" />
            {formErrors.title && formErrors.title.type === 'required' && <span className="text-sm text-red-500">Title is required</span>}
          </div>
          <div>
            <label htmlFor="body">Body</label>
            <textarea
              rows={5}
              id="body"
              {...form.register('body', { required: true })}
              className="w-full resize-none rounded-xl border px-2 py-2"
            ></textarea>
            {formErrors.body && formErrors.body.type === 'required' && <span className="text-sm text-red-500">Title is required</span>}
          </div>
          <div>
            <label htmlFor="author">Author Name</label>
            <input
              type="text"
              id="author"
              {...form.register('authorName', { required: false })}
              className="w-full rounded-xl border px-2 py-2"
            />
          </div>
          <div>
            <label htmlFor="email">Author Email</label>
            <input
              type="email"
              id="email"
              {...form.register('authorEmail', { required: false })}
              className="w-full rounded-xl border px-2 py-2"
            />
          </div>
          <button disabled={mutation.isPending} className="w-full rounded-xl bg-neutral-900 py-2 text-neutral-50">
            {mutation.isPending ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
};
