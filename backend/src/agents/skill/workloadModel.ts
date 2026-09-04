import { TIME_BUDGET_RATIOS, QUALITATIVE_HOURS } from "./skill.config";

export interface TimeBudget {
  durationHours?: number;
  development: number;
  testing: number;
  integration: number;
  deployment: number;
  presentation: number;
  buffer: number;
  perMemberAvailable: number;
}

export function computeTimeBudget(durationHours?: number): TimeBudget {
  if (durationHours && durationHours > 0) {
    return {
      durationHours,
      development: Math.round(durationHours * TIME_BUDGET_RATIOS.development),
      testing: Math.round(durationHours * TIME_BUDGET_RATIOS.testing),
      integration: Math.round(durationHours * TIME_BUDGET_RATIOS.integration),
      deployment: Math.round(durationHours * TIME_BUDGET_RATIOS.deployment),
      presentation: Math.round(durationHours * TIME_BUDGET_RATIOS.presentation),
      buffer: Math.round(durationHours * TIME_BUDGET_RATIOS.buffer),
      perMemberAvailable: Math.round(durationHours * TIME_BUDGET_RATIOS.development),
    };
  }

  // Qualitative capacity when duration is unknown (section 43)
  const dev = QUALITATIVE_HOURS.medium;
  return {
    durationHours: undefined,
    development: dev,
    testing: 2,
    integration: 2,
    deployment: 1,
    presentation: 1,
    buffer: 2,
    perMemberAvailable: dev,
  };
}
