import { Drawer } from 'vaul';
import { AppLayout } from '@/components/app-layout';
import { useMeasure } from 'react-use';
import { CalendarCheck, Plus } from '@phosphor-icons/react';

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

export const Journal = () => {
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
            <Drawer.Handle className="absolute top-2 mx-auto h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />

            <div className="absolute top-0 flex w-full items-center justify-between gap-2 px-8 py-4">
              <div></div>
              <button className="flex h-8 w-full max-w-[100px] items-center justify-center rounded-lg bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm text-stone-50 duration-200">
                <span>Save</span>
              </button>
            </div>

            <div className="flex h-full w-full grow flex-col">
              <form ref={ref} className="flex grow flex-col gap-4 overflow-y-auto pt-10">
                <textarea
                  style={{ height: height }}
                  className="h-full w-full grow resize-none rounded-2xl border bg-gray-50 p-2 focus:bg-orange-50"
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
  const [ref, { height }] = useMeasure<HTMLFormElement>();

  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <div className="flex h-full flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 pt-2 text-left backdrop-blur-md">
          <div className="flex flex-col gap-2 text-stone-800">
            <span className="text-pretty text-xs">{truncateText(entry ?? prompt ?? '', 140)}</span>
          </div>

          <div className="mt-auto flex w-full items-center gap-2 text-neutral-500">
            <CalendarCheck className="rotate-1" size={16} />
            <span className="rounded-full text-xs">Saturday August 12th</span>
          </div>
        </div>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Content className="fixed bottom-7 left-0 right-0 z-50 mx-auto flex max-h-[96%] min-h-[70dvh] max-w-[calc(768px-88px)] flex-col bg-transparent">
          <div className="relative flex flex-1 flex-col gap-4 rounded-[20px] bg-white px-4 pb-4 pt-2">
            <Drawer.Handle className="absolute top-2 mx-auto h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />

            <div className="absolute inset-x-0 top-0 flex w-full items-center justify-between gap-2 px-4 py-4">
              <div className="flex items-center gap-2 text-neutral-600">
                <CalendarCheck size={18} />
                <span className="rounded-full text-xs">Saturday August 12th</span>
              </div>
              <button className="flex h-8 w-full max-w-[100px] items-center justify-center rounded-lg bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm text-stone-50 duration-200">
                <span>Save</span>
              </button>
            </div>

            <div className="flex h-full w-full grow flex-col">
              <form ref={ref} className="flex grow flex-col gap-4 overflow-y-auto pt-10">
                <textarea
                  value={entry}
                  style={{ height: height }}
                  className="h-full w-full grow resize-none rounded-2xl border bg-gray-50 p-2 focus:bg-orange-50"
                  placeholder="Enter prompt"
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
