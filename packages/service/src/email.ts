export const email = {
  inactiveUser: async (payload: { name: string; email: string }) => {
    // TODO: send email to inactive user
  },
  welcomeMessage: async (payload: { name: string; email: string }) => {
    // TODO: send welcome email
  },
  weeklyInsights: async (payload: { name: string; email: string; insights: string }) => {
    // TODO: send weekly insights
  },
  prompt: async (payload: { name: string; email: string; prompt: string }) => {
    // TODO: send daily prompt
  },
};
