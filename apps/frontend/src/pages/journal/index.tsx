import { Drawer } from 'vaul';
import { AppLayout } from '@/components/app-layout';
import { useMeasure } from 'react-use';
import { Plus, Asterisk } from '@phosphor-icons/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { RouterInputs } from '@innkeeper/trpc';
import React from 'react';
import { TrashSimple } from '@phosphor-icons/react';

const shadowJournalingPrompts = [
  {
    subject: 'Unveiling Hidden Fears',
    entry:
      'I have been avoiding confronting my fear of failure. Facing it might lead to personal growth by helping me understand that failure is a natural part of life.',
    prompt: 'What fear have you been avoiding confronting? How might facing it lead to personal growth?',
  },
  {
    subject: "Exploring Anger's Roots",
    entry:
      'I recently felt intense anger when my partner forgot our anniversary. This anger might be protecting my need for acknowledgment and appreciation.',
    prompt: 'Recall a recent moment of intense anger. What unmet need or wounded part of yourself might this anger be protecting?',
  },
  {
    subject: 'Embracing the Inner Critic',
    entry:
      'My inner critic often tells me that I am not good enough. This voice might be trying to protect me from rejection or disappointment.',
    prompt: 'What does your inner critic often say? How might this voice be trying to protect you, despite its harsh methods?',
  },
  {
    subject: 'Illuminating Shame',
    entry:
      'I feel shame when I think about how I acted at my friend’s party. Offering compassion to myself in that moment might mean acknowledging that I was doing the best I could.',
    prompt: 'Describe a memory that brings up feelings of shame. What would it mean to offer compassion to yourself in that moment?',
  },
];

const journalEntrySchema = z.object({
  entry: z.string().nonempty(),
});

type JournalEntry = z.infer<typeof journalEntrySchema>;

interface JournalProps {
  entries: RouterInputs['journal']['entries'];
}

export const Journal: React.FC<JournalProps> = ({ entries }) => {
  return (
    <AppLayout className="gap-6">
      <div className="grid auto-rows-fr grid-cols-2 gap-6">
        <NewJournalEntry />
        {shadowJournalingPrompts.map(({ prompt, entry }, index) => (
          <JournalEntries key={index} prompt={prompt} entry={entry} />
        ))}
      </div>
    </AppLayout>
  );
};

const NewJournalEntry = () => {
  const [ref, { height }] = useMeasure<HTMLFormElement>();
  const form = useForm<JournalEntry>({
    resolver: zodResolver(journalEntrySchema),
  });

  const onSubmit = (data: JournalEntry) => {
    console.log(data);
  };

  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <div className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-3xl border border-[#ffa380] border-opacity-20 bg-[#ffede5] bg-opacity-20 p-4 pt-2 text-left backdrop-blur-md">
          <div className="flex w-full items-center justify-center">
            <Plus className="text-orange-500" size={24} />
          </div>
          <div className="flex flex-col gap-2 text-orange-800">
            <span className="text-sm font-medium">New Journal Entry</span>
          </div>
        </div>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Content className="fixed bottom-4 left-0 right-0 z-50 mx-auto flex max-h-[96%] min-h-[70dvh] max-w-[calc(768px-68px)] flex-col bg-transparent">
          <div className="relative flex flex-1 flex-col gap-4 rounded-3xl bg-white px-4 pb-4 pt-2">
            <Drawer.Handle className="absolute top-2 mx-auto h-1.5 w-12 flex-shrink-0 rounded-full bg-neutral-300" />

            <div className="absolute top-0 flex w-full items-center justify-between gap-2 px-8 py-4">
              <div></div>
              <button className="flex h-8 w-full max-w-[100px] items-center justify-center rounded-lg bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm text-neutral-50 duration-200">
                <span>Create</span>
              </button>
            </div>
            <div className="mt-10 flex h-full w-full grow flex-col gap-4 rounded-2xl bg-transparent bg-opacity-50">
              <form ref={ref} id="journal-entry-form" onSubmit={form.handleSubmit(onSubmit)} className="flex grow flex-col overflow-y-auto">
                <textarea
                  style={{ height: height }}
                  {...form.register('entry')}
                  className="border-1 h-full w-full grow resize-none rounded-2xl border border-orange-300 border-opacity-50 bg-white p-2 text-neutral-900 outline-none duration-200 hover:border-orange-200 focus:border-orange-200"
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
  entry?: string;
  prompt?: string;
}

const JournalEntries: React.FC<JournalEntryProps> = ({ prompt, entry }) => {
  const [editing, setEditing] = React.useState(false);
  const [ref, { height }] = useMeasure<HTMLFormElement>();
  const form = useForm<JournalEntry>({
    resolver: zodResolver(journalEntrySchema),
  });

  const onSubmit = (data: JournalEntry) => {
    console.log(data);
  };

  return (
    <Drawer.Root
      onClose={() => {
        form.reset();
        setEditing(false);
      }}
    >
      <Drawer.Trigger>
        <div
          className={cn(
            'flex h-full scale-95 flex-col gap-3 rounded-2xl border border-orange-100 bg-orange-50 bg-opacity-20 p-4 pt-2 text-left backdrop-blur-md duration-200 hover:bg-opacity-80',
            {
              // random slight rotation
              'rotate-[-1deg]': Math.random() > 0.5,
            },
          )}
        >
          <div className="flex flex-col gap-2 text-neutral-900">
            <span className="text-pretty text-sm">{truncateText(entry ?? prompt ?? '', 140)}</span>
          </div>

          <div className="mt-auto flex w-full items-center gap-1 text-neutral-600">
            <Asterisk size={16} />
            <span className="rounded-full text-xs">Saturday August 12th</span>
          </div>
        </div>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Content className="fixed bottom-5 left-0 right-0 z-50 mx-auto flex max-h-[96%] min-h-[70dvh] max-w-[calc(768px-68px)] flex-col rounded-3xl bg-transparent">
          <div className="relative flex flex-1 flex-col gap-4 rounded-[20px] bg-white px-4 pb-4 pt-2">
            <Drawer.Handle className="absolute top-2 mx-auto h-1.5 w-12 flex-shrink-0 rounded-full bg-neutral-300" />

            <div className="absolute inset-x-0 top-0 flex w-full items-center justify-between gap-2 px-4 py-4">
              <div className="flex items-center gap-1 text-neutral-600">
                <Asterisk size={18} />
                <span className="rounded-full text-xs">Saturday August 12th</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex size-8 items-center justify-center rounded-xl text-neutral-500 duration-200 hover:bg-neutral-100 hover:text-orange-500">
                  <TrashSimple size={18} />
                  <span className="sr-only">Delete</span>
                </button>
                {editing ? (
                  <button
                    type="submit"
                    className="flex h-8 w-[80px] items-center justify-center rounded-lg bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm text-neutral-50 duration-200"
                  >
                    <span>Update</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={() => setEditing(true)}
                    className="flex h-8 w-[80px] items-center justify-center rounded-lg border border-neutral-200 bg-gray-100 py-1 text-sm text-neutral-700 duration-200"
                  >
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-10 flex h-full w-full grow flex-col gap-4 rounded-2xl bg-transparent bg-opacity-50">
              <div className="rounded-2xl border border-orange-100 bg-orange-50 bg-opacity-60 p-4">
                <span className="text-sm font-medium text-neutral-800">{prompt}</span>
              </div>
              <form
                ref={ref}
                id="journal-update-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex grow flex-col overflow-y-auto"
              >
                <textarea
                  readOnly={!editing}
                  style={{ height: height }}
                  {...form.register('entry')}
                  className="border-1 h-full w-full grow resize-none rounded-2xl border border-orange-300 border-opacity-50 bg-white p-2 text-neutral-900 outline-none duration-200 hover:border-orange-200 focus:border-orange-200"
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
