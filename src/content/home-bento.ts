import { getHomeBentoTiles } from "@/content/services";

export type HomeBentoTile = {
  slug: string;
  /** Matches Tile span tokens (2 | 4 | 6 for this bento). */
  span: 2 | 4 | 6;
  /** Decorative scene under `/public`. */
  image: string;
  dark?: boolean;
  /** Short bento title (may differ from full service title). */
  title: { fa: string; en: string };
};

/**
 * Home / services overview bento — derived from each service file's `bento` field.
 * Adding a service with `bento` automatically adds a tile.
 */
export const homeBentoTiles: readonly HomeBentoTile[] = getHomeBentoTiles();
