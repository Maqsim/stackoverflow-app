import { Tag } from './Tag';

type Props = {
  tags: string[];
};

export function TagList({ tags }: Props) {
  return (
    <>
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </>
  );
}
