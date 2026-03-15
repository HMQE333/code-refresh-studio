const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const WEEK = 604800;
const MONTH = 2592000;

export function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, Math.floor((now - then) / 1000));

  if (diff < MINUTE) return "przed chwilą";
  if (diff < HOUR) {
    const m = Math.floor(diff / MINUTE);
    return `${m} min temu`;
  }
  if (diff < DAY) {
    const h = Math.floor(diff / HOUR);
    return `${h} godz. temu`;
  }
  if (diff < WEEK) {
    const d = Math.floor(diff / DAY);
    return d === 1 ? "1 dzień temu" : `${d} dni temu`;
  }
  if (diff < MONTH) {
    const w = Math.floor(diff / WEEK);
    return w === 1 ? "1 tydzień temu" : `${w} tyg. temu`;
  }
  const mo = Math.floor(diff / MONTH);
  return mo === 1 ? "1 miesiąc temu" : `${mo} mies. temu`;
}
