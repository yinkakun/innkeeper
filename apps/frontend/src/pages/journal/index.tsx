import { z } from 'zod';
import React from 'react';
import { Drawer } from 'vaul';
import { cn } from '@/lib/utils';
import { trpc } from '@/lib/trpc';
import mergeRefs from 'merge-refs';
import { formatRelative } from 'date-fns';
import { createId } from '@paralleldrive/cuid2';
import { JournalEntrySchema } from '@innkeeper/db';
import { ThreeDotsScale } from 'react-svg-spinners';
import { useForm, Controller } from 'react-hook-form';
import { ArrowCircleUp } from '@phosphor-icons/react';
import { ChatBubble } from '@/components/chat-bubble';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, CheckCircle } from '@phosphor-icons/react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export const Journal = () => {
  const [prompts] = trpc.journal.getPrompts.useSuspenseQuery();
  return (
    <div className="grid auto-rows-fr grid-cols-2 gap-6">
      <NewJournalEntry />
      <AnimatePresence>
        {prompts.map(({ prompt, id, updatedAt, createdAt, journalEntries, promptNumber }) => (
          <motion.div layout key={id} className="w-full">
            <JournalEntries
              promptId={id}
              key={id}
              prompt={prompt}
              updatedAt={updatedAt}
              createdAt={createdAt}
              promptNumber={promptNumber}
              journalEntries={journalEntries ?? []}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const chatBubbleVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    originX: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
    originX: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    originX: 0,
  },
  isSenderInitial: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    originX: 1,
  },
  isSenderAnimate: {
    opacity: 1,
    scale: 1,
    y: 0,
    originX: 1,
  },
  isSenderExit: {
    opacity: 0,
    scale: 0.9,
    y: -20,
    originX: 1,
  },
};

const newJournalEntrySchema = z.object({
  entry: z.string().min(1),
});

type NewJournalEntry = z.infer<typeof newJournalEntrySchema>;

const NewJournalEntry = () => {
  const trpcUtils = trpc.useUtils();
  const [isOpened, setIsOpened] = React.useState(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const generatePromptMutation = trpc.journal.generatePrompt.useMutation();
  const promptsQuery = trpc.journal.getPrompts.useQuery();

  const getJournalEntries = (promptId: string | undefined) =>
    promptsQuery.data?.find((prompt) => prompt.id === promptId)?.journalEntries ?? [];

  const journalEntries = getJournalEntries(generatePromptMutation.data?.id);

  const newJournalEntryMutation = trpc.journal.addJournalEntry.useMutation({
    onMutate: async ({ entry, promptId }) => {
      form.reset();
      // cancel any pending fetches
      await trpcUtils.journal.getPrompts.cancel();
      // capture the current value
      const prevJournalEntries = trpcUtils.journal.getPrompts.getData();
      // create a temporary id
      const temporaryJournalId = createId();
      // optimistic update
      trpcUtils.journal.getPrompts.setData(undefined, (old) => {
        if (!old) return [];
        return old.map((prompt) => ({
          ...prompt,
          journalEntries:
            prompt.id === promptId
              ? [
                  ...(prompt.journalEntries ?? []),
                  {
                    entry,
                    promptId,
                    updatedAt: null,
                    userId: prompt.userId,
                    id: temporaryJournalId,
                    createdAt: new Date().toISOString(),
                  },
                ]
              : prompt.journalEntries,
        }));
      });
      return { prevJournalEntries, temporaryJournalId };
    },
    onSuccess: (data, _variables, context) => {
      if (context && data) {
        trpcUtils.journal.getPrompts.setData(undefined, (old) =>
          old?.map((prompt) => ({
            ...prompt,
            journalEntries: prompt.journalEntries?.map((entry) =>
              entry.id === context.temporaryJournalId ? { ...entry, id: data.id } : entry,
            ),
          })),
        );
      }
    },
    onError: (error, _variables, context) => {
      console.error('Error adding journal entry:', error);
      if (context?.prevJournalEntries) {
        trpcUtils.journal.getPrompts.setData(undefined, context.prevJournalEntries);
      }
    },
    onSettled: () => {
      trpcUtils.journal.getPrompts.invalidate();
    },
  });

  const form = useForm<NewJournalEntry>({
    resolver: zodResolver(newJournalEntrySchema),
    defaultValues: {
      entry: '',
    },
  });

  React.useEffect(() => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  }, [form.watch('entry')]);

  React.useEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [journalEntries]);

  const onSubmit = ({ entry }: NewJournalEntry) => {
    if (!generatePromptMutation.isSuccess) return;
    if (newJournalEntryMutation.isPending) return;
    newJournalEntryMutation.mutate({
      entry,
      promptId: generatePromptMutation.data?.id,
    });
  };

  React.useEffect(() => {
    if (!isOpened) return;
    generatePromptMutation.mutate();
  }, [isOpened]);

  return (
    <Drawer.Root open={isOpened} onOpenChange={setIsOpened}>
      <Drawer.Trigger className="h-full">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="z-50 flex h-full min-h-32 flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-white p-4 pt-2 text-left backdrop-blur-md duration-200 hover:border-orange-200 hover:bg-orange-50 hover:bg-opacity-50"
        >
          <div className="flex w-full items-center justify-center">
            <Plus className="text-orange-300" weight="light" size={40} />
          </div>
        </motion.div>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Content className="fixed inset-x-0 top-32 z-50 mx-auto flex max-h-[96%] min-h-[70dvh] w-full max-w-[400px] flex-col overflow-hidden rounded-[36px] border border-orange-300/50 bg-white">
          <div className="relative flex flex-1 flex-col gap-3 pt-3">
            <div className="sr-only">
              <Drawer.Title>Journal Entry</Drawer.Title>
              <Drawer.Description>Journal Entry</Drawer.Description>
            </div>
            <Drawer.Handle className="absolute top-0 mx-auto h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />
            <motion.div layout className="no-scrollbar max-h-full grow basis-0 overflow-y-auto scroll-smooth px-4" ref={chatContainerRef}>
              <AnimatePresence mode="wait">
                {generatePromptMutation.isPending && (
                  <motion.div
                    key="loading"
                    variants={chatBubbleVariants}
                    exit="exit"
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 0.2 }}
                  >
                    <ChatBubble isSender={false} isLast className="px-8">
                      <ThreeDotsScale color="#6B7280" height={20} className="border border-red-500" />
                    </ChatBubble>
                  </motion.div>
                )}

                {generatePromptMutation.isSuccess && (
                  <motion.div
                    key="prompt"
                    exit="exit"
                    initial="initial"
                    animate="animate"
                    variants={chatBubbleVariants}
                    transition={{ duration: 0.2 }}
                  >
                    <ChatBubble isSender={false} isLast>
                      <span className="text-sm text-gray-600">{generatePromptMutation.data?.prompt}</span>
                    </ChatBubble>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col">
                <AnimatePresence>
                  {journalEntries.map(({ entry }, index) => (
                    <motion.div
                      key={index}
                      exit="isSenderExit"
                      initial="isSenderInitial"
                      animate="isSenderAnimate"
                      variants={chatBubbleVariants}
                      transition={{ duration: 0.2 }}
                    >
                      <ChatBubble isSender={true}>{entry}</ChatBubble>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <div className="flex h-full w-full flex-col gap-4 border-t border-orange-100 px-4 py-4 pb-4">
              <form
                id="journal-entry-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('flex grow flex-col overflow-y-auto duration-300')}
              >
                <div className="mt-auto flex items-end gap-2">
                  <Controller
                    name="entry"
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <textarea
                          {...field}
                          ref={mergeRefs(field.ref, textAreaRef)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              form.handleSubmit(onSubmit)();
                            }
                          }}
                          // readOnly={mutation.isPending}
                          className="w-full grow resize-none columns-1 overflow-hidden rounded-3xl border border-orange-100 bg-orange-50 bg-opacity-20 p-2 text-sm text-gray-800 outline-none duration-200 placeholder:text-xs placeholder:text-gray-600 hover:border-orange-500 focus:border-orange-500"
                          placeholder="What's on your mind?"
                        />
                      );
                    }}
                  />
                  <button
                    type="submit"
                    // disabled={mutation.isPending}
                    className="text-orange-500 duration-200 hover:text-orange-400"
                  >
                    <ArrowCircleUp size={24} weight="fill" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Drawer.Content>
        <Drawer.Overlay className="fixed inset-0 z-20 mx-auto bg-orange-900 bg-opacity-20 p-0 backdrop-blur" />
      </Drawer.Portal>
    </Drawer.Root>
  );
};

interface JournalEntryProps {
  promptId: string;
  prompt: string;
  createdAt: string;
  promptNumber: number;
  updatedAt: string | null;
  journalEntries: z.infer<typeof JournalEntrySchema>[];
}

const JournalEntries: React.FC<JournalEntryProps> = ({ prompt, createdAt, promptId, updatedAt, journalEntries, promptNumber }) => {
  const trpcUtils = trpc.useUtils();
  const [isOpen, setIsOpen] = React.useState(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  const newJournalEntryMutation = trpc.journal.addJournalEntry.useMutation({
    onMutate: async ({ entry, promptId }) => {
      form.reset();
      // cancel any pending fetches
      await trpcUtils.journal.getPrompts.cancel();
      // capture the current value
      const prevJournalEntries = trpcUtils.journal.getPrompts.getData();
      // create a temporary id
      const temporaryJournalId = createId();
      // optimistic update
      trpcUtils.journal.getPrompts.setData(undefined, (old) => {
        if (!old) return [];
        return old.map((prompt) => ({
          ...prompt,
          journalEntries:
            prompt.id === promptId
              ? [
                  ...(prompt.journalEntries ?? []),
                  {
                    entry,
                    promptId,
                    updatedAt: null,
                    userId: prompt.userId,
                    id: temporaryJournalId,
                    createdAt: new Date().toISOString(),
                  },
                ]
              : prompt.journalEntries,
        }));
      });
      return { prevJournalEntries, temporaryJournalId };
    },
    onSuccess: (data, _variables, context) => {
      if (context && data) {
        trpcUtils.journal.getPrompts.setData(undefined, (old) =>
          old?.map((prompt) => ({
            ...prompt,
            journalEntries: prompt.journalEntries?.map((entry) =>
              entry.id === context.temporaryJournalId ? { ...entry, id: data.id } : entry,
            ),
          })),
        );
      }
    },
    onError: (error, _variables, context) => {
      console.error('Error adding journal entry:', error);
      if (context?.prevJournalEntries) {
        trpcUtils.journal.getPrompts.setData(undefined, context.prevJournalEntries);
      }
    },
    onSettled: () => {
      trpcUtils.journal.getPrompts.invalidate();
    },
  });

  React.useEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [journalEntries]);

  const form = useForm<NewJournalEntry>({
    resolver: zodResolver(newJournalEntrySchema),
    defaultValues: {
      entry: '',
    },
  });

  React.useEffect(() => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  }, [form.watch('entry')]);

  const onSubmit = ({ entry }: NewJournalEntry) => {
    if (newJournalEntryMutation.isPending) return;
    newJournalEntryMutation.mutate({
      entry,
      promptId,
    });
  };

  const isCreatedToday = isToday(new Date(createdAt));

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
      onClose={() => {
        form.reset();
      }}
    >
      <Drawer.Trigger className="h-full w-full">
        <motion.div
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className={cn(
            'z-50 flex min-h-32 flex-col items-start justify-center gap-3 rounded-3xl border border-gray-300 border-opacity-50 bg-white p-4 py-2 text-left backdrop-blur-md duration-200 hover:border-orange-200 hover:bg-orange-50 hover:bg-opacity-50',
            {
              'border-orange-200 bg-orange-50 bg-opacity-50': isCreatedToday,
            },
          )}
        >
          <span className="text-pretty text-sm text-gray-700">{truncateText(prompt, 140)}</span>

          <div className="mt-auto flex w-full items-center gap-2 text-xs text-orange-400">
            <span className="flex items-center gap-1">
              <CheckCircle size={16} />
              <span>Prompt #{promptNumber}</span>
            </span>
            <span className="capitalize">{formatRelative(new Date(updatedAt ?? createdAt), new Date())}</span>
          </div>
        </motion.div>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Content className="fixed inset-x-0 top-32 z-50 mx-auto flex max-h-[96%] min-h-[70dvh] w-full max-w-[400px] flex-col overflow-hidden rounded-[36px] border border-orange-300/50 bg-white">
          <div className="relative flex flex-1 flex-col gap-3 pt-3">
            <div className="sr-only">
              <Drawer.Title>Journal Entry</Drawer.Title>
              <Drawer.Description>Journal Entry</Drawer.Description>
            </div>
            <Drawer.Handle className="absolute top-0 mx-auto h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />
            <motion.div layout className="no-scrollbar max-h-full grow basis-0 overflow-y-auto scroll-smooth px-4" ref={chatContainerRef}>
              <div className="flex flex-col">
                <ChatBubble isSender={false} isLast className="px-8">
                  {prompt}
                </ChatBubble>
                <AnimatePresence>
                  {journalEntries.map(({ entry }, index) => (
                    <motion.div
                      key={index}
                      exit="isSenderExit"
                      initial="isSenderInitial"
                      animate="isSenderAnimate"
                      variants={chatBubbleVariants}
                      transition={{ duration: 0.2 }}
                    >
                      <ChatBubble isSender={true}>{entry}</ChatBubble>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <div className="flex h-full w-full flex-col gap-4 border-t border-orange-100 px-4 py-4 pb-2">
              <form
                id="journal-entry-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('flex grow flex-col overflow-y-auto duration-300')}
              >
                <div className="mt-auto flex items-end gap-2">
                  <Controller
                    name="entry"
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <textarea
                          {...field}
                          ref={mergeRefs(field.ref, textAreaRef)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              form.handleSubmit(onSubmit)();
                            }
                          }}
                          className="w-full grow resize-none columns-1 overflow-hidden rounded-3xl border border-orange-100 bg-orange-50 bg-opacity-20 p-2 text-sm text-gray-800 outline-none duration-200 placeholder:text-xs placeholder:text-gray-600 hover:border-orange-500 focus:border-orange-500"
                          placeholder="What's on your mind?"
                        />
                      );
                    }}
                  />
                  <button
                    type="submit"
                    disabled={newJournalEntryMutation.isPending}
                    className="text-orange-500 duration-200 hover:text-orange-400"
                  >
                    <ArrowCircleUp size={24} weight="fill" />
                  </button>
                </div>
                <div className="mx-auto mt-2 w-fit rounded-lg px-4 text-[10px] text-gray-500">
                  Use <kbd className="border border-border bg-gray-100 px-1">shift + return</kbd> for new line
                </div>
              </form>
            </div>
          </div>
        </Drawer.Content>
        <Drawer.Overlay className="fixed inset-0 z-20 mx-auto bg-orange-900 bg-opacity-20 p-0 backdrop-blur-xl" />
      </Drawer.Portal>
    </Drawer.Root>
  );
};

function truncateText(text: string, limit: number) {
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() && someDate.getMonth() === today.getMonth() && someDate.getFullYear() === today.getFullYear()
  );
};
