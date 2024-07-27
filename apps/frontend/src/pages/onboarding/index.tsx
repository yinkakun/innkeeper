import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from '@phosphor-icons/react';
import { Layout } from '@/components/layout';
import { Stepper, useStepper } from '@/components/stepper';
import { Label, RadioGroup, Radio } from 'react-aria-components';
import { Link } from '@tanstack/react-router';

export const Onboarding = () => {
  return (
    <Layout className="flex grow flex-row items-center justify-center">
      <div>
        <Stepper>
          <FirstName />
          <TimeSettings />
          <PreferredTone />
          <PrimaryGoal />
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
  const { activeStepIndex, totalSteps, nextStep, prevStep } = useStepper();
  return (
    <div className="relative flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-neutral-200 border-opacity-40 bg-neutral-50 p-8 pt-16 text-left">
      <StepProgressBar totalSteps={totalSteps} currentStep={activeStepIndex + 1} />

      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-medium text-neutral-800">What's your name?</h2>
        <p className="text-xs text-neutral-600">Tell us about yourself so we can personalize your experience. </p>
      </div>

      <div className="flex w-full flex-col gap-4">
        <input
          type="text"
          id="name"
          placeholder="Name"
          className="h-8 w-full grow rounded-lg border border-neutral-300 border-opacity-50 bg-white px-2 py-1 text-xs placeholder:text-neutral-500"
        />

        <div className="flex gap-4">
          <button
            onClick={nextStep}
            className="w-full rounded-lg bg-[#FF4800] bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm font-medium text-neutral-50 duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const FREQUENCY = ['Daily', 'Weekly'];
const TIMES = ['Morning', 'Afternoon', 'Evening', 'Night'];
const TimeSettings = () => {
  const { activeStepIndex, totalSteps, nextStep, prevStep } = useStepper();
  const [selectedFrequency, setSelectedFrequency] = React.useState<string | null>(null);

  return (
    <div className="relative flex w-full max-w-md shrink-0 flex-col items-start gap-6 rounded-3xl border border-neutral-200 border-opacity-40 bg-neutral-50 p-8 pt-16 text-left">
      <StepProgressBar totalSteps={totalSteps} currentStep={activeStepIndex + 1} />

      <RadioGroup
        className="flex w-full max-w-none shrink-0 flex-col gap-2"
        onChange={(value) => {
          setSelectedFrequency(value);
        }}
      >
        <Label className="w-full font-medium">How often would you like to journal?</Label>
        <div className="flex w-full shrink-0 flex-col gap-4">
          {FREQUENCY.map((item) => (
            <Radio
              className="cursor-pointer rounded-lg border border-orange-200 p-2 transition-colors duration-200 hover:bg-orange-100 hover:bg-opacity-50 data-[selected]:border-orange-400 data-[selected]:bg-orange-200 data-[selected]:text-stone-700"
              value={item}
              key={item}
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

      {selectedFrequency && (
        <RadioGroup className="flex flex-col gap-2">
          <Label className="text-base font-medium">What time of the day do you prefer to journal?</Label>

          <div className="grid w-full grid-cols-2 gap-4">
            {TIMES.map((item) => (
              <Radio
                className="cursor-pointer rounded-lg border border-orange-200 p-2 transition-colors duration-200 hover:bg-orange-100 hover:bg-opacity-50 data-[selected]:border-orange-400 data-[selected]:bg-orange-100 data-[selected]:text-stone-700"
                value={item}
                key={item}
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
      )}

      <button
        onClick={nextStep}
        className="w-full rounded-lg bg-[#FF4800] bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm font-medium text-neutral-50 duration-200"
      >
        Continue
      </button>
    </div>
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
  const { activeStepIndex, totalSteps, nextStep } = useStepper();
  return (
    <div>
      <div className="relative flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-neutral-200 border-opacity-40 bg-neutral-50 p-8 pt-16 text-left">
        <StepProgressBar totalSteps={totalSteps} currentStep={activeStepIndex + 1} />

        <RadioGroup className="flex flex-col gap-4">
          <Label className="flex flex-col">
            <span className="text-sm font-medium text-stone-800">What is your primary goal for journaling?</span>
            <span className="text-xs">You can change this later in your settings</span>
          </Label>

          <div className="flex w-full flex-col gap-2">
            {GOALS.map((goal) => (
              <Radio
                key={goal.title}
                value={goal.title}
                className="cursor-pointer rounded-lg border border-orange-200 p-2 transition-colors duration-200 hover:bg-orange-100 hover:bg-opacity-50 data-[selected]:border-orange-400 data-[selected]:bg-orange-100 data-[selected]:text-stone-700"
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
          </div>
        </RadioGroup>

        <div className="flex w-full flex-col gap-4">
          <button
            onClick={nextStep}
            className="hover-bg-orange-600 w-full rounded-lg bg-[#FF4800] bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm font-medium text-neutral-50 duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
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
  //  submit form here and redirect to journal

  const { activeStepIndex, totalSteps, nextStep, prevStep } = useStepper();
  return (
    <div className="relative flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-neutral-200 border-opacity-40 bg-neutral-50 p-8 pt-16 text-left">
      <StepProgressBar totalSteps={totalSteps} currentStep={activeStepIndex + 1} />

      <RadioGroup className="flex flex-col gap-4">
        <Label className="flex flex-col">
          <span className="text-sm font-medium text-stone-800">What tone of prompts would you prefer for your journaling experience?</span>
          <span className="text-xs">You can change this later in your settings</span>
        </Label>

        <div className="flex w-full flex-col gap-2">
          {TONES.map((tone) => (
            <Radio
              value={tone.title}
              key={tone.title}
              className="cursor-pointer rounded-lg border border-orange-200 p-2 transition-colors duration-200 hover:bg-orange-100 hover:bg-opacity-50 data-[selected]:border-orange-400 data-[selected]:bg-orange-100 data-[selected]:text-stone-700"
            >
              {({ isSelected }) => (
                <React.Fragment>
                  <div className="flex items-center gap-2 text-stone-900">
                    <div className="shrink-0">{isSelected ? <CheckCircle /> : <Circle />}</div>
                    <h3 className="text-sm">{tone.title}</h3>
                  </div>
                  <p className="text-xs text-neutral-600">{tone.description}</p>
                </React.Fragment>
              )}
            </Radio>
          ))}
        </div>
      </RadioGroup>

      <button
        onClick={nextStep}
        className="w-full rounded-lg bg-[#FF4800] bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm font-medium text-neutral-50 duration-200"
      >
        Continue
      </button>
    </div>
  );
};

const Done = () => {
  // link to journal
  return (
    <div className="relative flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-neutral-300 border-opacity-40 bg-neutral-50 p-6 pt-4 text-center">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-medium text-neutral-800">Welcome to Journal</h2>
        <p className="text-xs text-neutral-600">You're all set up and ready to start journaling!</p>
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
