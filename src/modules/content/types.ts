import type { ExperiencesQueryResult, PageQueryResult } from "./sanity.types";

export type Section = NonNullable<NonNullable<PageQueryResult>["sections"]>[number];
export type SectionOf<T extends Section["_type"]> = Extract<Section, { _type: T }>;
export type ExperienceCardData = ExperiencesQueryResult[number];
export type DestinationCardData = NonNullable<SectionOf<"destinationCardsBlock">["items"]>[number];
