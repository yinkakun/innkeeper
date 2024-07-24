import { Layout } from '@/components/layout';

export const Onboarding = () => {
  return (
    <Layout className="flex items-center justify-center">
      <div className="relative flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-neutral-200 border-opacity-40 bg-neutral-50 p-8 pt-16 text-left">
        <div className="absolute inset-x-8 top-8 grid h-1.5 grid-cols-5 gap-2 rounded-full bg-transparent">
          <div className="h-full w-full rounded-full bg-[#FF4800] bg-opacity-50 backdrop-blur-lg" />
          <div className="h-full w-full rounded-full bg-white bg-opacity-95 backdrop-blur-lg" />
          <div className="h-full w-full rounded-full bg-white bg-opacity-95 backdrop-blur-lg" />
          <div className="h-full w-full rounded-full bg-white bg-opacity-95 backdrop-blur-lg" />
          <div className="h-full w-full rounded-full bg-white bg-opacity-95 backdrop-blur-lg" />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-medium text-neutral-800">Your name, please?</h2>
          <p className="text-xs text-neutral-600">
            We'll use this to personalize your experience and address you by name in the app. You can always change this later.
          </p>
        </div>
        <input
          type="text"
          id="name"
          placeholder="First Name"
          className="h-8 w-full grow rounded-lg border border-neutral-300 border-opacity-50 bg-white px-2 py-1 text-xs placeholder:text-neutral-500"
        />

        <button className="hover-bg-orange-600 xmax-w-[30%] ml-auto w-full rounded-lg bg-[#FF4800] bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm font-medium text-neutral-50 duration-200">
          Next
        </button>
      </div>
    </Layout>
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
