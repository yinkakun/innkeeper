import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import React from 'react';
import { Signature } from '@phosphor-icons/react';
import { Marquee } from '@/components/marquee';
import { ChatBubble } from '@/components/chat-bubble';
import { ArrowUpRight, Lightning, DownloadSimple, Notification, EyeClosed } from '@phosphor-icons/react';
import carlJung from '@/assets/carl-jung-portrait.webp';

const QA = [
  {
    question: 'What is shadow work?',
    answer: 'Shadow work is the process of exploring your inner darkness or “shadow self.”',
  },
  {
    question: 'Why is shadow work important?',
    answer: 'Shadow work is important because it helps you to understand and integrate your shadow self.',
  },
  {
    question: 'How do I get started with shadow work?',
    answer: 'You can get started with shadow work by journaling, meditating, or seeking therapy.',
  },
];

const REVIEWS = [
  {
    name: 'John',
    review: 'Innkeeper has helped me to understand myself better.',
  },
  {
    name: 'Happi',
    review: 'Innkeeper is a great tool for self-reflection and personal growth.',
  },
  {
    name: 'Alice',
    review: 'I love Innkeeper! It has helped me to become more self-aware and to work through my issues.',
  },
  {
    name: 'Bob',
    review: 'Innkeeper is a fantastic app that has helped me to become more mindful and present in my life.',
  },
];

export const Index = () => {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <main className="xborder-x mx-auto flex max-w-screen-sm grow flex-col gap-10 divide-orange-50 border-orange-50 pt-20">
        <div className="items- text- flex flex-col gap-4 text-pretty px-4">
          <span className="text-3xl leading-none">💌</span>
          <h1 className="max-w-[90%] text-pretty text-xl font-bold text-gray-700 md:text-3xl">
            Innkeeper is an AI powered journaling app for shadow work
          </h1>

          <p className="text-pretty text-sm text-gray-600">
            Start your shadow work journey today with Innkeeper. Get daily shadow work prompts and track your progress.
          </p>

          <div className="pt-3">
            <Link
              to="/journal"
              className="flex w-[120px] items-center justify-center rounded-lg border border-transparent bg-black py-1.5 text-xs font-medium text-white duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="pt-10">
          <Marquee pauseOnHover>
            <div className="flex flex-row items-stretch gap-4">
              {REVIEWS.map(({ name, review }) => (
                <div className="flex w-fit max-w-sm shrink-0 flex-col gap-4 text-pretty rounded-2xl border border-orange-50 bg-orange-50 bg-opacity-10 p-4 px-4 py-2 tracking-tight text-white text-opacity-90">
                  <span className="text-pretty text-sm text-gray-700">{review}</span>
                  <div className="mt-auto flex items-center gap-1 text-sm text-gray-500">
                    <Signature size={24} className="-rotate-12" />
                    <span>{name}</span>
                  </div>
                </div>
              ))}
            </div>
          </Marquee>
        </div>

        <div className="flex w-full flex-col gap-4 p-4 pt-12">
          {QA.map(({ answer, question }) => (
            <React.Fragment>
              <ChatBubble isSender={true}>{question}</ChatBubble>
              <ChatBubble isSender={false}>{answer}</ChatBubble>
            </React.Fragment>
          ))}
          <div className="flex max-w-[50%] flex-col gap-1.5 rounded-xl bg-gray-100 p-1.5 text-gray-600">
            <div className="flex h-24 flex-col items-center justify-center rounded-[10px] bg-white">
              <span className="flex flex-col px-2 text-center text-[10px]">
                <span>Until you make the unconscious conscious, it will direct your life and you will call it fate.</span>
                <span>— Carl Jung</span>
              </span>
            </div>
            <Link
              to="/journal"
              className="flex w-full items-center justify-center rounded-lg border border-transparent bg-black py-1 text-xs font-medium text-white duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="px-4 pt-10">
          <div className="grid auto-rows-fr grid-cols-2 gap-2 rounded-3xl border border-orange-50 bg-orange-50 bg-opacity-50 p-1.5 text-gray-600">
            <div className="flex flex-col gap-3 rounded-[20px] border border-orange-50 bg-white p-2 py-4">
              <Notification size={20} />
              <h2 className="text-sm font-medium text-gray-800">Notification</h2>
              <div className="mt-auto flex flex-col gap-1">
                <p className="text-xs">Get daily shadow work prompts via email.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-[20px] border border-orange-50 bg-white p-2 py-4">
              <DownloadSimple size={20} />
              <h2 className="text-sm font-medium text-gray-800">Export your data</h2>
              <div className="mt-auto flex flex-col gap-1">
                <p className="text-xs">Download your data in JSON format..</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-[20px] border border-orange-50 bg-white p-2 py-4">
              <EyeClosed size={20} />
              <h2 className="text-sm font-medium text-gray-800">For your eyes only</h2>
              <div className="mt-auto flex flex-col gap-1">
                <p className="text-xs">Your data is encrypted and secure. We do not share your data with third parties.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-[20px] border border-orange-50 bg-white p-2 py-4">
              <Lightning size={20} />
              <h2 className="text-sm font-medium text-gray-800">Track Progress</h2>
              <div className="mt-auto flex flex-col gap-1">
                <p className="text-xs">Stay motivated by tracking your progress.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pt-10">
          <div className="divide-orange-5=100 flex flex-col divide-y overflow-hidden rounded-3xl border border-orange-100 bg-white text-gray-600 hover:divide-orange-100 hover:border-orange-100">
            {RESOURCES.map(({ title, url }) => (
              <a
                href={url}
                key={title}
                className="group flex items-center justify-between gap-1 p-2 px-2 py-2 backdrop-blur-sm duration-150 hover:bg-orange-50"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-xs">{truncate(title, 50)}</p>
                  <span className="text-xs text-orange-300 duration-200 group-hover:text-orange-400">
                    {truncate(url.replace(/(^\w+:|^)\/\//, ''), 40)}
                  </span>
                </div>
                <ArrowUpRight size={20} className="text-orange-300" />
              </a>
            ))}
          </div>
        </div>

        <div className="relative px-4 pt-10">
          <div className="group relative mx-auto w-fit">
            <img
              src={carlJung}
              alt="Carl Jung"
              className="mx-auto h-[300px] w-full max-w-[250px] rounded-[40px] border-8 border-gray-100 object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 duration-200 group-hover:opacity-100">
              <Link
                to="/journal"
                className="flex w-[120px] items-center justify-center rounded-xl border border-gray-800 bg-black py-1.5 text-xs font-medium text-white duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        <footer className="flex flex-col gap-2 p-4 pt-20">
          <div>
            {/* copyright */}
            <span className="text-center text-xs text-gray-400">© {new Date().getFullYear()}, Olopo Studio</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

const RESOURCES = [
  {
    title: 'The Shadow',
    url: 'https://en.wikipedia.org/wiki/Shadow_(psychology)',
  },
  {
    title: 'Carl Jung',
    url: 'https://en.wikipedia.org/wiki/Carl_Jung',
  },
  {
    title: 'What Is Shadow Work, Exactly?',
    url: 'https://www.verywellmind.com/what-is-shadow-work-exactly-8609384',
  },
  {
    title: 'The benefits of shadow work and how to use it in your journey',
    url: 'https://www.betterup.com/blog/shadow-work',
  },
];

const truncate = (text: string, n: number) => {
  return text.length > n ? text.slice(0, n - 1) + '...' : text;
};
