import { AppLayout } from '@/components/app-layout';
import { SignOut as SignOutIcon } from '@phosphor-icons/react';

export const Settings = () => {
  return (
    <AppLayout>
      <div className="flex grow flex-col gap-4">
        <SettingsSection title="General">
          <div className="flex w-full items-center justify-between gap-4 py-4 text-sm">
            <label htmlFor="name">First Name</label>
            <input
              type="text"
              id="name"
              className="h-8 grow rounded-lg border border-neutral-300 border-opacity-50 bg-white px-2 py-1 text-xs placeholder:text-neutral-500 focus:bg-orange-50"
            />
          </div>
        </SettingsSection>

        <SettingsSection title="Notifications">
          <div className="flex items-center justify-between gap-2 py-4">
            <span>Enable Email Notifications</span>
            <button className="rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-1 text-center text-sm">Enable</button>
          </div>

          <div className="flex w-full items-center justify-between gap-4 py-4 text-sm">
            <label htmlFor="name">Time Zone</label>
            <input
              type="text"
              id="name"
              className="h-8 grow rounded-lg border border-neutral-300 border-opacity-50 bg-white px-2 py-1 text-xs placeholder:text-neutral-500"
            />
          </div>
        </SettingsSection>

        <SettingsSection title="Security">
          {/* logout, enable passcode and delete account */}

          <div className="flex items-center justify-between gap-2 py-4">
            <span>Enable Passcode</span>
            <button className="rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-1 text-center text-sm">Enable</button>
          </div>

          <div className="flex items-center justify-between gap-2 py-4">
            <span>Enable Confidential Mode</span>
            <button className="rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-1 text-center text-sm">Enable</button>
          </div>

          <div className="py-4">
            <button className="font-center flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-1 text-sm text-neutral-800">
              <SignOutIcon size={16} />
              <span>Logout</span>
            </button>
          </div>
        </SettingsSection>
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
      <div className="flex w-full flex-col divide-y text-sm">{children}</div>
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
