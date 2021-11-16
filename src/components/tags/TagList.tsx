import { Tag } from './Tag';

type Props = {
  tags: string[];
  isRemovable?: boolean;
  onRemove?: (tag: string) => void;
};

export function TagList({ tags, isRemovable, onRemove }: Props) {
  return (
    <>
      {tags.map((tag) => (
        <Tag isRemovable={isRemovable} onRemove={onRemove} key={tag}>
          {tag}
        </Tag>
      ))}
    </>
  );
}
