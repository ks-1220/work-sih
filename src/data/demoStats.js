// PLACEHOLDER VALUES — NOT USER DATA.
//
// Every figure below is a hardcoded literal. None of it is measured, recorded
// or fetched, and there is no backend field behind any of it. These numbers
// were previously written straight into the Home and Profile markup, where
// they read as the signed-in user's own health and activity data.
//
// They are collected here so that:
//   1. it is obvious at a glance what is real and what is not, and
//   2. replacing them with real records is a change to one file.
//
// Every panel that renders these must also show the SampleDataBadge component
// alongside, so the claim stays visible in the UI and not just in this comment.
//
// Fields that ARE real and must not be moved here: user.firstName,
// user.lastName, user.email, user.streak, user.lastLoginDate,
// user.lastLoginDates and user.medicalComplications, all of which come from
// the authenticated backend.

export const demoHomeStats = {
  carbonFootprint: '18.9',
  dailySteps: '5000',
  sustainPoints: '300',

  activeCaloriesPercent: 85,
  caloriesToday: 400,
  caloriesThisWeek: 3500,
  caloriesThisMonth: 14000,

  fastest5KRun: '22min',
  longestCyclingDistance: '4 miles',
  longestRollerSkating: '2 hours',
};

export const demoProfileStats = {
  taskProgress: '12/34',
  fitnessEventsAttended: '22',
  followerCount: '243',
};
