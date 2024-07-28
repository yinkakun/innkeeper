import React from 'react';
import { Switch } from 'react-aria-components';
import { AppLayout } from '@/components/app-layout';
import { CheckCircle, Circle } from '@phosphor-icons/react';
import { Label, RadioGroup, Radio } from 'react-aria-components';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'First name must be 100 characters or less'),
  promptFrequency: z
    .enum(['daily', 'weekly'], {
      required_error: 'Please select a prompt frequency',
    })
    .default('Weekly'),
  preferredPromptTime: z
    .enum(['morning', 'afternoon', 'evening', 'night'], {
      required_error: 'Please select a preferred prompt time',
    })
    .default('Morning'),
  primaryGoal: z
    .enum(['Self-Discovery and Growth', 'Emotional Wellness and Resilience', 'Relationships and Behavioral Change'], {
      required_error: 'Please select a primary goal',
    })
    .default('Self-Discovery and Growth'),
  preferredPromptTone: z
    .enum(['neutral', 'nurturing', 'challenging'], {
      required_error: 'Please select a preferred prompt tone',
    })
    .default('Neutral'),
  enableEmailNotifications: z.boolean().default(false),
});

type FormSchemaType = z.infer<typeof formSchema>;

const FREQUENCY = ['Daily', 'Weekly'];
const TIMES = ['Morning', 'Afternoon', 'Evening', 'Night'];

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
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      promptFrequency: undefined,
      preferredPromptTime: undefined,
      primaryGoal: undefined,
      preferredPromptTone: undefined,
      enableEmailNotifications: false,
    },
  });

  return (
    <AppLayout>
      <div className="flex grow flex-col gap-4">
        <div className="flex h-full w-full flex-col gap-6 rounded-3xl border border-neutral-200 bg-orange-50 bg-opacity-5 p-4 backdrop-blur-sm">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm">
              First Name
            </label>
            <input
              type="text"
              id="name"
              className="h-8 grow rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs placeholder:text-neutral-500 focus:bg-orange-50"
            />
          </div>

          <RadioGroup className="flex w-full max-w-none shrink-0 flex-col gap-2" onChange={(value) => {}}>
            <Label className="text-sm">Prompt Frequency</Label>
            <div className="grid w-full shrink-0 grid-cols-2 gap-4">
              {FREQUENCY.map((item) => (
                <Radio
                  className="cursor-pointer rounded-lg border border-neutral-200 bg-white p-2 py-1 transition-colors duration-200 hover:bg-orange-100 hover:bg-opacity-50 data-[selected]:border-orange-400 data-[selected]:bg-orange-200 data-[selected]:text-stone-700"
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

          <RadioGroup className="flex flex-col gap-2">
            <Label className="text-sm">Preferred Prompt Time</Label>
            <div className="grid w-full grid-cols-4 flex-col gap-2">
              {TIMES.map((time) => (
                <Radio
                  value={time}
                  key={time}
                  className="cursor-pointer rounded-lg border border-neutral-200 bg-white p-2 py-1 transition-colors duration-200 hover:bg-orange-100 hover:bg-opacity-50 data-[selected]:border-orange-400 data-[selected]:bg-orange-200 data-[selected]:text-stone-700"
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

          <RadioGroup className="flex flex-col gap-2">
            <Label className="text-sm capitalize">Primary Goal for journaling</Label>
            <div className="grid w-full grid-cols-3 flex-col gap-2">
              {GOALS.map((goal) => (
                <Radio
                  key={goal.title}
                  value={goal.title}
                  className="cursor-pointer rounded-lg border border-neutral-200 bg-white p-3 transition-colors duration-200 hover:bg-orange-100 hover:bg-opacity-50 data-[selected]:border-orange-400 data-[selected]:bg-orange-100 data-[selected]:text-stone-700"
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

          <RadioGroup className="flex flex-col gap-2">
            <Label className="text-sm">Proffered Prompt Tone</Label>

            <div className="grid w-full grid-cols-3 flex-col gap-2">
              {TONES.map((tone) => (
                <Radio
                  value={tone.title}
                  key={tone.title}
                  className="flex cursor-pointer flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-2 transition-colors duration-200 hover:bg-orange-100 hover:bg-opacity-50 data-[selected]:border-orange-400 data-[selected]:bg-orange-100 data-[selected]:text-stone-700"
                >
                  {({ isSelected }) => (
                    <React.Fragment>
                      <div className="flex items-center gap-2 text-stone-900">
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

          <div className="flex items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white p-2 py-2">
            <span className="text-sm">Enable Email Notifications</span>
            <Switch className="group flex items-center gap-2 text-lg font-semibold text-black">
              <div className="group-pressed:bg-orange-700 group-selected:bg-amber-800 group-selected:group-pressed:bg-amber-900 box-border flex h-[26px] w-[44px] shrink-0 cursor-default rounded-full border border-solid border-white/30 bg-orange-600 bg-clip-padding p-[3px] shadow-inner outline-none ring-black transition duration-200 ease-in-out group-focus-visible:ring-2">
                <span className="group-selected:translate-x-[100%] h-[18px] w-[18px] translate-x-0 transform rounded-full bg-white shadow transition duration-200 ease-in-out" />
              </div>
            </Switch>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button className="mr-auto flex h-8 w-full max-w-[100px] items-center justify-center rounded-lg border border-neutral-300 bg-neutral-200 py-1 text-sm font-medium text-neutral-700 duration-200">
              <span>Logout</span>
            </button>

            <button className="ml-auto flex h-8 w-full max-w-[100px] items-center justify-center rounded-lg bg-[#FF4800] bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm font-medium text-neutral-50 duration-200">
              <span>Save</span>
            </button>
          </div>
        </div>

        <button className="text-center text-xs text-red-600">Delete Account</button>
      </div>
    </AppLayout>
  );
};

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  return (
    <div className="flex h-full w-full flex-col rounded-3xl border border-neutral-200 border-opacity-50 bg-neutral-50 bg-opacity-50 p-6 pb-4 pt-4 backdrop-blur-sm">
      <h2 className="text-base font-medium">{title}</h2>
      <div className="flex w-full flex-col text-sm">{children}</div>
    </div>
  );
};

{
  /* <div>
        <div>
          <li>User information (name, birthdate)</li>
          <li>Account deletion option</li>

          <li>Time zone settings </li>
          <li> Prompt preferences (focus areas, tone) </li>
          <li>Toggle email notifications</li>
        </div>
      </div> */
}
