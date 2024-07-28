import React from 'react';
import { Switch } from '@/components/switch';
import { AppLayout } from '@/components/app-layout';
import { CheckCircle, Circle } from '@phosphor-icons/react';
import { Label, RadioGroup, Radio } from 'react-aria-components';
import { z } from 'zod';
import { RouterOutputs, trpc } from '@/lib/trpc';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@/components/spinner';
import { toast } from 'sonner';
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
    description:
      'Balanced, objective prompts for self-directed exploration. Suitable for those seeking a more open-ended journaling experience',
  },
  {
    title: 'Nurturing',
    description:
      'Gentle, supportive prompts encouraging self-compassion. Ideal for those new to shadow work or dealing with sensitive issues',
  },
  {
    title: 'Challenging',
    description:
      'Direct, thought-provoking prompts that push comfort zones. Suitable for those seeking rapid growth (direct thought-provoking prompts that push users out of their comfort zone)',
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
  const user = trpc.user.details.useQuery().data;
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
    <AppLayout>
      <form className="flex grow flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex h-full w-full flex-col gap-6 rounded-3xl border border-neutral-200 bg-orange-50 bg-opacity-5 p-4 backdrop-blur-sm">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm">
              First Name
            </label>
            <input
              type="text"
              id="name"
              {...form.register('name')}
              className="h-8 grow rounded-lg border border-orange-100 bg-orange-50 bg-opacity-20 px-2 py-1 text-xs placeholder:text-neutral-500 focus:border-orange-200 focus:bg-orange-50"
            />
          </div>

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
                        className="cursor-pointer rounded-lg border border-orange-100 bg-orange-50 bg-opacity-20 p-2 py-1 transition-colors duration-200 hover:bg-orange-50 hover:bg-opacity-20 data-[selected]:border-orange-400 data-[selected]:bg-orange-50 data-[selected]:text-neutral-700"
                        key={item}
                        value={item.toLowerCase()}
                      >
                        {({ isSelected }) => (
                          <div className="flex items-center gap-2">
                            {isSelected ? <CheckCircle /> : <Circle />}

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
                        className="cursor-pointer rounded-lg border border-orange-100 bg-orange-50 bg-opacity-20 p-2 py-1 transition-colors duration-200 hover:bg-orange-50 hover:bg-opacity-20 data-[selected]:border-orange-400 data-[selected]:bg-orange-100 data-[selected]:text-neutral-700"
                      >
                        {({ isSelected }) => (
                          <div className="flex items-center gap-2">
                            {isSelected ? <CheckCircle /> : <Circle />}
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
                        className="cursor-pointer rounded-lg border border-orange-100 bg-orange-50 bg-opacity-20 p-3 transition-colors duration-200 hover:bg-orange-50 hover:bg-opacity-20 data-[selected]:border-orange-400 data-[selected]:bg-orange-50 data-[selected]:text-neutral-700"
                      >
                        {({ isSelected }) => (
                          <React.Fragment>
                            <div className="flex flex-col gap-1">
                              <div className="shrink-0">{isSelected ? <CheckCircle /> : <Circle />}</div>
                              <h3 className="text-xs">{goal.title}</h3>
                            </div>
                            <p className="text-[10px] text-neutral-600">{goal.description}</p>
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
                        className="flex cursor-pointer flex-col gap-2 rounded-lg border border-orange-100 bg-orange-50 bg-opacity-20 p-2 transition-colors duration-200 hover:bg-orange-50 hover:bg-opacity-20 data-[selected]:border-orange-400 data-[selected]:bg-orange-50 data-[selected]:text-neutral-700"
                      >
                        {({ isSelected }) => (
                          <React.Fragment>
                            <div className="flex items-center gap-2 text-neutral-900">
                              <div className="shrink-0">{isSelected ? <CheckCircle /> : <Circle />}</div>
                              <h3 className="text-xs">{tone.title}</h3>
                            </div>
                            <p className="text-[10px] text-neutral-600">{tone.description}</p>
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
            name="enableEmailNotifications"
            render={({ field }) => {
              const id = React.useId();
              return (
                <div className="flex items-center justify-between gap-2 rounded-xl border border-orange-100 bg-orange-50 bg-opacity-20 p-2 py-2">
                  <label htmlFor={id} className="text-sm">
                    Enable Email Notifications
                  </label>

                  <Switch id={id} checked={field.value} onCheckedChange={field.onChange} />
                </div>
              );
            }}
          />

          <div className="flex items-center justify-between gap-4">
            <button className="mr-auto flex h-8 w-[100px] items-center justify-center rounded-lg border border-neutral-300 bg-neutral-200 py-1 text-sm font-medium text-neutral-700 duration-200">
              <span>Logout</span>
            </button>

            <button className="ml-auto flex h-8 w-[120px] items-center justify-center rounded-lg bg-[#FF4800] bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm font-medium text-neutral-50 duration-200">
              <span>{mutation.isPending ? <Spinner /> : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            alert('Coming soon');
          }}
          className="text-center text-xs text-red-600"
        >
          Delete Account
        </button>
      </form>
    </AppLayout>
  );
};
