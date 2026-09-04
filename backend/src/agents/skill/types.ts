import { SkillEvidence } from "../../graph/state";

// An evidence entry tied to a specific (normalized) skill. The final
// SkillEvidence objects persisted in the profile drop the `skill` field
// (it lives on the parent SkillAssessment), but grouping/scoring needs it.
export interface EvidenceEntry extends SkillEvidence {
  skill: string;
}
