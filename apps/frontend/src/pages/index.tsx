import { DotPattern } from '@/components/dot-pattern';
import { Link } from '@tanstack/react-router';

export const Index = () => {
  return (
    <div className="relative flex h-[100dvh] flex-col items-center justify-center gap-8 bg-orange-500 px-4 font-sans text-white">
      <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <p className="max-w-prose text-center text-4xl">
            💌 Innkeeper helps you engage in shadow work through AI generated daily journaling, sends shadow work prompts via email, allows
            users to respond through the web app or directly in the email.
          </p>
          <p className="max-w-lg rounded-2xl bg-white bg-opacity-5 px-4 py-3 text-center text-2xl">
            Until you make the unconscious conscious, it will direct your life and you will call it fate.” — Carl Jung
          </p>
        </div>
        <Link
          className="w-full max-w-[200px] rounded-xl bg-white px-8 py-2 text-center font-medium text-orange-500 duration-100 hover:border-white"
          to="/login"
        >
          Get started
        </Link>
        <DotPattern />
      </div>
    </div>
  );
};
