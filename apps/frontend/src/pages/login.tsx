import React from 'react';
import { cn } from '@/lib/utils';
import { trpc } from '@/lib/trpc';
import { Layout } from '@/components/layout';
import { Spinner } from '@/components/spinner';
import { OTPInput, SlotProps } from 'input-otp';
import googleLogo from '@/assets/google-logo.svg';
import { Stepper, useStepper } from '@/components/stepper';
import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { atom, useSetAtom, useAtomValue } from 'jotai';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const emailAtom = atom('');
const API_URL = import.meta.env.VITE_API_URL as string;

export const Login = () => {
  return (
    <Layout className="flex items-center justify-center">
      <div>
        <Stepper>
          <RequestOtp />
          <VerifyOtp />
        </Stepper>
      </div>
    </Layout>
  );
};

const requestEmailOtpSchema = z.object({
  email: z.string().email(),
});

type RequestEmailOtp = z.infer<typeof requestEmailOtpSchema>;

const RequestOtp = () => {
  const { nextStep } = useStepper();
  const setEmail = useSetAtom(emailAtom);
  const mutation = trpc.login.requestEmailOtp.useMutation();

  const form = useForm<RequestEmailOtp>({
    resolver: zodResolver(requestEmailOtpSchema),
  });

  const onSubmit = (data: RequestEmailOtp) => {
    if (mutation.isPending) return;
    mutation.mutate(data, {
      onSuccess: () => {
        setEmail(data.email);
        nextStep();
      },
    });
  };

  return (
    <StepWrapper>
      <a
        target="_blank"
        href={`${API_URL}/auth/google`}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-1.5 text-center text-sm font-normal text-neutral-800"
      >
        <img src={googleLogo} alt="" className="max-w-4" />
        <span>Continue with Google</span>
      </a>

      <p>OR</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
        <div className="w-full">
          <input
            formNoValidate
            type="email"
            {...form.register('email')}
            className="h-8 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs placeholder:text-neutral-500 focus-within:bg-orange-100"
            placeholder="Enter email"
          />
          {form.formState.errors.email && <span className="text-xs text-red-500">{form.formState.errors.email.message}</span>}
        </div>
        <button
          type="submit"
          className="flex h-8 w-full items-center justify-center rounded-lg bg-[#FF4800] bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm font-medium text-neutral-50 duration-200"
        >
          {mutation.isPending ? <Spinner /> : 'Send OTP'}
        </button>
      </form>
    </StepWrapper>
  );
};

const verifyEmailOtpSchema = z.object({
  otp: z.string().length(6),
});

type VerifyEmailOtp = z.infer<typeof verifyEmailOtpSchema>;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const email = useAtomValue(emailAtom);
  const verifyOtpMutation = trpc.login.verifyEmailOtp.useMutation();

  const form = useForm<VerifyEmailOtp>({
    resolver: zodResolver(verifyEmailOtpSchema),
  });

  const onSubmit = ({ otp }: VerifyEmailOtp) => {
    if (verifyOtpMutation.isPending) return;
    verifyOtpMutation.mutate(
      { email, otp },
      {
        onSuccess: (data) => {
          if (data.onboarded) {
            navigate({
              to: '/journal',
            });
          }
          if (!data.onboarded) {
            navigate({
              to: '/onboarding',
            });
          }
        },
      },
    );
  };

  return (
    <StepWrapper>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col items-center gap-4">
          <span className="text-xs text-neutral-600">Enter the 6-digit code sent to {email}</span>
          <Controller
            control={form.control}
            name="otp"
            render={({ field }) => (
              <OTPInput
                maxLength={6}
                {...field}
                containerClassName="group flex items-center has-[:disabled]:opacity-30"
                render={({ slots }) => (
                  <React.Fragment>
                    <div className="flex">
                      {slots.map((slot, idx) => (
                        <Slot key={idx} {...slot} />
                      ))}
                    </div>
                  </React.Fragment>
                )}
              />
            )}
          />

          {form.formState.errors.otp && <span className="text-xs text-red-500">{form.formState.errors.otp.message}</span>}

          <button
            type="submit"
            className="flex h-8 w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm text-stone-50 duration-200"
          >
            {verifyOtpMutation.isPending ? <Spinner /> : 'Verify OTP'}
          </button>
        </div>
      </form>
    </StepWrapper>
  );
};

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        'transition-all duration-200',
        'relative h-10 w-10 text-base',
        'flex items-center justify-center',
        'border-y border-r border-border first:rounded-l-md first:border-l last:rounded-r-md',
        'group-focus-within:border-accent-foreground/20 group-hover:border-accent-foreground/20',
        { 'ring-1 ring-orange-500': props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}

interface StepWrapperProps {
  children: React.ReactNode;
}

const StepWrapper: React.FC<StepWrapperProps> = ({ children }) => {
  return (
    <div className="flex max-w-sm flex-col items-center gap-4 rounded-3xl border border-neutral-200 border-opacity-40 bg-neutral-50 p-8 text-center">
      <p className="max-w-[70%] text-center text-neutral-700">Start your shadow work journalling with 💌 Innkeeper</p>

      {children}

      <span className="max-w-[90%] text-xs text-neutral-600">
        By continuing, you agree to our{' '}
        <a href="#" className="underline">
          Terms of Service
        </a>{' '}
        and acknowledge our{' '}
        <a href="#" className="underline">
          Privacy Policy
        </a>
      </span>
    </div>
  );
};
