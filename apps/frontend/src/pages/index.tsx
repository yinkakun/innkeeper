import { Layout } from '@/components/layout';
import { Link } from '@tanstack/react-router';

export const Index = () => {
  return (
    <Layout className="relative flex flex-col gap-8 pt-40">
      <header className="fixed left-1/2 top-6 w-full max-w-sm -translate-x-1/2 rounded-[15px] border border-neutral-200 bg-transparent backdrop-blur-lg">
        <nav className="flex w-full items-center justify-between p-0.5">
          <Link to="/" className="flex rounded-[13px] bg-white px-2 lowercase">
            💌 Innkeeper
          </Link>

          <Link to="/login" className="flex rounded-[13px] bg-orange-500 px-4 py-1 text-sm text-white">
            Start Journaling
          </Link>
        </nav>
      </header>
      <div className="mx-auto w-full max-w-prose grow">
        <p className="font-serif text-lg">
          Innkeeper is a shadow work journaling app that helps you explore your inner self, uncover hidden beliefs, and heal past traumas.
          By writing about your thoughts and feelings, you can gain a deeper understanding of yourself and work through emotional
          challenges.
        </p>

        <div>Feature grid here</div>

        <div>Faq here</div>

        {/* check daft site */}

        {/* open that innkeeper obsidian */}
      </div>
    </Layout>
  );
};

{
  /* <div>
        <li>Brief explanation of shadow work and the app's purpose</li>
        <li>benefits of using the app</li>
        <li>A "Start Journaling" button at the end that redirect to login page</li>
        <li>Briefly explain the concept of shadow work and how the app supports it.</li>
      </div> */
}
