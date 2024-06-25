import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from 'trpc';

export const TRPCReact = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from 'trpc';
