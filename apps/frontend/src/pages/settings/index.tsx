import { z } from 'zod';
import React from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { trpc } from '@/lib/trpc';
import { Switch } from '@/components/switch';
import { Spinner } from '@/components/spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { Circle, RadioButton } from '@phosphor-icons/react';
import { Label, RadioGroup, Radio } from 'react-aria-components';
import { Dialog, DialogTrigger, DialogClose, DialogContent } from '@/components/dialog';

const formSchema = z.object({
  name: z.string().min(1, 'First name is required').max(100, 'First name must be 100 characters or less'),
  promptFrequency: z.enum(['daily', 'weekly'], {
    required_error: 'Please select a prompt frequency',
  }),
  promptPeriod: z
    .enum(['morning', 'afternoon', 'evening', 'night'], {
      required_error: 'Please select a preferred prompt time',
    })
    .default('morning'),
  primaryGoal: z
    .enum(['Self-Discovery and Growth', 'Emotional Wellness and Resilience', 'Relationships and Behavioral Change'], {
      required_error: 'Please select a primary goal',
    })
    .default('Self-Discovery and Growth'),
  promptTone: z
    .enum(['neutral', 'nurturing', 'challenging'], {
      required_error: 'Please select a preferred prompt tone',
    })
    .default('neutral'),
  enableEmailNotifications: z.boolean().default(false),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TONES = [
  {
    title: 'Neutral',
    description: 'Balanced, objective prompts for self-directed exploration.',
  },
  {
    title: 'Nurturing',
    description: 'Gentle, supportive prompts encouraging self-compassion.',
  },
  {
    title: 'Challenging',
    description: 'Direct, thought-provoking prompts that push comfort zones.',
  },
];
const GOALS = [
  {
    title: 'Self-Discovery and Growth',
    description: 'Explore your identity, beliefs, and purpose to develop a more authentic self and unlock your potential',
  },
  {
    title: 'Emotional Wellness and Resilience',
    description: 'Work through past experiences, build emotional strength, and manage stress by understanding root causes',
  },
  {
    title: 'Relationships and Behavioral Change',
    description: 'Improve connections, transform habits, and modify unwanted behaviors by understanding their origins',
  },
];

export const Settings = () => {
  const [user] = trpc.user.details.useSuspenseQuery();
  const mutation = trpc.user.update.useMutation();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? undefined,
      promptFrequency: user?.promptFrequency ?? undefined,
      promptPeriod: user?.promptPeriod ?? undefined,
      primaryGoal: user?.primaryGoal ?? undefined,
      promptTone: user?.promptTone ?? undefined,
      enableEmailNotifications: user?.isPaused === false ? true : false,
    },
  });

  const onSubmit = (data: FormSchemaType) => {
    if (mutation.isPending) return;
    mutation.mutate(
      { ...data, isPaused: !data.enableEmailNotifications },
      {
        onSuccess: () => {
          toast.success('Settings saved');
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <form className="flex grow flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex h-full w-full flex-col gap-6 rounded-3xl border border-border bg-white p-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm">
              First Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your first name"
              {...form.register('name')}
              className="h-8 grow rounded-lg border border-orange-400 bg-orange-50 bg-opacity-50 px-2 py-1 text-xs outline-none duration-200 placeholder:text-gray-500 placeholder-shown:border-border placeholder-shown:bg-gray-50 hover:border-orange-300 hover:bg-orange-50 focus:border-orange-300 focus:bg-orange-50"
            />
          </div>
        </div>

        <div className="flex h-full w-full flex-col gap-6 rounded-3xl border border-border bg-white p-4">
          <Controller
            name="promptFrequency"
            control={form.control}
            render={({ field }) => {
              return (
                <RadioGroup className="flex w-full max-w-none shrink-0 flex-col gap-2" {...field}>
                  <Label className="text-sm">Prompt Frequency</Label>
                  <div className="grid w-full shrink-0 grid-cols-2 gap-4">
                    {['Daily', 'Weekly'].map((item) => (
                      <Radio
                        className="group cursor-pointer rounded-lg border border-border bg-gray-50 bg-opacity-50 p-2 py-1 text-sm text-gray-700 transition-colors duration-200 hover:border-orange-200 hover:bg-orange-50 hover:bg-opacity-50 data-[selected]:border-orange-300 data-[selected]:bg-orange-50 data-[selected]:bg-opacity-50 hover:data-[selected]:bg-opacity-100"
                        key={item}
                        value={item.toLowerCase()}
                      >
                        {({ isSelected }) => (
                          <div className="flex items-center gap-2 text-gray-800">
                            <div
                              className={cn('text-gray-800 duration-200 group-hover:text-orange-500', {
                                'text-orange-500': isSelected,
                              })}
                            >
                              {isSelected ? <RadioButton weight="fill" /> : <Circle />}
                            </div>

                            <div>{item}</div>
                          </div>
                        )}
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>
              );
            }}
          />

          <Controller
            name="promptPeriod"
            control={form.control}
            render={({ field }) => {
              return (
                <RadioGroup className="flex flex-col gap-2" {...field}>
                  <Label className="text-sm">Preferred Prompt Time</Label>
                  <div className="grid w-full grid-cols-4 flex-col gap-2">
                    {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => (
                      <Radio
                        key={time}
                        value={time.toLowerCase()}
                        className="group cursor-pointer rounded-lg border border-gray-200 bg-gray-50 bg-opacity-50 p-2 py-1 text-sm text-gray-700 transition-colors duration-200 hover:border-orange-200 hover:bg-orange-50 hover:bg-opacity-100 data-[selected]:border-orange-400 data-[selected]:bg-orange-50 data-[selected]:bg-opacity-50 hover:data-[selected]:bg-opacity-100"
                      >
                        {({ isSelected }) => (
                          <div className="flex items-center gap-2">
                            <div
                              className={cn('text-gray-800 duration-200 group-hover:text-orange-500', {
                                'text-orange-500': isSelected,
                              })}
                            >
                              {isSelected ? <RadioButton weight="fill" /> : <Circle />}
                            </div>

                            <div>{time}</div>
                          </div>
                        )}
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>
              );
            }}
          />

          <Controller
            control={form.control}
            name="enableEmailNotifications"
            render={({ field }) => {
              const id = React.useId();
              return (
                <div
                  className={cn(
                    'flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 bg-opacity-50 p-2 py-1.5 duration-200 hover:border-orange-300 hover:bg-orange-50',
                    {
                      'border-orange-300 bg-orange-50 bg-opacity-50': field.value,
                    },
                  )}
                >
                  <label htmlFor={id} className="grow text-sm">
                    Enable Email Notifications
                  </label>

                  <Switch id={id} checked={field.value} onCheckedChange={field.onChange} />
                </div>
              );
            }}
          />
        </div>

        <div className="flex h-full w-full flex-col gap-6 rounded-3xl border border-border bg-white p-4">
          <Controller
            name="primaryGoal"
            control={form.control}
            render={({ field }) => {
              return (
                <RadioGroup className="flex flex-col gap-2" {...field}>
                  <Label className="text-sm capitalize">Primary Goal for journaling</Label>
                  <div className="grid w-full grid-cols-3 flex-col gap-2">
                    {GOALS.map((goal) => (
                      <Radio
                        key={goal.title}
                        value={goal.title}
                        className="group flex cursor-pointer flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 bg-opacity-50 p-3 text-gray-700 transition-colors duration-200 hover:border-orange-200 hover:bg-orange-50 data-[selected]:border-orange-400 data-[selected]:bg-orange-50 data-[selected]:bg-opacity-50 hover:data-[selected]:bg-opacity-100"
                      >
                        {({ isSelected }) => (
                          <React.Fragment>
                            <div className="flex grow flex-col gap-2">
                              <div
                                className={cn('text-gray-800 duration-200 group-hover:text-orange-500', {
                                  'text-orange-500': isSelected,
                                })}
                              >
                                {isSelected ? <RadioButton weight="fill" /> : <Circle />}
                              </div>
                              <h3 className="text-sm">{goal.title}</h3>
                            </div>
                            <p className="mt-auto text-[10px] text-gray-600">{goal.description}</p>
                          </React.Fragment>
                        )}
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>
              );
            }}
          />

          <Controller
            control={form.control}
            name="promptTone"
            render={({ field }) => {
              return (
                <RadioGroup className="flex flex-col gap-2" {...field}>
                  <Label className="text-sm">Preferred Prompt Tone</Label>

                  <div className="grid w-full grid-cols-3 flex-col gap-2">
                    {TONES.map((tone) => (
                      <Radio
                        key={tone.title}
                        value={tone.title.toLowerCase()}
                        className="group flex cursor-pointer flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 bg-opacity-50 p-2 text-gray-700 transition-colors duration-200 hover:border-orange-200 hover:bg-orange-50 hover:bg-opacity-100 data-[selected]:border-orange-400 data-[selected]:bg-orange-50 data-[selected]:bg-opacity-50 hover:data-[selected]:bg-opacity-100"
                      >
                        {({ isSelected }) => (
                          <React.Fragment>
                            <div className="flex items-center gap-2 text-gray-900">
                              <div
                                className={cn('text-gray-800 duration-200 group-hover:text-orange-500', {
                                  'text-orange-500': isSelected,
                                })}
                              >
                                {isSelected ? <RadioButton weight="fill" /> : <Circle />}
                              </div>
                              <h3 className="text-sm">{tone.title}</h3>
                            </div>
                            <p className="text-[10px] text-gray-600">{tone.description}</p>
                          </React.Fragment>
                        )}
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>
              );
            }}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            className="ml-auto flex h-8 w-[150px] items-center justify-center rounded-lg border border-orange-600/30 bg-orange-400 px-6 py-1 text-sm text-gray-50 duration-200"
          >
            <span>{mutation.isPending ? <Spinner /> : 'Save Changes'}</span>
          </button>
        </div>
      </form>
      <div className="divide-y-gray-200 flex flex-col divide-y overflow-hidden rounded-xl border border-border">
        <button type="button" className="group w-full px-6 py-2 text-left text-sm duration-200 hover:bg-gray-50">
          <span>Sign out</span>
        </button>

        <Dialog>
          <DialogTrigger asChild>
            <button type="button" className="w-full p-2 px-4 text-left text-sm text-red-600 duration-200 hover:bg-gray-50">
              Delete Account
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-sm overflow-hidden rounded-3xl border-[0.5px] border-orange-300/50 bg-white bg-opacity-80 p-0 backdrop-blur-md">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <div className="border-b-[0.5px] border-orange-300/50 py-2">
                  <h2 className="text-center text-sm font-medium">Delete Account</h2>
                </div>
                <div className="flex w-full flex-col gap-1 rounded-xl p-2 px-5 text-center text-sm text-gray-800">
                  <span>Are you sure you want to delete your account?</span>
                  <span>This action is irreversible and will permanently delete all your data.</span>
                </div>
              </div>
              <div className="grid w-full grid-cols-2 gap-0 divide-x-[0.5px] divide-orange-300/50 border-t-[0.5px] border-orange-300/50">
                <DialogClose>
                  <button
                    type="button"
                    className="flex h-8 w-full items-center justify-center text-sm text-gray-800 duration-200 hover:bg-orange-50/50"
                  >
                    <span>Cancel</span>
                  </button>
                </DialogClose>

                <button
                  type="button"
                  className="flex h-8 w-full items-center justify-center text-sm text-red-500 duration-200 hover:bg-red-50"
                >
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
