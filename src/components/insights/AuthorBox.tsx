import { Text } from "@/components/ui";

export type AuthorBoxProps = {
  author: string;
  label: string;
};

export function AuthorBox({ author, label }: AuthorBoxProps) {
  return (
    <aside
      className="mt-12 rounded-tile border border-line bg-panel px-5 py-5 sm:px-6"
      aria-label={label}
    >
      <Text variant="caption" as="p" className="font-medium text-text">
        {label}
      </Text>
      <Text className="mt-1 font-semibold text-text">{author}</Text>
    </aside>
  );
}
