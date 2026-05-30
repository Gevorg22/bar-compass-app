const DAY_MAP: Record<string, number> = {
  mo: 1,
  tu: 2,
  we: 3,
  th: 4,
  fr: 5,
  sa: 6,
  su: 0,
};

const DAYS_IN_ORDER = [1, 2, 3, 4, 5, 6, 0];

function expandDayRange(from: string, to: string): number[] {
  const startIdx = DAYS_IN_ORDER.indexOf(DAY_MAP[from] ?? -1);
  const endIdx = DAYS_IN_ORDER.indexOf(DAY_MAP[to] ?? -1);
  if (startIdx === -1 || endIdx === -1) return [];
  const result: number[] = [];
  let i = startIdx;
  while (true) {
    result.push(DAYS_IN_ORDER[i]);
    if (i === endIdx) break;
    i = (i + 1) % 7;
    if (result.length > 7) break;
  }
  return result;
}

function parseDaySpec(spec: string): number[] {
  const days: number[] = [];
  spec.split(',').forEach((part) => {
    const trimmed = part.trim().toLowerCase();
    const rangeParts = trimmed.split('-');
    if (rangeParts.length === 2) {
      days.push(...expandDayRange(rangeParts[0].trim(), rangeParts[1].trim()));
    } else {
      const d = DAY_MAP[trimmed];
      if (d !== undefined) days.push(d);
    }
  });
  return days;
}

export function isOpenNow(openingHours: string | undefined): boolean | null {
  if (!openingHours) return null;

  const trimmed = openingHours.trim();
  if (trimmed.toLowerCase() === '24/7') return true;

  const now = new Date();
  const todayDow = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const rules = trimmed
    .split(';')
    .map((r) => r.trim())
    .filter(Boolean);

  for (const rule of rules) {
    const timeMatch = rule.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/);

    if (timeMatch) {
      const beforeTime = rule.substring(0, rule.search(/\d{1,2}:\d{2}/)).trim();
      let appliesToday = true;

      if (beforeTime) {
        const days = parseDaySpec(beforeTime);
        appliesToday = days.length === 0 || days.includes(todayDow);
      }

      if (appliesToday) {
        const start = parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2]);
        const end = parseInt(timeMatch[3]) * 60 + parseInt(timeMatch[4]);
        if (end < start) {
          return currentMinutes >= start || currentMinutes <= end;
        }
        return currentMinutes >= start && currentMinutes <= end;
      }
    } else if (/\boff\b/i.test(rule)) {
      const beforeOff = rule.replace(/\boff\b/i, '').trim();
      if (beforeOff) {
        const days = parseDaySpec(beforeOff);
        if (days.includes(todayDow)) return false;
      }
    }
  }

  return null;
}
