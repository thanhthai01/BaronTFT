import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AugmentCard } from '@/components/features/season-18/cards/AugmentCard';
import { EntityDetailShell } from '@/components/features/season-18/cards/EntityDetailShell';
import { RelatedEntityLink } from '@/components/features/season-18/cards/RelatedEntityLink';
import { RelatedGrid } from '@/components/features/season-18/cards/RelatedGrid';
import { set18Augments } from '@/content/set18/set18-augments';
import { getAugmentBySlug, getAugmentSlug } from '@/content/set18/set18-lookup';
import { set18Slugs } from '@/content/set18/set18-slugs.generated';

export function generateStaticParams() {
  return set18Slugs.filter((entry) => entry.kind === 'augment').map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const augment = getAugmentBySlug(slug);
  if (!augment) return {};
  const description = `${augment.nameVi} (${augment.name}) — Nâng cấp ${augment.rarity}, nhóm ${augment.categoryVi}. ${augment.descriptionVi}`.slice(0, 300);
  return {
    title: `${augment.nameVi} — Nâng cấp Mùa 18`,
    description,
    alternates: { canonical: `/mua-18/nang-cap/${slug}` },
    openGraph: { title: `${augment.nameVi} — Nâng cấp Mùa 18`, description, images: [augment.icon] },
  };
}

export default async function AugmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const augment = getAugmentBySlug(slug);
  if (!augment) notFound();

  const related = set18Augments.filter((other) => other !== augment && other.category === augment.category).slice(0, 12);

  return (
    <EntityDetailShell
      breadcrumbHref="/mua-18/nang-cap"
      canonicalPath={`/mua-18/nang-cap/${slug}`}
      breadcrumbLabel="Nâng cấp"
      card={<AugmentCard augment={augment} />}
      description={`${augment.rarity} · ${augment.categoryVi}`}
      eyebrow="Mùa 18 · Nâng cấp"
      related={
        related.length ? (
          <RelatedGrid variant="augment">
            {related.map((other) => {
              const otherSlug = getAugmentSlug(other);
              if (!otherSlug) return null;
              return (
                <RelatedEntityLink
                  href={`/mua-18/nang-cap/${otherSlug}`}
                  image={other.icon}
                  key={otherSlug}
                  meta={other.rarity}
                  name={other.nameVi}
                />
              );
            })}
          </RelatedGrid>
        ) : (
          <p>Không có nâng cấp khác cùng phân loại.</p>
        )
      }
      relatedTitle={`Nâng cấp cùng nhóm ${augment.categoryVi}`}
      title={augment.nameVi}
    />
  );
}
