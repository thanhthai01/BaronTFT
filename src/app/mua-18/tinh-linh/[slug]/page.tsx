import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WispCard } from '@/components/features/season-18/cards/WispCard';
import { EntityDetailShell } from '@/components/features/season-18/cards/EntityDetailShell';
import { RelatedEntityLink } from '@/components/features/season-18/cards/RelatedEntityLink';
import { RelatedGrid } from '@/components/features/season-18/cards/RelatedGrid';
import { set18Wisps } from '@/content/set18/set18-wisps';
import { getWispBySlug, getWispSlug } from '@/content/set18/set18-lookup';
import { set18Slugs } from '@/content/set18/set18-slugs.generated';

export function generateStaticParams() {
  return set18Slugs.filter((entry) => entry.kind === 'wisp').map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const wisp = getWispBySlug(slug);
  if (!wisp) return {};
  const description = `${wisp.nameVi} (${wisp.name}) — Tinh Linh nhóm ${wisp.categoryVi}. ${wisp.descriptionVi}`.slice(0, 300);
  return {
    title: `${wisp.nameVi} — Tinh Linh Mùa 18`,
    description,
    alternates: { canonical: `/mua-18/tinh-linh/${slug}` },
    openGraph: { title: `${wisp.nameVi} — Tinh Linh Mùa 18`, description, images: [wisp.categoryIcon] },
  };
}

export default async function WispDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wisp = getWispBySlug(slug);
  if (!wisp) notFound();

  const related = set18Wisps.filter((other) => other !== wisp && other.category === wisp.category).slice(0, 12);

  return (
    <EntityDetailShell
      breadcrumbHref="/mua-18/tinh-linh"
      canonicalPath={`/mua-18/tinh-linh/${slug}`}
      breadcrumbLabel="Tinh Linh"
      card={<WispCard wisp={wisp} />}
      description={`Nhóm ${wisp.categoryVi}${wisp.cost !== null ? ` · ${wisp.cost} vàng` : ''}`}
      eyebrow="Mùa 18 · Tinh Linh"
      related={
        related.length ? (
          <RelatedGrid variant="wisp">
            {related.map((other) => {
              const otherSlug = getWispSlug(other);
              if (!otherSlug) return null;
              return (
                <RelatedEntityLink
                  href={`/mua-18/tinh-linh/${otherSlug}`}
                  image={other.categoryIcon}
                  key={otherSlug}
                  meta={other.cost !== null ? `${other.cost} vàng` : undefined}
                  name={other.nameVi}
                />
              );
            })}
          </RelatedGrid>
        ) : (
          <p>Không có Tinh Linh khác cùng nhóm.</p>
        )
      }
      relatedTitle={`Tinh Linh cùng nhóm ${wisp.categoryVi}`}
      title={wisp.nameVi}
    />
  );
}
