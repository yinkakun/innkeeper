import { cn } from '@/lib/utils';
import { AppLayout } from '@/components/app-layout';

export const Insights = () => {
  return (
    <AppLayout>
      <div className="grid grid-cols-12 gap-6">
        <StatCard title="Current Streak" value="5" className="col-span-4 row-span-8 flex items-center justify-center" />
        <StatCard title="Longest Streak" value="53" className="col-span-4" />
        <StatCard title="Past Achievements" value="20" className="col-span-4" />
      </div>
    </AppLayout>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, className }) => {
  return (
    <div className={cn('flex flex-col gap-1 rounded-3xl border bg-gray-50 bg-opacity-50 p-4 text-center backdrop-blur-md', className)}>
      <span className="text-6xl">{value}</span>
      <span className="text-lg">{title}</span>
    </div>
  );
};

// <li>Show widget of past achievement, current streak, longest streak</li>
//   <li>Weekly summary of journal entries </li>
//   <li>Word count statistics</li>
//   <li>Badge Gallery Display of earned badges Progress towards upcoming badges Explanation of each badge and how to earn i</li>
//   <li>
//     Weekly Summary Overview of the week's journal entries Key themes or patterns identified Notable mood changes or insights
//     Suggestions for focus areas in the coming week
//   </li>
//   <li>Ability to save favorite prompts</li>
//   <li>Resources, terms and condition</li>
