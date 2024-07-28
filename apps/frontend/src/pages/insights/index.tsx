import { cn } from '@/lib/utils';
import HeatMap from '@uiw/react-heat-map';
import fireEmoji from '@/assets/fire-emoji.svg';
import moaiEmoji from '@/assets/moai-emoji.svg';
import { AppLayout } from '@/components/app-layout';
import highVoltageEmoji from '@/assets/high-voltage-emoji.svg';
import { CircularProgressBar } from '@/components/circular-progress-bar';

const CONSISTENCY = [
  {
    title: 'Seedling',
    value: '1',
    max: '1',
    description: 'Earn this badge when you make your first journal entry. Plant the seed, watch it grow.',
  },
  {
    title: 'Firestarter',
    value: '3',
    max: '7',
    description: 'Earn this badge when you journal consistently for 7 days. You are on fire!',
  },
  {
    title: 'Rainbow',
    value: '3',
    max: '30',
    description: 'Earn this badge when you journal consistently for 30 days. Taste the rainbow!',
  },
  {
    value: '67',
    max: '100',
    title: 'Zen Master',
    description: 'Earn this badge when you journal consistently for 100 days. The impossible badge.',
  },
];

const MILESTONES = [
  {
    name: 'Baby Steps',
    value: '1',
    max: '1',
    description: 'Make your first journal entry',
  },
  {
    name: 'Stargazer',
    value: '3',
    max: '10',
    description: 'Complete 10 journal entries',
  },
  {
    name: 'Sisyphus',
    value: '3',
    max: '100',
    description: 'Complete 100 journal entries',
  },
];

export const Insights = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <div className="flex w-full flex-col gap-4 rounded-3xl border bg-zinc-50 bg-opacity-50 p-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <h2>Consistency is hard, but you got this!</h2>
            <span className="rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs">Coming soon</span>
          </div>

          <div className="grid grid-cols-3 gap-0 divide-x rounded-2xl border border-[#ffa380] border-opacity-20 bg-[#ffede5] bg-opacity-20 p-4">
            <Stat title="Vanity XP" value="21" icon={highVoltageEmoji} />
            <Stat title="Current Streak" value="1" icon={fireEmoji} />
            <Stat title="Longest Streak" value="10" icon={moaiEmoji} />
          </div>

          <div className="flex w-full flex-col gap-4 rounded-3xl border border-[#ffa380] border-opacity-20 bg-[#ffede5] bg-opacity-20 p-3 backdrop-blur">
            {/* TODO: fix hack of using negative value */}
            <div className="-mb-9 w-full">
              <HeatMap
                value={[]}
                weekLabels={false}
                monthLabels={false}
                className="w-full"
                startDate={new Date('2024/01/01')}
                panelColors={{
                  0: '#ffc8b3',
                  2: '#ffa380',
                  4: '#ff7f4d',
                  10: '#ff5a1a',
                  20: '#FF4800',
                  30: '#e64100',
                }}
                rectProps={{
                  rx: 1.8,
                }}
              />
            </div>
          </div>

          <MilestoneAchievements />
          <ConsistencyBadges />
        </div>
      </div>
    </AppLayout>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  description?: string;
  className?: string;
}

const Stat: React.FC<StatCardProps> = ({ value, title, className, icon }) => {
  return (
    <div className={cn('flex items-start gap-4 px-4', className)}>
      <div className="relative">
        <img
          src={icon}
          className={cn('w-full max-w-10', {
            'grayscale filter': value === '0',
          })}
        />
      </div>
      <div className="flex flex-col items-start gap-0">
        <span className="text-xl font-medium leading-none">{value}</span>
        <span className="text-sm capitalize">{title}</span>
      </div>
    </div>
  );
};

const MilestoneAchievements = () => {
  return (
    <div className="grid grid-cols-3 gap-0 divide-x rounded-3xl border border-[#ffa380] border-opacity-20 bg-[#ffede5] bg-opacity-20 p-2 backdrop-blur">
      {MILESTONES.map(({ name, description, value, max }, index) => {
        return (
          <div className="flex flex-col items-start gap-1 px-3" key={index}>
            <div className={cn('flex w-full items-center gap-2')}>
              <CircularProgressBar
                max={parseInt(max)}
                value={parseInt(value)}
                gaugePrimaryColor="#FF4800"
                gaugeSecondaryColor="#F3F4F6"
                size="xs"
              />
              <div className="flex flex-col items-start gap-0">
                <span className="text-lg font-medium leading-none text-zinc-900">{name}</span>
              </div>
            </div>
            <span className="mt-auto text-xs text-zinc-700">{description}</span>
          </div>
        );
      })}
    </div>
  );
};

const ConsistencyBadges = () => {
  return (
    <div className="grid w-full grid-cols-2 gap-4">
      {CONSISTENCY.map(({ max, title, value, description }, index) => {
        return (
          <div
            className="flex w-full items-center gap-4 rounded-3xl border border-[#ffa380] border-opacity-20 bg-[#ffede5] bg-opacity-20 p-2 backdrop-blur"
            key={index}
          >
            <div className="shrink-0">
              <CircularProgressBar
                max={parseInt(max)}
                value={parseInt(value)}
                gaugePrimaryColor="#FF4800"
                gaugeSecondaryColor="#F3F4F6"
                size="sm"
              />
            </div>
            <div className="flex max-w-sm flex-col gap-0">
              <span className="text-sm font-medium text-zinc-800">{title}</span>
              <span className="text-[10px]">{description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
