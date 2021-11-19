import { FeaturesEnum } from '../interfaces/FeaturesEnum';

const repToFeatures: { [reputation: number]: FeaturesEnum[] } = {
  1: [FeaturesEnum.CREATE_POSTS],
  10: [FeaturesEnum.ANSWER_PROTECTED_QUESTIONS],
  15: [FeaturesEnum.FLAG_POSTS, FeaturesEnum.VOTE_UP],
  50: [FeaturesEnum.COMMENT],
  125: [FeaturesEnum.VOTE_DOWN],
  1500: [FeaturesEnum.CREATE_TAGS],
  2000: [FeaturesEnum.EDIT_POSTS]
};

export function makeFeatureList(reputation: number): FeaturesEnum[] {
  const result: FeaturesEnum[] = [];

  Object.entries(repToFeatures).forEach(([threshold, features]) => {
    if (parseInt(threshold, 10) <= reputation) {
      result.push(...features);
    }
  });

  return result;
}
