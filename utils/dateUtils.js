export function inWithinDaysFromToday(date, days) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const diffDays =
    (today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24);

  return diffDays <= days;
}
