import type { QuizQuestion } from "@/lib/types";
import { australiaPeople } from "./categories/australia-people";
import { democraticBeliefs } from "./categories/democratic-beliefs";
import { governmentLaw } from "./categories/government-law";
import { australianValues } from "./categories/australian-values";

export const questionBank: QuizQuestion[] = [
  ...australiaPeople,
  ...democraticBeliefs,
  ...governmentLaw,
  ...australianValues
];
