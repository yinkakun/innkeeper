import React from 'react';
import { Link } from '@tanstack/react-router';
import { ChatBubble } from '@/components/chat-bubble';
import { ArrowUpRight, Lightning, DownloadSimple, Notification, EyeClosed } from '@phosphor-icons/react';

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
  {
    question: 'What is shadow work?',
    answer: 'Shadow work is the process of exploring your inner darkness or “shadow self.”',
  },
  {
    question: 'How do I get started with shadow work?',
    answer: 'You can get started with shadow work by journaling, meditating, or seeking therapy.',
  },
  {
    question: 'What is shadow work?',
    answer: 'Shadow work is the process of exploring your inner darkness or “shadow self.”',
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
      <main className="mx-auto flex max-w-screen-md grow flex-col items-center gap-20 bg-white pt-20">
        <div className="flex flex-col items-center gap-8 text-pretty px-4 text-center">
          <span className="text-3xl leading-none">💌</span>
          <h1 className="text-pretty font-sans text-xl text-gray-700 md:text-5xl">
            Innkeeper is an AI-powered journaling app for shadow work
          </h1>

          <p className="max-w-lg text-pretty font-sans text-lg text-gray-600">
            Start your shadow work journey today with Innkeeper. Get daily shadow work prompts and track your progress.
          </p>

          <Link
            to="/journal"
            className="flex h-10 w-full max-w-[200px] items-center justify-center rounded-3xl border border-orange-400 bg-white px-8 py-2 text-sm font-normal text-orange-500 duration-200 hover:bg-orange-400 hover:text-white"
          >
            Get Started
          </Link>
        </div>

        <div className="relative w-fit rounded-[40px] rounded-b-none border border-b-0 !border-primary/10 bg-orange-50 p-2 px-1 pb-0">
          <div className="absolute inset-x-0 top-[2px] mx-auto h-1 w-[45px] rounded-full bg-orange-200"></div>
          <div className="relative mx-auto flex w-full max-w-xs flex-col gap-4 rounded-[32px] rounded-b-none border border-b-0 !border-primary/20 bg-white p-3 pb-1">
            {QA.map(({ answer, question }) => (
              <React.Fragment>
                <ChatBubble isLast isSender={true} className="rounded-2xl text-sm">
                  {question}
                </ChatBubble>
                <ChatBubble isLast isSender={false} className="rounded-2xl text-sm">
                  {answer}
                </ChatBubble>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 px-4">
          <h2 className="text-3xl">Features</h2>
          <div className="grid max-w-lg auto-rows-fr grid-cols-2 gap-2 rounded-3xl border border-orange-100 bg-orange-50 p-1.5 text-gray-600">
            <div className="flex flex-col gap-2 rounded-[20px] border border-orange-100 bg-white p-2 py-4 hover:bg-white hover:bg-opacity-80">
              <Notification size={20} />
              <h2 className="text-lg text-gray-800">Notification</h2>
              <div className="flex flex-col gap-1">
                <p className="text-sm">Get daily shadow work prompts via email.</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-[20px] border border-orange-100 bg-white p-2 py-4 hover:bg-white hover:bg-opacity-80">
              <DownloadSimple size={20} />
              <h2 className="text-lg text-gray-800">Export your data</h2>
              <div className="flex flex-col gap-1">
                <p className="text-sm">Download your data in JSON format..</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-[20px] border border-orange-100 bg-white p-2 py-4 hover:bg-white hover:bg-opacity-80">
              <EyeClosed size={20} />
              <h2 className="text-lg text-gray-800">For your eyes only</h2>
              <div className="flex flex-col gap-1">
                <p className="text-sm">Your data is encrypted and secure. We do not share your data with third parties.</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-[20px] border border-orange-100 bg-white p-2 py-4 hover:bg-white hover:bg-opacity-80">
              <Lightning size={20} />
              <h2 className="text-lg text-gray-800">Track Progress</h2>
              <div className="flex flex-col gap-1">
                <p className="text-sm">Stay motivated by tracking your progress.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 px-4">
          <h2 className="text-3xl">Reviews</h2>
          <div className="w-full max-w-lg rounded-3xl border border-orange-100 bg-orange-50 p-1.5">
            <div className="flex w-full max-w-lg flex-col items-stretch gap-0 divide-y divide-orange-50 rounded-[20px] border border-orange-100 bg-white">
              {REVIEWS.map(({ name, review }) => (
                <div className="flex w-full shrink-0 flex-col gap-2 text-pretty p-4 px-4 py-3 tracking-tight hover:bg-orange-50 hover:bg-opacity-30">
                  <span className="text-pretty text-lg text-gray-800">{review}</span>
                  <div className="mt-auto flex items-center gap-1">
                    <span className="text-sm text-orange-300">— {name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 px-4">
          <h2 className="text-3xl">Resources</h2>
          <div className="w-full max-w-lg rounded-3xl border border-orange-100 bg-orange-50 p-1.5">
            <div className="flex w-full flex-col divide-y divide-orange-50 overflow-hidden rounded-[20px] border border-orange-100 bg-white text-gray-600 hover:divide-orange-100 hover:border-orange-100">
              {RESOURCES.map(({ title, url }) => (
                <a
                  href={url}
                  key={title}
                  className="group flex items-center justify-between gap-1 p-3 backdrop-blur-sm duration-150 hover:bg-orange-50 hover:bg-opacity-30"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-sans text-lg">{truncate(title, 50)}</p>
                    <span className="text-sm text-orange-300 duration-200 group-hover:text-orange-400">
                      {truncate(url.replace(/(^\w+:|^)\/\//, ''), 40)}
                    </span>
                  </div>
                  <ArrowUpRight size={20} className="text-orange-300" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex max-w-lg flex-col items-center gap-6">
          <div className="flex w-full flex-col items-center gap-2 font-serif text-2xl">
            <p className="text-pretty text-center font-serif text-2xl text-gray-800">
              Until you make the unconscious conscious, it will direct your life and you will call it fate.
            </p>
            <span className="font-serif text-2xl">— Carl Jung</span>
          </div>
          <Link
            to="/journal"
            className="flex h-10 w-full max-w-[200px] items-center justify-center rounded-3xl border border-orange-400 bg-white px-8 py-2 text-sm font-normal text-orange-500 duration-200 hover:bg-orange-400 hover:text-white"
          >
            Get Started
          </Link>
        </div>

        <footer className="flex flex-col gap-2 p-4 pt-20">
          <div>
            <span className="text-center text-xs text-gray-600">© {new Date().getFullYear()}, Olopo Studio</span>
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
