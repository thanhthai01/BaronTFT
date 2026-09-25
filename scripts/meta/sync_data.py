"""Đồng bộ data/meta-snapshots với nhánh riêng `meta-snapshots` trên origin.

Vì sao nhánh riêng: routine chạy từ `main` và chỉ mở PR để duyệt. Nếu lần chụp nằm trong PR chưa
merge thì lần chạy sau không thấy nó. Nhánh `meta-snapshots` chỉ chứa dữ liệu (orphan, không có code
site), được tắt deploy trong vercel.json; trên `main` thư mục này bị .gitignore.

  python scripts/meta/sync_data.py pull   # lấy dữ liệu từ origin/meta-snapshots về data/meta-snapshots
  python scripts/meta/sync_data.py push   # đẩy data/meta-snapshots hiện tại lên origin/meta-snapshots
"""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DATA = Path('data/meta-snapshots')
BRANCH = 'meta-snapshots'


def git(*args, cwd=REPO, check=True):
    return subprocess.run(['git', *args], cwd=cwd, check=check, capture_output=True, text=True)


def remote_exists():
    return git('ls-remote', '--exit-code', '--heads', 'origin', BRANCH, check=False).returncode == 0


def pull():
    if not remote_exists():
        print(f'origin/{BRANCH} chưa có — giữ nguyên dữ liệu cục bộ.')
        return
    git('fetch', '-q', 'origin', BRANCH)
    git('checkout', f'origin/{BRANCH}', '--', str(DATA))
    git('reset', '-q', '--', str(DATA))  # bỏ khỏi index: trên main thư mục này bị ignore
    count = len([p for p in (REPO / DATA).iterdir() if (p / 'meta.json').exists()])
    print(f'Đã lấy {count} lần chụp từ origin/{BRANCH}.')


def push(message):
    tmp = Path(tempfile.mkdtemp(prefix='meta-snapshots-'))
    try:
        if remote_exists():
            git('fetch', '-q', 'origin', BRANCH)
            git('worktree', 'add', '--detach', str(tmp), f'origin/{BRANCH}')
        else:
            git('worktree', 'add', '--detach', str(tmp), 'HEAD')
            git('checkout', '-q', '--orphan', f'{BRANCH}-init', cwd=tmp)
            git('rm', '-rq', '--cached', '.', cwd=tmp)
            for child in tmp.iterdir():
                if child.name != '.git':
                    shutil.rmtree(child) if child.is_dir() else child.unlink()
        dest = tmp / DATA
        if dest.exists():
            shutil.rmtree(dest)
        shutil.copytree(REPO / DATA, dest, ignore=shutil.ignore_patterns('__pycache__'))
        git('add', '-f', str(DATA), cwd=tmp)
        if git('diff', '--cached', '--quiet', cwd=tmp, check=False).returncode == 0:
            print('Không có gì mới để đẩy.')
            return
        git('-c', 'user.name=Baron TFT meta routine', '-c', 'user.email=noreply@anthropic.com',
            'commit', '-q', '-m', message, cwd=tmp)
        git('push', '-q', 'origin', f'HEAD:refs/heads/{BRANCH}', cwd=tmp)
        print(f'Đã đẩy lên origin/{BRANCH}: {message}')
    finally:
        git('worktree', 'remove', '--force', str(tmp), check=False)
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    if len(sys.argv) < 2 or sys.argv[1] not in ('pull', 'push'):
        sys.exit(__doc__)
    if sys.argv[1] == 'pull':
        pull()
    else:
        push(sys.argv[2] if len(sys.argv) > 2 else 'Cập nhật lần chụp MetaTFT')
