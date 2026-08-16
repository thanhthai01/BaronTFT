# Thiet ke lai trai nghiem doc Kien thuc nen tang

## Muc tieu

Thiet ke lai route `/kien-thuc-nen-tang/[slug]` de noi dung chinh luon la diem nhin uu tien. Trang can de doc lien tuc tren desktop, tablet va mobile, nhung van giu ban sac risograph zine cua Baron TFT.

Thanh cong duoc danh gia theo cac tieu chi sau:

- Cot doc chinh co do rong va do dai dong on dinh, khong bi hai sidebar chen hep.
- Chu than bai dat khoang 17-18px tren desktop, line-height 1.7-1.8, va khong bi giam qua nho tren mobile.
- Noi dung ly thuyet doc nhu mot bai viet lien tuc; chi cac khoi mang y nghia dac biet moi dung khung nen.
- Muc luc bai hoc, muc luc trong bai va cac hanh dong ap dung van de tim, nhung khong tranh su chu y voi bai viet.
- Nguoi dung co the bao quat cau truc bai va nhay den muc can doc tren moi kich thuoc man hinh.
- Mau sac, typography, duong vien va spot-ink accents van nhat quan voi Baron TFT.

## Huong thiet ke

Chon huong **Editorial Focus**. Mau tuong tac tham khao cac trinh doc noi dung nhu Medium va Notion, ket hop kha nang dinh huong cua tai lieu nhu GitBook, nhung khong sao chep giao dien cua san pham nao.

Trang khong co cong tac bat/tat che do tap trung. Bo cuc tot cho viec doc la trang thai mac dinh duy nhat, giam so luong dieu khien va tranh buoc nguoi dung phai tu sua mot giao dien chua toi uu.

## Kien truc bo cuc

### Masthead bai viet

- Gop module, tieu de, tom tat, thoi luong, ky nang va bai tap vao mot masthead duy nhat.
- Loai bo viec lap tom tat giua header route va `KnowledgeReader`.
- H1 van la tieu de bai de giu cau truc SEO va accessibility.
- Masthead dung nen giay, duong vien va mot diem nhan cobalt/orange vua du, khong tao hero marketing.

### Cot doc chinh

- Dat cot bai viet o trung tam, do rong toi da khoang 46-49rem.
- Than bai dung font body hien co, co chu co so 1.0625-1.125rem va line-height khoang 1.75.
- Khoang cach giua cac doan, danh sach va de muc tuan theo nhip doc nhat quan.
- Bo vien card quanh moi block ly thuyet. Cac block concept va principles tro thanh section tren cung mot mat giay.
- Giu khung rieng cho scenario, matrix, pitfalls, drill va checklist vi chung mang nghia so sanh, canh bao hoac thuc hanh.
- Khong long card ben trong card.

### Dieu huong phu

- Desktop rong: danh sach bai hoc nam trong mot rail hep ben trai; rail chi hien thong tin can de doi bai va co the cuon doc lap khi danh sach dai.
- Muc luc trong bai nam o rail ben phai o trang thai gon, dung scrollspy hien co de danh dau muc dang doc.
- Cac rail khong dung be mat card noi bat; duong vien va mau active du de phan biet.
- Tablet va mobile: thay hai rail bang mot thanh cong cu gon o dau bai gom nut mo danh sach bai va nut mo muc luc bai.
- Panel mobile mo dang drawer/dialog, co nut dong ro rang, dong bang Escape, khoa focus trong panel va tra focus ve nut da mo.
- Khong them che do focus, preference hoac localStorage.

### Hanh dong va noi dung lien quan

- `Ap dung ngay` khong xuat hien truoc noi dung chinh tren mobile.
- Cac nut checklist va VOD review duoc dat sau noi dung bai, gan khu vuc bai lien quan/doc tiep.
- Bai lien quan va doc tiep nang cao duoc trinh bay nhu dieu huong cuoi bai, khong phai chip noi bat rai rac.

## He thong thi giac Baron TFT

- Giu nen ivory, ink-black text, cobalt la accent chinh va fluoro-orange la accent phu.
- Giu font display/body hien co cua website; heading viet hoa nhu quy uoc thuong hieu, than bai sentence case.
- Dung hard offset shadow co chon loc o masthead hoac callout, khong lap tren moi section.
- Giu hex motif o icon/marker nho, khong them logo hay tai san Riot.
- Khong dung gradient trang tri, glow, orb, anh stock hoac animation lien tuc.

## Responsive

- Tren man hinh rong, shell co ba vung nhung hai rail co kich thuoc kiem che; cot doc khong bi co nho duoi nguong de doc.
- Khi viewport khong du cho cot doc va hai rail, rail bien mat va thanh cong cu mobile xuat hien.
- Mobile dung mot cot, padding ngang 16-20px, co chu than bai toi thieu 16px va target tuong tac toi thieu 44px.
- Bang, ma tran va code block co co che reflow hoac cuon ngang cuc bo, khong gay tran trang.

## Accessibility

- Duy tri landmarks `article`, `aside`, heading hierarchy va `aria-current` cho scrollspy.
- Drawer dung semantics dialog, co accessible name, focus management va Escape handling.
- Focus ring dung token cyan/cobalt hien co voi contrast ro.
- Khong dung mau lam dau hieu duy nhat cho muc active.
- Ton trong `prefers-reduced-motion`; chuyen dong neu co chi la transition ngan cho drawer va hover.

## Pham vi ma nguon

Du kien chinh sua:

- `src/app/kien-thuc-nen-tang/[slug]/page.tsx`
- `src/app/kien-thuc-nen-tang/page.module.css`
- `src/components/features/knowledge-reader/KnowledgeReader.tsx`
- `src/components/features/knowledge-reader/KnowledgeReader.module.css`
- Test co lien quan trong `tests/e2e/`

Khong sua generated content, database, canonical URL, metadata schema hoac noi dung bai viet.

## Kiem thu va chap nhan

- TypeScript, unit test, lint cac file thay doi va production build phai qua.
- Playwright kiem tra desktop va mobile cho route dai `level-roll-outs-va-breakpoint`.
- Kiem tra bang screenshot tai it nhat 1440px, 1024px, 768px va 390px.
- Chay axe tren route bai viet va xu ly cac vi pham nghiem trong lien quan den thay doi.
- Kiem tra thu cong: chuyen bai, jump link, scrollspy, mo/dong drawer, Escape, focus return, khong co horizontal overflow va noi dung chinh khong bi che.

## Ngoai pham vi

- Khong viet lai noi dung bai.
- Khong them reading preference, font-size control, dark mode hoac progress persistence.
- Khong thay doi navigation toan site.
- Khong them animation GSAP, anh minh hoa hoac asset moi cho trang doc.
