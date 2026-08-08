import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChampionCard } from '@/components/features/season-18/cards/ChampionCard';
import { EntityDetailShell } from '@/components/features/season-18/cards/EntityDetailShell';
import { LatestPatchNote } from '@/components/features/season-18/cards/LatestPatchNote';
import { RelatedEntityLink } from '@/components/features/season-18/cards/RelatedEntityLink';
import { RelatedGrid } from '@/components/features/season-18/cards/RelatedGrid';
import { RelatedTips } from '@/components/features/season-18/cards/RelatedTips';
import { set18Champions } from '@/content/set18/set18-champions';
import { set18TraitByName } from '@/content/set18/set18-traits';
import { getChampionBySlug, getChampionSlug } from '@/content/set18/set18-lookup';
import { set18Slugs } from '@/content/set18/set18-slugs.generated';

export function generateStaticParams() {
  return set18Slugs.filter((entry) => entry.kind === 'champion').map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const champion = getChampionBySlug(slug);
  if (!champion) return {};
  const traitsVi = champion.traits.map((name) => set18TraitByName.get(name)?.vi ?? name).join(', ');
  const description = `${champion.name} — ${champion.costLabel}, ${champion.role}. Tộc/hệ: ${traitsVi}. Kỹ năng: ${champion.abilityNameVi || champion.abilityName}.`;
  return {
    title: `${champion.name} — Mùa 18`,
    description,
    alternates: { canonical: `/mua-18/tuong/${slug}` },
    openGraph: { title: `${champion.name} — Mùa 18`, description, images: [champion.image] },
  };
}

export default async function ChampionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const champion = getChampionBySlug(slug);
  if (!champion) notFound();

  const entityId = set18Slugs.find((entry) => entry.kind === 'champion' && entry.slug === slug)?.id;

  const related = set18Champions
    .filter((other) => other.name !== champion.name && other.traits.some((t) => champion.traits.includes(t)))
    .slice(0, 12);

  return (
    <EntityDetailShell
      breadcrumbHref="/mua-18/chi-tiet-tuong"
      canonicalPath={`/mua-18/tuong/${slug}`}
      breadcrumbLabel="Chi tiết tướng"
      card={<ChampionCard champion={champion} traitByName={set18TraitByName} />}
      description={`${champion.costLabel} · ${champion.role} · Kỹ năng: ${champion.abilityNameVi || champion.abilityName}`}
      eyebrow="Mùa 18 · Tướng"
      patchNote={
        entityId ? (
          <>
            <LatestPatchNote entityId={entityId} />
            <RelatedTips entityId={entityId} />
          </>
        ) : null
      }
      related={
        related.length ? (
          <RelatedGrid>
            {related.map((other) => {
              const otherSlug = getChampionSlug(other);
              if (!otherSlug) return null;
              return (
                <RelatedEntityLink
                  href={`/mua-18/tuong/${otherSlug}`}
                  image={other.image}
                  key={other.name}
                  meta={other.costLabel}
                  name={other.name}
                />
              );
            })}
          </RelatedGrid>
        ) : (
          <p>Không có tướng nào cùng tộc/hệ.</p>
        )
      }
      relatedTitle="Tướng cùng tộc/hệ"
      title={champion.name}
    />
  );
}
