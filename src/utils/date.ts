import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

/**
 * Format date theo style (Today, Yesterday, etc.)
 */
export function formatDateVN(dateString?: string): string {
  if (!dateString) return "Unknown";
  return dayjs(dateString).fromNow();
}

/**
 * Group diễn viên theo ngày update
 */
export function groupByUpdateDate(actresses: any[]) {
  const groups: Record<string, any[]> = {};

  actresses.forEach((actress) => {
    const dateLabel = getUpdateLabel(actress.updatedAt);

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(actress);
  });

  return groups;
}

/**
 * Sort diễn viên theo ngày update (newest first)
 */
export function sortByUpdateDate(actresses: any[]) {
  return [...actresses].sort((a, b) => {
    const dateA = dayjs(a.updatedAt).valueOf();
    const dateB = dayjs(b.updatedAt).valueOf();
    return dateB - dateA;
  });
}

/**
 * Get update label (Hôm nay, Hôm qua, etc.)
 */
export function getUpdateLabel(dateString?: string): string {
  if (!dateString) return "Earlier";

  const date = dayjs(dateString);
  const now = dayjs();
  const diffDays = now.diff(date, "day");

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "This week";
  if (diffDays < 30) return "This month";

  return "Earlier";
}

/**
 * Format date to VN format (DD/MM/YYYY)
 */
export function formatDateVNFormat(dateString?: string): string {
  if (!dateString) return "Unknown";
  return dayjs(dateString).format("DD/MM/YYYY");
}

/**
 * Format time ago (2 giờ trước)
 */
export function timeAgo(dateString?: string): string {
  if (!dateString) return "Unknown";
  return dayjs(dateString).fromNow();
}

/**
 * Format full date and time (15 Tháng 1, 2024 14:30)
 */
export function formatDateTimeFull(dateString?: string): string {
  if (!dateString) return "Unknown";
  return dayjs(dateString).format("DD [Tháng] M, YYYY HH:mm");
}
