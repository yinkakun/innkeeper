import { Link } from '@tanstack/react-router';
import { AppLayout } from '@/components/app-layout';

export const Settings = () => {
  return (
    <AppLayout className="flex grow flex-col pb-4">
      <div className="grid h-full grow grid-cols-12 gap-6 rounded-3xl border border-opacity-50 bg-white px-6 pb-6 pt-10">
        <div className="col-span-2 flex h-full basis-40 flex-col gap-3 rounded-2xl border bg-neutral-50 p-4">
          <h2>🌱 Innkeeper</h2>

          <div className="mt-8 flex w-full flex-col gap-2">
            <Link to="/settings" className="w-full rounded-lg border border-neutral-100 bg-white px-3 py-0.5 hover:bg-white">
              Profile
            </Link>
            <Link
              to="/settings"
              className="w-full rounded-lg border border-transparent px-3 py-0.5 duration-200 hover:border-neutral-100 hover:bg-white"
            >
              Account
            </Link>
            <Link
              to="/settings"
              className="w-full rounded-lg border border-transparent px-3 py-0.5 duration-200 hover:border-neutral-100 hover:bg-white"
            >
              Prompts
            </Link>
          </div>

          <div className="mt-auto">
            <button className="100 flex w-full items-center gap-1 rounded-lg border bg-white p-0.5 font-medium text-neutral-700">
              <div className="size-6 rounded-[8px] border bg-orange-500"></div>
              <span className="text-sm">Yinka</span>
            </button>
          </div>
        </div>
        <div className="col-span-10 flex grow flex-col gap-8">
          <div className="flex h-full w-full flex-col gap-3 rounded-2xl border border-neutral-200 p-4">
            <div className="grid w-full grid-cols-2 gap-4">
              <form className="flex flex-col gap-2 rounded-xl border p-4">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" className="border" />
              </form>

              <div className="flex flex-col gap-2 rounded-xl border p-4">Enable email notifications</div>
            </div>
          </div>
        </div>
      </div>
      {/* <div>
        <div>
          <li>User information (name, email, birthdate)</li>
          <li>Time zone settings </li>
          <li> Prompt preferences (focus areas, tone) </li>
          <li>Notification settings Option to pause/unpause daily prompts</li>
          <li>Account deletion option</li>
          <li>Toggle email notifications</li>
        </div>
      </div> */}
    </AppLayout>
  );
};
