export type TagPreferenceType = {
  tag_preference_type: 'favorite_tag' | 'ignored_tag';
  user_id: number;
  tag_name: string;
};
