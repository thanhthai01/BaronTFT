import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TraitCard } from '@/components/features/season-18/cards/TraitCard';
import { EntityDetailShell } from '@/components/features/season-18/cards/EntityDetailShell';
import { LatestPatchNote } from '@/components/features/season-18/cards/LatestPatchNote';
import { RelatedEntityLink } from '@/components/features/season-18/cards/RelatedEntityLink';
import { RelatedGrid } from '@/components/features/season-18/cards/RelatedGrid';
import { RelatedTips } from '@/components/features/season-18/cards/RelatedTips';
import { set18ChampionByName } from '@/content/set18/set18-champions';
import { getChampionSlug, getTraitBySlug } from '@/content/set18/set18-lookup';
import { set18Slugs } from '@/content/set18/set18-slugs.generated';

export function generateStaticParams() {
  return set18Slugs.filter((entry) => entry.kind === 'trait').map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const trait = getTraitBySlug(slug);
  if (!trait) return {};
  const description = `${trait.vi} (${trait.name}) — ${trait.typeVi}, mốc ${trait.breaksLabel}. ${trait.descriptionVi || trait.description}`.slice(0, 300);
  return {
    title: `${trait.vi} — Tộc hệ Mùa 18`,
    description,
    alternates: { canonical: `/mua-18/toc-he/${slug}` },
    openGraph: { title: `${trait.vi} — Tộc hệ Mùa 18`, description, images: [trait.icon] },
  };
}

export default async function TraitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trait = getTraitBySlug(slug);
  if (!trait) notFound();

  const entityId = set18Slugs.find((entry) => entry.kind === 'trait' && entry.slug === slug)?.id;

  const memberChampions = trait.champions
    .map((name) => set18ChampionByName.get(name))
    .filter((champion): champion is NonNullable<typeof champion> => Boolean(champion));

  return (
    <EntityDetailShell
      breadcrumbHref="/mua-18/chi-tiet-toc-he"
      canonicalPath={`/mua-18/toc-he/${slug}`}
      breadcrumbLabel="Chi tiết tộc hệ"
      card={
        <TraitCard
          championNames={[]}
          renderChampion={() => null}
          trait={trait}
        />
      }
      description={`${trait.typeVi} · Mốc ${trait.breaksLabel} · ${trait.champions.length} tướng`}
      eyebrow="Mùa 18 · Tộc hệ"
      patchNote={
        entityId ? (
          <>
            <LatestPatchNote entityId={entityId} />
            <RelatedTips entityId={entityId} />
          </>
        ) : null
      }
      related={
        memberChampions.length ? (
          <RelatedGrid>
            {memberChampions.map((champion) => {
              const championSlug = getChampionSlug(champion);
              if (!championSlug) return null;
              return (
                <RelatedEntityLink
                  href={`/mua-18/tuong/${championSlug}`}
                  image={champion.image}
                  key={champion.name}
                  meta={champion.costLabel}
                  name={champion.name}
                />
              );
            })}
          </RelatedGrid>
        ) : (
          <p>Chưa có tướng nào mang tộc/hệ này.</p>
        )
      }
      relatedTitle={`${trait.champions.length} tướng thuộc ${trait.vi}`}
      title={`${trait.vi} (${trait.name})`}
    />
  );
}
