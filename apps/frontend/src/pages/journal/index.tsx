import { AppLayout } from '@/components/app-layout';
import { CaretUp, Plus, EnvelopeSimpleOpen, At } from '@phosphor-icons/react';

export const Journal = () => {
  return (
    <AppLayout className="gap-6">
      <div className="flex items-baseline justify-between gap-2">
        <h1 className="text-xl font-medium">
          Good Morning, <span className="">Yinka</span>
        </h1>
        {/* 
        <button className="w-fit rounded-lg border border-orange-500 bg-orange-500 px-4 py-1 text-sm font-medium text-neutral-50">
          + Add Journal Entry
        </button> */}
      </div>
      <div className="grid grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => {
          return (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-2xl border bg-neutral-50 bg-opacity-50 p-4 pt-2 text-left backdrop-blur-md"
            >
              <div className="flex w-full items-center gap-2 text-neutral-800">
                <span className="text-lg font-light">
                  <At className="" size={16} />
                </span>
                <span className="rounded-full text-xs">Saturday August 12th</span>
              </div>

              <span className="text-pretty text-sm text-neutral-500">
                Prompt Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati provident perspiciatis magni voluptates velit
                cumque, deleniti voluptate minima consequuntur beatae.
              </span>
            </div>
          );
        })}
        <div className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl border bg-neutral-50 bg-opacity-50 p-4 pt-2 text-left backdrop-blur-md">
          <div className="flex w-full items-center justify-center">
            <Plus className="text-orange-500" size={24} />
          </div>
        </div>
      </div>
      {/* <div>
        <li>list past prompts with journal entry, clicking the entry will show response</li>
        <li>show response if available and option to edit or delete it, if not, show form to add response</li>
        <li>journal entries is sorted by date</li>
      </div> */}
    </AppLayout>
  );
};
