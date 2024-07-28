import { Drawer } from 'vaul';
import { AppLayout } from '@/components/app-layout';
import { useMeasure } from 'react-use';
import { Plus, Asterisk } from '@phosphor-icons/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import React from 'react';
import { TrashSimple } from '@phosphor-icons/react';
import { trpc } from '@/lib/trpc';
import { Spinner } from '@/components/spinner';
import { formatRelative } from 'date-fns';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const journalEntrySchema = z.object({
  entry: z.string().nonempty(),
});

type JournalEntry = z.infer<typeof journalEntrySchema>;

export const Journal = () => {
  const entries = trpc.journal.entries.useQuery().data ?? [];
  return (
    <AppLayout className="gap-6">
      <div className="grid auto-rows-fr grid-cols-2 gap-6">
        <NewJournalEntry />
        <AnimatePresence>
          {entries.map(({ prompt, entry, id, updatedAt, createdAt }) => (
            <motion.div
              className="w-full"
              key={id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <JournalEntries
                id={id}
                key={id}
                entry={entry}
                prompt={prompt.body}
                promptId={prompt.id}
                updatedAt={updatedAt}
                createdAt={createdAt}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

const NewJournalEntry = () => {
  const [isOpened, setIsOpened] = React.useState(false);
  const mutation = trpc.journal.create.useMutation();
  const [ref, { height }] = useMeasure<HTMLFormElement>();
  const form = useForm<JournalEntry>({
    resolver: zodResolver(journalEntrySchema),
  });

  const onSubmit = (data: JournalEntry) => {
    mutation.mutate(
      {
        entry: data.entry,
      },
      {
        onSuccess: () => {
          setIsOpened(false);
          toast.success('Journal entry created');
          form.reset();
        },
      },
    );
  };

  return (
    <Drawer.Root open={isOpened} onOpenChange={setIsOpened}>
      <Drawer.Trigger>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="z-50 flex min-h-32 flex-col items-center justify-center gap-3 rounded-3xl border border-[#ffa380] border-opacity-20 bg-[#ffede5] bg-opacity-20 p-4 pt-2 text-left backdrop-blur-md"
        >
          <div className="flex w-full items-center justify-center">
            <Plus className="text-orange-500" size={24} />
          </div>
          <div className="flex flex-col gap-2 text-orange-800">
            <span className="text-sm font-medium">New Journal Entry</span>
          </div>
        </motion.div>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Content className="fixed bottom-4 left-0 right-0 z-50 mx-auto flex max-h-[96%] min-h-[70dvh] max-w-[calc(768px-68px)] flex-col bg-transparent">
          <div className="relative flex flex-1 flex-col gap-4 rounded-3xl bg-white px-4 pb-4 pt-2">
            <Drawer.Handle className="absolute top-2 mx-auto h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />

            <div className="absolute top-0 flex w-full items-center justify-between gap-2 px-8 py-4">
              <div></div>
              <button
                type="submit"
                form="journal-entry-form"
                className="flex h-8 w-[80px] items-center justify-center rounded-lg bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm text-zinc-50 duration-200"
              >
                {mutation.isPending ? <Spinner /> : 'Save'}
              </button>
            </div>
            <div className="mt-10 flex h-full w-full grow flex-col gap-4 rounded-2xl bg-transparent bg-opacity-50">
              <form ref={ref} id="journal-entry-form" onSubmit={form.handleSubmit(onSubmit)} className="flex grow flex-col overflow-y-auto">
                <textarea
                  style={{ height: height }}
                  {...form.register('entry')}
                  className="border-1 h-full w-full grow resize-none rounded-2xl border border-orange-300 border-opacity-50 bg-white p-2 text-zinc-900 outline-none duration-200 hover:border-orange-200 focus:border-orange-200"
                  placeholder="What's on your mind?"
                />
              </form>
            </div>
          </div>
        </Drawer.Content>
        {/* TODO: Use CSS vars here */}
        <Drawer.Overlay className="fixed inset-0 bottom-5 top-5 z-10 mx-auto max-w-[calc(768px-68px)] rounded-3xl bg-black/40 p-0 backdrop-blur-sm" />
      </Drawer.Portal>
    </Drawer.Root>
  );
};

interface JournalEntryProps {
  id: string;
  entry?: string;
  prompt?: string;
  createdAt: string;
  updatedAt: string | null;
  promptId: string;
}

const JournalEntries: React.FC<JournalEntryProps> = ({ prompt, entry, createdAt, id, updatedAt }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const updateMutation = trpc.journal.update.useMutation();
  const deleteMutation = trpc.journal.delete.useMutation();
  const [ref, { height }] = useMeasure<HTMLFormElement>();
  const form = useForm<JournalEntry>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      entry,
    },
  });

  const onSubmit = (data: JournalEntry) => {
    if (updateMutation.isPending) return;
    updateMutation.mutate(
      {
        id,
        promptId: '',
        entry: data.entry,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          toast.success('Journal entry updated');
        },
      },
    );
  };

  const handleDelete = () => {
    if (deleteMutation.isPending) return;
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          setIsOpen(false);
          toast.success('Journal entry deleted');
        },
      },
    );
  };

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      onClose={() => {
        form.reset();
      }}
    >
      <Drawer.Trigger className="h-full w-full">
        <motion.div
          // whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'flex h-full w-full flex-col gap-3 rounded-2xl border border-orange-100 bg-orange-50 bg-opacity-20 p-4 pt-2 text-left backdrop-blur-md duration-200 hover:bg-opacity-80',
          )}
        >
          <div className="flex flex-col gap-2 text-zinc-900">
            <span className="text-pretty text-sm">{truncateText(entry ?? prompt ?? '', 140)}</span>
          </div>

          <div className="mt-auto flex w-full items-center gap-1 text-zinc-600">
            <Asterisk size={16} />
            <span className="rounded-full text-xs capitalize">
              {updatedAt ? 'Updated' : 'Created'} {formatRelative(new Date(updatedAt ?? createdAt), new Date())}
            </span>
          </div>
        </motion.div>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Content className="fixed bottom-5 left-0 right-0 z-50 mx-auto flex max-h-[96%] min-h-[70dvh] max-w-[calc(768px-68px)] flex-col rounded-3xl bg-transparent">
          <div className="relative flex flex-1 flex-col gap-4 rounded-[20px] bg-white px-4 pb-4 pt-2">
            <Drawer.Handle className="absolute top-2 mx-auto h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />

            <div className="absolute inset-x-0 top-0 flex w-full items-center justify-between gap-2 px-4 py-4">
              <div className="flex items-center gap-1 text-zinc-600">
                <Asterisk size={18} />
                <span className="rounded-full text-xs">Saturday August 12th</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDelete}
                  className="flex size-8 items-center justify-center rounded-xl text-zinc-500 duration-200 hover:bg-zinc-100 hover:text-orange-500"
                >
                  {deleteMutation.isPending ? <Spinner /> : <TrashSimple size={16} />}
                  <span className="sr-only">{deleteMutation.isPending ? 'Deleting...' : 'Delete'}</span>
                </button>
                <button
                  type="submit"
                  form="journal-update-form"
                  className="flex h-8 w-[80px] items-center justify-center rounded-lg bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm text-zinc-50 duration-200"
                >
                  {updateMutation.isPending ? <Spinner /> : 'Save'}
                </button>
              </div>
            </div>

            <div className="mt-10 flex h-full w-full grow flex-col gap-4 rounded-2xl bg-transparent bg-opacity-50">
              {prompt && (
                <div className="rounded-2xl border border-orange-100 bg-orange-50 bg-opacity-60 p-4">
                  <span className="text-sm font-medium text-zinc-800">{prompt}</span>
                </div>
              )}
              <form
                ref={ref}
                id="journal-update-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex grow flex-col overflow-y-auto"
              >
                <textarea
                  style={{ height: height }}
                  {...form.register('entry')}
                  className="border-1 h-full w-full grow resize-none rounded-2xl border border-orange-300 border-opacity-50 bg-white p-2 text-zinc-900 outline-none duration-200 hover:border-orange-200 focus:border-orange-200"
                  placeholder="What's on your mind?"
                />
              </form>
            </div>
          </div>
        </Drawer.Content>
        {/* TODO: Use CSS vars here */}
        <Drawer.Overlay className="fixed inset-0 bottom-5 top-5 z-10 mx-auto max-w-[calc(768px-68px)] rounded-3xl bg-black/20 p-0 backdrop-blur-sm" />
      </Drawer.Portal>
    </Drawer.Root>
  );
};

function truncateText(text: string, limit: number) {
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}
