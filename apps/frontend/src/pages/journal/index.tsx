import { AppLayout } from '@/components/app-layout';

export const Journal = () => {
  return (
    <AppLayout className="gap-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-medium">
          🌱 Good Morning, <span className="">Yinka</span>
        </h1>

        <button className="rounded-lg border border-orange-500 bg-orange-500 px-4 py-1 text-sm font-medium text-neutral-50">
          Get Prompt
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {Array.from({ length: 6 }).map((_, index) => {
          return (
            <div key={index} className="flex flex-col gap-3 rounded-3xl border bg-gray-50 bg-opacity-50 p-4 text-left backdrop-blur-md">
              <span className="text-xs">Date: Saturday August 12th, 2021</span>
              <span className="text-pretty text-sm text-neutral-800">
                Prompt Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati provident perspiciatis magni voluptates velit
                cumque, deleniti voluptate minima consequuntur beatae.
              </span>
            </div>
          );
        })}
      </div>
      {/* <div>
        <li>list past prompts with journal entry, clicking the entry will show response</li>
        <li>show response if available and option to edit or delete it, if not, show form to add response</li>
        <li>journal entries is sorted by date</li>
      </div> */}
    </AppLayout>
  );
};
