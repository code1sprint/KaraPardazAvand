import { BentoSceneImage } from "@/components/sections/bento/BentoSceneImage";
import { Reveal } from "@/components/layout/Reveal";
import { Tile } from "@/components/visuals/Tile";
import { homeBentoTiles } from "@/content/home-bento";
import { getServiceBySlug, pickLocalized } from "@/content/services";
import type { AppLocale } from "@/i18n/routing";

export type ServicesBentoProps = {
  locale: AppLocale;
};

export async function ServicesBento({ locale }: ServicesBentoProps) {
  const tiles = homeBentoTiles
    .map((tile) => {
      const service = getServiceBySlug(tile.slug);
      if (!service) return null;
      return {
        ...tile,
        title: pickLocalized(tile.title, locale),
        description: pickLocalized(service.outcome, locale),
        href: `/services/${service.slug}`,
      };
    })
    .filter((tile): tile is NonNullable<typeof tile> => tile !== null);

  if (tiles.length === 0) return null;

  return (
    <Reveal>
      <div className="grid grid-cols-6 gap-4">
        {tiles.map((tile) => {
          const visual = (
            <BentoSceneImage
              src={tile.image}
              className={tile.dark ? "md:h-[200px]" : undefined}
            />
          );
          const isWideDark = Boolean(tile.dark);

          return (
            <Tile
              key={tile.slug}
              span={tile.span}
              dark={tile.dark}
              href={tile.href}
              linkLabel={tile.title}
              title={isWideDark ? undefined : tile.title}
              description={isWideDark ? undefined : tile.description}
              visual={isWideDark ? undefined : visual}
              className={
                isWideDark
                  ? "min-h-[280px] md:grid md:grid-cols-[1fr_1.2fr] md:items-center md:gap-7"
                  : undefined
              }
            >
              {isWideDark ? (
                <>
                  <div>
                    <h3 className="m-0 mb-1.5 text-[21px] font-extrabold">
                      {tile.title}
                    </h3>
                    <p className="m-0 max-w-[34ch] text-[14.5px] text-band-muted">
                      {tile.description}
                    </p>
                  </div>
                  <div className="mt-6 md:mt-0">{visual}</div>
                </>
              ) : null}
            </Tile>
          );
        })}
      </div>
    </Reveal>
  );
}
