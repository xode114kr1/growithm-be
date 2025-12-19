const romanToNumber = {
  i: 1,
  ii: 2,
  iii: 3,
  iv: 4,
  v: 5,
};

function exchangeStudyScore(platform, level) {
  if (!platform) return 0;

  const p = String(platform).toLowerCase();

  if (p === "beakjoon") {
    const parts = String(level).toLowerCase().trim().split(/\s+/);
    if (parts.length < 2) return 0;

    const tier = parts[0];
    const roman = parts[1];
    const tierLevel = romanToNumber[roman];

    if (!tierLevel || tierLevel < 1 || tierLevel > 5) return 0;

    const tierBaseScore = {
      bronze: 1,
      silver: 50,
      gold: 2500,
      platinum: 125000,
      diamond: 6250000,
    };

    const base = tierBaseScore[tier];
    if (!base) return 0;

    return base * (6 - tierLevel);
  }

  if (p === "programmers") {
    const lv = Number(level.split(" ")[1]);
    if (!Number.isFinite(lv) || lv < 1) return 0;

    return 3 * Math.pow(50, lv - 1);
  }

  return 0;
}

module.exports = { exchangeStudyScore };
