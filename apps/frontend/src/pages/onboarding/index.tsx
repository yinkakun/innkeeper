import React from 'react';
import { cn } from '@/lib/utils';
import { trpc } from '@/lib/trpc';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from '@phosphor-icons/react';
import { Layout } from '@/components/layout';
import { Stepper, useStepper } from '@/components/stepper';
import { Label, RadioGroup, Radio } from 'react-aria-components';
import { Link } from '@tanstack/react-router';
import { z } from 'zod';
import { atom, useAtom } from 'jotai';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@/components/spinner';
import { ZodError } from 'zod';

const firstNameSchema = z.object({
  name: z
    .string({
      required_error: 'Please enter your first name',
      invalid_type_error: 'Please enter a valid first name',
    })
    .min(1, 'First name is required')
    .max(100, 'First name must be 100 characters or less'),
});

const timeSettingsSchema = z.object({
  promptFrequency: z.enum(['daily', 'weekly'], {
    required_error: 'Please select a frequency',
  }),
  promptPeriod: z.enum(['morning', 'afternoon', 'evening', 'night'], {
    required_error: 'Please select a preferred time',
  }),
});

const primaryGoalSchema = z.object({
  primaryGoal: z.enum(['Self-Discovery and Growth', 'Emotional Wellness and Resilience', 'Relationships and Behavioral Change'], {
    required_error: 'Please select a primary goal',
  }),
});

const preferredToneSchema = z.object({
  promptTone: z.enum(['neutral', 'nurturing', 'challenging'], {
    required_error: 'Please select a preferred tone',
  }),
});

const onboardingSchema = z.object({
  ...firstNameSchema.shape,
  ...timeSettingsSchema.shape,
  ...primaryGoalSchema.shape,
  ...preferredToneSchema.shape,
});

type OnboardingSchemaType = z.infer<typeof onboardingSchema>;

const formDataAtom = atom<Partial<OnboardingSchemaType>>({});

const useOnboardingData = () => {
  const [formData, setFormData] = useAtom(formDataAtom);
  const updateFormData = (newData: Partial<OnboardingSchemaType>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    return { ...formData, ...newData };
  };

  return { formData, updateFormData };
};

export const Onboarding = () => {
  return (
    <Layout className="flex grow flex-row items-center justify-center">
      <div>
        <Stepper>
          <FirstName />
          <TimeSettings />
          <PrimaryGoal />
          <PreferredTone />
          <Done />
        </Stepper>
      </div>
    </Layout>
  );
};

interface StepProgressBarProps {
  totalSteps: number;
  currentStep: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ totalSteps, currentStep }) => {
  const isPrevStep = (index: number) => index < currentStep - 1;
  const isActiveStep = (index: number) => index === currentStep - 1;

  return (
    <div
      style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }}
      className="absolute inset-x-8 top-8 grid h-1.5 gap-2 rounded-full bg-transparent"
    >
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={cn('h-full w-full rounded-full backdrop-blur-sm', {
            'bg-white bg-opacity-95': !isPrevStep(index),
            'bg-[#FF4800]': isPrevStep(index),
          })}
        >
          {isActiveStep(index) && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.2 }}
              className="h-full w-full rounded-full bg-[#FF4800]"
            />
          )}
        </div>
      ))}
    </div>
  );
};

const FirstName = () => {
  const { formData, updateFormData } = useOnboardingData();
  const { activeStepIndex, totalSteps, nextStep } = useStepper();

  const form = useForm<z.infer<typeof firstNameSchema>>({
    resolver: zodResolver(firstNameSchema),
    defaultValues: { name: formData.name || '' },
  });

  const onSubmit = (data: z.infer<typeof firstNameSchema>) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <div className="relative flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-neutral-200 border-opacity-40 bg-neutral-50 p-8 pt-16 text-left">
      <StepProgressBar totalSteps={totalSteps} currentStep={activeStepIndex + 1} />

      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-medium text-neutral-800">What should we call you?</h2>
        <p className="text-xs text-neutral-600">Your preferred name will be used to personalize your journaling experience</p>
      </div>

      <form className="flex w-full flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <input
            type="text"
            id="name"
            {...form.register('name')}
            placeholder="Preferred Name"
            className="h-8 w-full grow rounded-lg border border-neutral-300 border-opacity-50 bg-white px-2 py-1 text-xs placeholder:text-neutral-500"
          />
          <p
            className={cn('h-3 text-xs text-red-500', {
              'opacity-0': !form.formState.errors?.name,
              'opacity-100': Boolean(form.formState.errors?.name),
            })}
          >
            {form.formState.errors?.name?.message ?? ' '}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="w-full rounded-lg bg-[#FF4800] bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm font-medium text-neutral-50 duration-200"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

const TimeSettings = () => {
  const { formData, updateFormData } = useOnboardingData();
  const { activeStepIndex, totalSteps, nextStep } = useStepper();

  const form = useForm<z.infer<typeof timeSettingsSchema>>({
    resolver: zodResolver(timeSettingsSchema),
    defaultValues: {
      promptFrequency: formData.promptFrequency,
      promptPeriod: formData.promptPeriod,
    },
  });

  const onSubmit = (data: z.infer<typeof timeSettingsSchema>) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="relative flex w-full max-w-md shrink-0 flex-col items-start gap-6 rounded-3xl border border-neutral-200 border-opacity-40 bg-neutral-50 p-8 pt-16 text-left"
    >
      <StepProgressBar totalSteps={totalSteps} currentStep={activeStepIndex + 1} />

      <Controller
        name="promptFrequency"
        control={form.control}
        render={({ field }) => (
          <RadioGroup {...field} className="flex w-full max-w-none shrink-0 flex-col gap-2">
            <Label className="w-full font-medium">How often would you like to journal?</Label>
            {['Daily', 'Weekly'].map((item) => (
              <Radio
                className="cursor-pointer rounded-lg border border-orange-200 p-2 transition-colors duration-200 hover:bg-orange-100 hover:bg-opacity-50 data-[selected]:border-orange-400 data-[selected]:bg-orange-200 data-[selected]:text-stone-700"
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

            <p
              className={cn('h-3 text-xs text-red-500', {
                'opacity-0': !form.formState.errors?.promptFrequency,
                'opacity-100': Boolean(form.formState.errors?.promptFrequency),
              })}
            >
              {form.formState.errors?.promptFrequency?.message ?? ' '}
            </p>
          </RadioGroup>
        )}
      />

      <Controller
        name="promptPeriod"
        control={form.control}
        render={({ field }) => (
          <RadioGroup {...field} className="flex w-full max-w-none shrink-0 flex-col gap-2">
            <Label className="w-full font-medium">What time of the day do you prefer to journal?</Label>
            {['Morning', 'Afternoon', 'Evening', 'Night'].map((item) => (
              <Radio
                className="cursor-pointer rounded-lg border border-orange-200 p-2 transition-colors duration-200 hover:bg-orange-100 hover:bg-opacity-50 data-[selected]:border-orange-400 data-[selected]:bg-orange-200 data-[selected]:text-stone-700"
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

            <p
              className={cn('h-3 text-xs text-red-500', {
                'opacity-0': !form.formState.errors?.promptPeriod,
                'opacity-100': Boolean(form.formState.errors?.promptPeriod),
              })}
            >
              {form.formState.errors?.promptPeriod?.message ?? ' '}
            </p>
          </RadioGroup>
        )}
      />

      <button
        type="submit"
        className="w-full rounded-lg bg-[#FF4800] bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm font-medium text-neutral-50 duration-200"
      >
        Continue
      </button>
    </form>
  );
};

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

const PrimaryGoal = () => {
  const { formData, updateFormData } = useOnboardingData();
  const form = useForm<z.infer<typeof primaryGoalSchema>>({
    resolver: zodResolver(primaryGoalSchema),
    defaultValues: { primaryGoal: formData.primaryGoal },
  });

  const onSubmit = (data: z.infer<typeof primaryGoalSchema>) => {
    updateFormData(data);
    nextStep();
  };

  const { activeStepIndex, totalSteps, nextStep } = useStepper();
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="relative flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-neutral-200 border-opacity-40 bg-neutral-50 p-8 pt-16 text-left">
        <StepProgressBar totalSteps={totalSteps} currentStep={activeStepIndex + 1} />

        {
          <Controller
            name="primaryGoal"
            control={form.control}
            render={({ field }) => (
              <RadioGroup {...field} className="flex w-full max-w-none shrink-0 flex-col gap-2">
                <div>
                  <Label className="w-full font-medium">What is your primary goal for journaling?</Label>
                </div>
                {GOALS.map((goal) => (
                  <Radio
                    className="cursor-pointer rounded-lg border border-orange-200 p-2 transition-colors duration-200 hover:bg-orange-100 hover:bg-opacity-50 data-[selected]:border-orange-400 data-[selected]:bg-orange-200 data-[selected]:text-stone-700"
                    key={goal.title}
                    value={goal.title}
                  >
                    {({ isSelected }) => (
                      <React.Fragment>
                        <div className="flex items-center gap-2 text-stone-900">
                          <div className="shrink-0">{isSelected ? <CheckCircle /> : <Circle />}</div>
                          <h3 className="text-sm">{goal.title}</h3>
                        </div>
                        <p className="text-xs text-neutral-600">{goal.description}</p>
                      </React.Fragment>
                    )}
                  </Radio>
                ))}

                <p
                  className={cn('h-3 text-xs text-red-500', {
                    'opacity-0': !form.formState.errors?.primaryGoal,
                    'opacity-100': Boolean(form.formState.errors?.primaryGoal),
                  })}
                >
                  {form.formState.errors?.primaryGoal?.message ?? ' '}
                </p>
              </RadioGroup>
            )}
          />
        }

        <div className="flex w-full flex-col gap-4">
          <button
            type="submit"
            className="hover-bg-orange-600 w-full rounded-lg bg-[#FF4800] bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm font-medium text-neutral-50 duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    </form>
  );
};

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

const PreferredTone = () => {
  const mutation = trpc.user.onboard.useMutation();
  const { activeStepIndex, totalSteps, nextStep } = useStepper();
  const { formData, updateFormData } = useOnboardingData();
  const form = useForm<z.infer<typeof preferredToneSchema>>({
    resolver: zodResolver(preferredToneSchema),
    defaultValues: { promptTone: formData.promptTone },
  });

  const onSubmit = async (data: z.infer<typeof preferredToneSchema>) => {
    const allFormData = updateFormData(data);
    const { name, primaryGoal, promptFrequency, promptPeriod, promptTone } = onboardingSchema.parse(allFormData);
    const userTimezoneUtc = Intl.DateTimeFormat().resolvedOptions().timeZone;
    mutation.mutate(
      {
        name,
        promptTone,
        primaryGoal,
        promptPeriod,
        promptFrequency,
        timezone: userTimezoneUtc,
      },
      {
        onSuccess: () => {
          nextStep();
        },
      },
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="relative flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-neutral-200 border-opacity-40 bg-neutral-50 p-8 pt-16 text-left"
    >
      <StepProgressBar totalSteps={totalSteps} currentStep={activeStepIndex + 1} />

      <Controller
        name="promptTone"
        control={form.control}
        render={({ field }) => (
          <RadioGroup {...field} className="flex w-full max-w-none shrink-0 flex-col gap-2">
            <Label className="w-full font-medium">What tone of prompts would you prefer for your journaling experience?</Label>
            {TONES.map((tone) => (
              <Radio
                className="cursor-pointer rounded-lg border border-orange-200 p-2 transition-colors duration-200 hover:bg-orange-100 hover:bg-opacity-50 data-[selected]:border-orange-400 data-[selected]:bg-orange-200 data-[selected]:text-stone-700"
                key={tone.title}
                value={tone.title.toLowerCase()}
              >
                {({ isSelected }) => (
                  <React.Fragment>
                    <div className="flex items-center gap-2">
                      <div className="shrink-0">{isSelected ? <CheckCircle /> : <Circle />}</div>
                      <h3 className="text-sm">{tone.title}</h3>
                    </div>
                    <p className="text-xs text-neutral-600">{tone.description}</p>
                  </React.Fragment>
                )}
              </Radio>
            ))}

            <p
              className={cn('h-3 text-xs text-red-500', {
                'opacity-0': !form.formState.errors?.promptTone,
                'opacity-100': Boolean(form.formState.errors?.promptTone),
              })}
            >
              {form.formState.errors?.promptTone?.message ?? ' '}
            </p>
          </RadioGroup>
        )}
      />

      <button
        type="submit"
        className="w-full rounded-lg bg-[#FF4800] bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm font-medium text-neutral-50 duration-200"
      >
        {mutation.isPending ? <Spinner /> : 'Continue'}
      </button>
    </form>
  );
};

const Done = () => {
  return (
    <div className="relative flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-neutral-300 border-opacity-40 bg-neutral-50 p-6 pt-4 text-center">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-medium text-neutral-800">Welcome to 💌 Innkeeper</h2>
        <p className="text-xs text-neutral-600">You're all set up and your shadow work journey begins now! </p>
      </div>

      <CheckCircle className="h-24 w-24 text-[#FF4800]" weight="thin" />

      <div className="flex w-full flex-col gap-4">
        <Link
          to="/journal"
          className="w-full rounded-lg bg-[#FF4800] bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm font-medium text-neutral-50 duration-200"
        >
          Start Journaling
        </Link>
      </div>
    </div>
  );
};
