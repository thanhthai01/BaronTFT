'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { searchActions } from '@/content/search-actions';
import styles from './CommandPalette.module.css';

export default function CommandPaletteDialog({
  open,
  onOpenChange,
  groups,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: string[];
}) {
  const router = useRouter();

  return (
    <Command.Dialog
      contentClassName={styles.dialog}
      label="Tìm nhanh"
      open={open}
      onOpenChange={onOpenChange}
      overlayClassName={styles.overlay}
    >
      <Command.Input className={styles.input} placeholder="Tìm bài học, checklist, mùa 18…" />
      <Command.List className={styles.list}>
        <Command.Empty className={styles.empty}>Không tìm thấy hành động phù hợp.</Command.Empty>
        {groups.map((group) => (
          <Command.Group heading={group} key={group} className={styles.groupHeading}>
            {searchActions
              .filter((action) => action.group === group)
              .map((action) => (
                <Command.Item
                  className={styles.item}
                  key={action.id}
                  keywords={action.keywords}
                  value={`${action.label} ${action.description}`}
                  onSelect={() => {
                    onOpenChange(false);
                    router.push(action.href);
                  }}
                >
                  <strong>{action.label}</strong>
                  <span>{action.description}</span>
                </Command.Item>
              ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
