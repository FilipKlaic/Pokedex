import type { EvolutionDetail } from "../api/types.js";

export function describeCondition(details: EvolutionDetail[]): string {
  const detail: EvolutionDetail | undefined = details[0];
  if (!detail) {
    return "";
  }

  switch (detail.trigger.name) {
    case "level-up": {
      if (detail.min_level !== null) {
        return `level ${detail.min_level}`;
      }
      if (detail.min_happiness !== null) {
        const time = detail.time_of_day ? `, ${detail.time_of_day}` : "";
        return `level up with high friendship${time}`;
      }
      return "level up, special condition";
    }
    case "use-item":
      return detail.item ? `use ${detail.item.name}` : "use an item";
    case "trade":
      return "trade";
    default:
      return detail.trigger.name;
  }
}
