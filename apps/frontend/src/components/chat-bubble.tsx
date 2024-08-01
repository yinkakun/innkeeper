import React from 'react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  isSender: boolean;
  isLast?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ isSender, children, className, isLast }) => {
  return (
    <div
      className={cn('my-px flex w-full text-sm', {
        'justify-end': isSender,
        'justify-start': !isSender,
      })}
    >
      <div className="relative flex max-w-[80%]">
        <div
          className={cn(
            'flex w-fit flex-wrap overflow-auto whitespace-pre-line text-pretty rounded-3xl px-4 py-2 tracking-tight text-opacity-90',
            {
              'bg-orange-500 text-white': isSender,
              'bg-gray-100 text-gray-700': !isSender,
            },
            className,
          )}
        >
          {children}
        </div>
        <div
          className={cn('absolute -bottom-[2px] z-20 h-[20px] w-[15px]', {
            '-left-[7px] rounded-br-[32px_28px] bg-gray-100': !isSender,
            '-right-[7px] rounded-bl-[32px_28px] bg-orange-500': isSender,
            hidden: !isLast,
          })}
        />
        <div
          className={cn('absolute -bottom-[2px] z-20 h-[21px] w-[10px] bg-white', {
            '-left-[10px] rounded-br-[20px]': !isSender,
            '-right-[10px] rounded-bl-[20px]': isSender,
            hidden: !isLast,
          })}
        />
      </div>
    </div>
  );
};
