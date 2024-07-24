import { AppLayout } from '@/components/app-layout';

export const Journal = () => {
  return (
    <AppLayout className="flex flex-col gap-4">
      <h1 className="text-2xl">
        Good Morning, <span className="">Yinka 👋🏽</span>
      </h1>
      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col gap-2 rounded-lg border border-neutral-300 border-opacity-50 p-4">
          <span className="text-sm">Date: Saturday August 12th, 2021</span>
          <span>
            Prompt Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati provident perspiciatis magni voluptates velit cumque,
            deleniti voluptate minima consequuntur beatae.
          </span>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-neutral-300 border-opacity-50 p-4">
          <span className="text-sm">Date: Saturday August 12th, 2021</span>
          <span>
            Prompt Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati provident perspiciatis magni voluptates velit cumque,
            deleniti voluptate minima consequuntur beatae.
          </span>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-neutral-300 border-opacity-50 p-4">
          <span className="text-sm">Date: Saturday August 12th, 2021</span>
          <span>
            Prompt Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati provident perspiciatis magni voluptates velit cumque,
            deleniti voluptate minima consequuntur beatae.
          </span>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-neutral-300 border-opacity-50 p-4">
          <span className="text-sm">Date: Saturday August 12th, 2021</span>
          <span>
            Prompt Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati provident perspiciatis magni voluptates velit cumque,
            deleniti voluptate minima consequuntur beatae.
          </span>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-neutral-300 border-opacity-50 p-4">
          <span className="text-sm">Date: Saturday August 12th, 2021</span>
          <span>
            Prompt Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati provident perspiciatis magni voluptates velit cumque,
            deleniti voluptate minima consequuntur beatae.
          </span>
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
