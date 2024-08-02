import { Drawer } from 'vaul';
import { AppLayout } from '@/components/app-layout';
import { Plus, CheckCircle, TrashSimple } from '@phosphor-icons/react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import React from 'react';
import { trpc } from '@/lib/trpc';
import { formatRelative } from 'date-fns';
import { ArrowCircleUp } from '@phosphor-icons/react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChatBubble } from '@/components/chat-bubble';
import { ThreeDotsScale } from 'react-svg-spinners';
import { JournalEntrySchema } from '@innkeeper/db';
import mergeRefs from 'merge-refs';

const journalEntrySchema = z.object({
  entry: z.string().min(1),
});

type JournalEntry = z.infer<typeof journalEntrySchema>;

export const Journal = () => {
  const prompts = trpc.journal.getPrompts.useQuery().data ?? [];
  return (
    <AppLayout className="gap-6">
      <div className="grid auto-rows-fr grid-cols-2 gap-6">
        <NewJournalEntry />
        <AnimatePresence>
          {prompts.map(({ prompt, id, updatedAt, createdAt, journalEntries }) => (
            <motion.div
              className="w-full"
              layout
              key={id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <JournalEntries
                promptId={id}
                key={id}
                prompt={prompt}
                updatedAt={updatedAt}
                createdAt={createdAt}
                journalEntries={journalEntries ?? []}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AppLayout>
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

const NewJournalEntry = () => {
  const [isOpened, setIsOpened] = React.useState(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const mutation = trpc.journal.addJournalEntry.useMutation();
  const generatePromptMutation = trpc.journal.generatePrompt.useMutation();
  const [journalEntries, setJournalEntries] = React.useState<string[]>([]);

  const form = useForm<JournalEntry>({
    resolver: zodResolver(journalEntrySchema),
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

  const onSubmit = ({ entry }: JournalEntry) => {
    if (mutation.isPending) return;
    if (generatePromptMutation.status !== 'success') return;
    setJournalEntries((prev) => [...prev, entry]);
    mutation.mutate(
      {
        entry,
        promptId: generatePromptMutation.data.id,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
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
          className="z-50 flex h-full min-h-32 flex-col items-center justify-center gap-3 rounded-3xl border border-gray-200 bg-gray-50 p-4 pt-2 text-left backdrop-blur-md duration-200 hover:border-orange-200 hover:bg-orange-50"
        >
          <div className="flex w-full items-center justify-center">
            <Plus className="text-orange-300" weight="light" size={40} />
          </div>
        </motion.div>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Content className="fixed inset-x-0 top-32 z-50 mx-auto flex max-h-[96%] min-h-[70dvh] w-full max-w-[450px] flex-col overflow-hidden rounded-[36px] border border-orange-100 bg-white">
          <div className="relative flex flex-1 flex-col gap-4 pt-4">
            <div className="sr-only">
              <Drawer.Title>Journal Entry</Drawer.Title>
              <Drawer.Description>Journal Entry</Drawer.Description>
            </div>
            <Drawer.Handle className="absolute top-0 mx-auto h-1.5 w-12 flex-shrink-0 rounded-full bg-border" />
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
                    <ChatBubble isSender={false} className="px-8">
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
                    <ChatBubble isSender={false}>
                      <span className="text-sm text-gray-600">{generatePromptMutation.data?.prompt}</span>
                    </ChatBubble>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col">
                <AnimatePresence>
                  {journalEntries.map((entry, index) => (
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
                          readOnly={mutation.isPending}
                          className="w-full grow resize-none columns-1 overflow-hidden rounded-3xl border border-orange-100 bg-orange-50 bg-opacity-20 p-2 text-sm text-gray-800 outline-none duration-200 placeholder:text-xs placeholder:text-gray-600 hover:border-orange-500 focus:border-orange-500"
                          placeholder="What's on your mind?"
                        />
                      );
                    }}
                  />
                  <button type="submit" disabled={mutation.isPending} className="text-orange-500 duration-200 hover:text-orange-400">
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
  updatedAt: string | null;
  journalEntries: z.infer<typeof JournalEntrySchema>[];
}

const JournalEntries: React.FC<JournalEntryProps> = ({ prompt, createdAt, promptId, updatedAt, journalEntries }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const newJournalEntryMutation = trpc.journal.addJournalEntry.useMutation();
  const updateJournalEntryMutation = trpc.journal.updateJournalEntry.useMutation();
  const deleteJournalEntryMutation = trpc.journal.deleteJournalEntry.useMutation();

  const form = useForm<JournalEntry>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      entry: '',
    },
  });

  React.useEffect(() => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  }, [form.watch('entry')]);

  const onSubmit = (data: JournalEntry) => {
    if (newJournalEntryMutation.isPending) return;
    newJournalEntryMutation.mutate(
      {
        promptId,
        entry: data.entry,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

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
          whileHover={{ scale: 1.03 }}
          className="z-50 flex min-h-32 flex-col items-start justify-center gap-3 rounded-3xl border border-gray-200 bg-gray-50 p-4 pt-2 text-left backdrop-blur-md duration-200 hover:border-orange-200 hover:bg-orange-50"
        >
          <span className="text-pretty text-xs text-gray-500">{truncateText(prompt, 140)}</span>

          <div className="mt-auto flex w-full items-center gap-1 text-gray-500">
            <CheckCircle size={20} weight="light" />
            <span className="rounded-full text-xs capitalize">
              {updatedAt ? 'Updated' : 'Created'} {formatRelative(new Date(updatedAt ?? createdAt), new Date())}
            </span>
          </div>
        </motion.div>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Content className="fixed inset-x-0 top-32 z-50 mx-auto flex max-h-[96%] min-h-[70dvh] w-full max-w-[450px] flex-col overflow-hidden rounded-[36px] border border-orange-100 bg-white">
          <div className="relative flex flex-1 flex-col gap-4 pt-4">
            <div className="sr-only">
              <Drawer.Title>Journal Entry</Drawer.Title>
              <Drawer.Description>Journal Entry</Drawer.Description>
            </div>
            <Drawer.Handle className="absolute top-0 mx-auto h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />
            <motion.div layout className="no-scrollbar max-h-full grow basis-0 overflow-y-auto scroll-smooth px-4">
              <div className="flex flex-col">
                <ChatBubble isSender={false} className="px-8">
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
        <Drawer.Overlay className="fixed inset-0 z-20 mx-auto bg-orange-900 bg-opacity-20 p-0 backdrop-blur" />
      </Drawer.Portal>
    </Drawer.Root>
  );
};

function truncateText(text: string, limit: number) {
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}
