import { schedules } from '@trigger.dev/sdk/v3';

export const pauseIdleUsers = schedules.task({
  id: 'pause-idle-users',
  run: async (payload) => {
    console.log('Pausing idle users', payload);
  },
});

export const pauseIdleUsersSchedule = await schedules.create({
  //The id of the scheduled task you want to attach to.
  task: pauseIdleUsers.id,
  //The schedule in CRON format.
  cron: '0 0 * * *',
  //this is required, it prevents you from creating duplicate schedules. It will update the schedule if it already exists.
  deduplicationKey: 'pause-idle-users',
});
