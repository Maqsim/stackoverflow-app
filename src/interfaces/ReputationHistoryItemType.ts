export type ReputationHistoryItemType = {
  reputation_history_type: 'post_upvoted' | 'answer_accepted';
  reputation_change: number;
  post_id: number;
  creation_date: number;
  user_id: number;
};
