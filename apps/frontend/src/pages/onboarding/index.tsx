import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { Stepper, useStepper } from '@/components/stepper';

export const Onboarding = () => {
  return (
    <Layout className="grid place-content-center">
      <Stepper>
        <EmailStep />
        <NameStep />
      </Stepper>
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

const EmailStep = () => {
  const { activeStepIndex, totalSteps, nextStep } = useStepper();
  return (
    <div>
      <div className="relative flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-neutral-200 border-opacity-40 bg-neutral-50 p-8 pt-16 text-left">
        <StepProgressBar totalSteps={totalSteps} currentStep={activeStepIndex + 1} />

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-medium text-neutral-800">What's your email address?</h2>
          <p className="text-xs text-neutral-600">
            We'll use this to send you updates and important information about your account. You can always change this later.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            className="h-8 w-full grow rounded-lg border border-neutral-300 border-opacity-50 bg-white px-2 py-1 text-xs placeholder:text-neutral-500"
          />

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

const NameStep = () => {
  const { activeStepIndex, totalSteps, nextStep, prevStep } = useStepper();
  return (
    <div>
      <div className="relative flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-neutral-200 border-opacity-40 bg-neutral-50 p-8 pt-16 text-left">
        <StepProgressBar totalSteps={totalSteps} currentStep={activeStepIndex + 1} />

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-medium text-neutral-800">What's your name?</h2>
          <p className="text-xs text-neutral-600">This will be used to personalize your experience.</p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="h-8 w-full grow rounded-lg border border-neutral-300 border-opacity-50 bg-white px-2 py-1 text-xs placeholder:text-neutral-500"
          />

          <div className="flex gap-4">
            <button onClick={prevStep} className="w-1/2 rounded-lg bg-neutral-300 py-1 text-neutral-800">
              Back
            </button>
            <button
              onClick={nextStep}
              className="w-1/2 rounded-lg bg-[#FF4800] bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm font-medium text-neutral-50 duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// <div>
//   <li>button to skip</li>
//   <li>onboarding new user steps</li>
//   <li>Progressive Disclosure: Introduce concepts and features gradually to avoid overwhelming the user.</li>
//   <li>Personalization: Use the collected information to tailor the experience (e.g., personalized prompts based on interests).</li>
//   <li>Engagement: Encourage the user to take action (like writing their first entry) during onboarding.</li>
//   <li>Progress Indicator: Show users how far along they are in the onboarding process.</li>
//   <li>Incorporating a sample journal entry to demonstrate the app's core functionality</li>
//   <li>Gamifying the process with a small reward (like a special badge) for completing onboarding</li>
// </div>;
