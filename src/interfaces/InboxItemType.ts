export type InboxItemType = {
  site: {
    favicon_url: string;
    name: string;
  };
  is_unread: false;
  creation_date: number;
  comment_id: number;
  question_id: number;
  item_type: string;
  link: string;
  body: string;
  title: string;
};
