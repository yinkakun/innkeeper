import { cn } from '@/lib/utils';
import HeatMap from '@uiw/react-heat-map';
import { ProgressBar } from '@/components/progress-bar';
import vanityXp from '@/assets/vanity-xp.svg';
import daysStreak from '@/assets/days-streak.svg';
import tenJournalEntries from '@/assets/ten-entries.svg';
import thirtyJournalEntries from '@/assets/thirty-entries.svg';
import hundredJournalEntries from '@/assets/hundred-entries.svg';
import levelOne from '@/assets/level-one.svg';
import levelTwo from '@/assets/level-two.svg';
import levelThree from '@/assets/level-three.svg';
import levelFour from '@/assets/level-four.svg';
import totalEntries from '@/assets/total-entries.svg';

const CONSISTENCY_BADGES = [
  {
    max: '1',
    value: '1',
    title: 'Beginner',
    icon: levelOne,
    description: 'Make your first journal entry',
  },
  {
    max: '10',
    value: '7',
    title: 'Novice',
    icon: levelTwo,
    description: 'Journal consistently for 10 days',
  },
  {
    max: '30',
    value: '7',
    title: 'Explorer',
    icon: levelThree,
    description: 'Journal consistently for 30 days',
  },
  {
    max: '100',
    value: '7',
    title: 'Master',
    icon: levelFour,
    description: 'Journal consistently for 100 days', // The impossible badge
  },
];

const MILESTONE_BADGES = [
  {
    max: '10',
    value: '7',
    name: 'Decathlon',
    icon: tenJournalEntries,
    description: 'Complete 10 total entries',
  },
  {
    max: '30',
    value: '7',
    name: 'Stargazer',
    icon: thirtyJournalEntries,
    description: 'Complete 30 journal entries',
  },
  {
    max: '100',
    value: '7',
    name: 'Sisyphus',
    icon: hundredJournalEntries,
    description: 'Complete 100 journal entries',
  },
];

const STATS = [
  {
    title: 'Longest Streak',
    value: '10',
    icon: totalEntries,
  },
  {
    title: 'Total Entries',
    value: '10',
    icon: totalEntries,
  },
  {
    title: 'Word Count',
    value: '10K',
    icon: totalEntries,
  },
];

export const Insights = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-2">
        <h2>Consistency is hard, but you got this!</h2>
      </div>
      <Activities />
      <Stats />
      <MilestoneAchievements />
      <ConsistencyBadges />
    </div>
  );
};

const Stats = () => {
  return (
    <div className="grid grid-cols-3 gap-0 divide-x rounded-2xl border border-border bg-white py-3 backdrop-blur">
      {STATS.map(({ title, value, icon }, index) => {
        return (
          <div key={index} className={cn('flex items-center gap-1 pr-3')}>
            <div className="relative -mb-4">
              <img
                src={icon}
                className={cn('w-full max-w-16', {
                  'grayscale filter': value === '0',
                })}
              />
            </div>
            <div className="flex flex-col items-start gap-0">
              <span className="text-xl leading-none text-gray-800">{value}</span>
              <span className="text-xs capitalize text-gray-600">{title}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Activities = () => {
  const today = new Date();
  // 160 days ago
  const startDate = new Date(today.getTime() - 160 * 24 * 60 * 60 * 1000);
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex w-full flex-col gap-4 rounded-3xl border border-border bg-white p-3 backdrop-blur">
        <div className="w-full">
          <HeatMap
            value={[
              {
                count: 10,
                date: '2024/08/04',
              },
            ]}
            weekLabels={false}
            onClick={() => {}}
            monthLabels={false}
            legendCellSize={0}
            className="pointer-events-none w-full"
            height={100}
            endDate={today}
            startDate={startDate}
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
      <div className="flex gap-4">
        <div className="flex w-full grow flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-white p-3 backdrop-blur">
          <div className="flex items-start gap-2">
            <div className="relative -mb-7">
              <img src={vanityXp} className={cn('w-full max-w-16', {})} />
            </div>
          </div>
          <span className="text-base capitalize text-gray-800">188 Vanity XP</span>
        </div>

        <div className="flex w-full grow flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-white p-3 backdrop-blur">
          <div className="relative -mb-7">
            <img src={daysStreak} className={cn('w-full max-w-16', {})} />
          </div>
          <span className="text-base capitalize text-gray-800">7 Day Streak</span>
        </div>
      </div>
    </div>
  );
};

const MilestoneAchievements = () => {
  return (
    <div className="grid grid-cols-3 gap-0 divide-x rounded-3xl border border-border bg-white py-4 backdrop-blur">
      {MILESTONE_BADGES.map(({ name, description, value, max, icon }, index) => {
        return (
          <div className="flex flex-col items-start gap-2 px-3" key={index}>
            <div className="flex items-center">
              <div className="relative -mb-4 -ml-2 shrink-0">
                <img src={icon} className="w-full max-w-16" />
              </div>
              <div className={cn('flex w-full flex-col gap-1')}>
                <span className="text-lg leading-none text-gray-800">{name}</span>
                <span className="text-xs text-gray-600">{description}</span>
              </div>
            </div>
            <div className="mt-auto w-full">
              <ProgressBar value={parseInt(value)} max={parseInt(max)} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ConsistencyBadges = () => {
  return (
    <div className="grid w-full grid-cols-2 gap-4">
      {CONSISTENCY_BADGES.map(({ max, title, value, description, icon }, index) => {
        return (
          <div key={index} className="flex w-full flex-col items-center gap-2 rounded-3xl border border-border bg-white p-3 backdrop-blur">
            <div className="flex w-full items-center">
              <div className="-mb-5 -ml-2 shrink-0">
                <img src={icon} className="w-full max-w-16" />
              </div>
              <div className="flex max-w-sm flex-col gap-0">
                <span className="text-lg text-gray-800">{title}</span>
                <span className="text-xs text-gray-600">{description}</span>
              </div>
            </div>
            <div className="mt-auto w-full">
              <ProgressBar value={parseInt(value)} max={parseInt(max)} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
