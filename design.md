# CTECH ERP — Visual Design System

## 01. Design Direction

CTECH ERP menggunakan pendekatan **Corporate Editorial UI** yang memadukan karakter perusahaan creative agency dengan tampilan enterprise software yang profesional.

Tujuan visual:

- Clean
- Corporate
- Modern
- Precise
- Calm
- Professional
- Functional
- Consistent

Desain harus terasa seperti aplikasi internal perusahaan yang benar-benar digunakan untuk pekerjaan sehari-hari, bukan template dashboard SaaS, landing page, atau konsep UI hasil AI.

### Design Statement

> **Professional software with a creative agency character.**

Karakter creative agency ditampilkan melalui **typography, composition, spacing, dan detail visual**, bukan melalui dekorasi berlebihan.

---

# 02. Core Visual Principle

Prioritaskan:

1. Hierarchy
2. Readability
3. Consistency
4. Alignment
5. Spacing
6. Information density
7. Subtle visual details

Hindari penggunaan elemen visual hanya untuk membuat interface terlihat "lebih keren".

Setiap elemen harus memiliki alasan visual yang jelas.

---

# 03. Anti AI-Slop

Desain TIDAK boleh menggunakan:

- Glassmorphism
- Background gradient besar
- Neon effect
- Glow effect
- 3D illustration
- Floating blobs
- Excessive rounded cards
- Excessive shadows
- Huge typography
- Decorative dashboard illustrations
- Emoji sebagai UI element
- Gradient button
- Gradient text
- Banyak warna dalam satu halaman
- Card dengan warna berbeda-beda
- Icon berukuran besar sebagai dekorasi
- Excessive animation
- Excessive micro-interaction
- Layout yang terlalu simetris dan generik
- Komponen dengan `border-radius: 24px` atau lebih
- Semua informasi dipaksa masuk ke dalam card

### Visual Philosophy

Gunakan:

> **Structure over decoration.**

---

# 04. Color System

Gunakan warna corporate yang restrained.

## Primary

```text
Primary Blue
#155EEF
```

Digunakan untuk:

- Primary action
- Active state
- Link
- Selected state
- Focus state

## Dark Primary

```text
#0B3B8F
```

Digunakan secara terbatas untuk emphasis.

## Main Text

```text
#101828
```

## Secondary Text

```text
#475467
```

## Muted Text

```text
#667085
```

## Background

```text
#F8FAFC
```

## Surface

```text
#FFFFFF
```

## Border

```text
#E4E7EC
```

---

# 05. Semantic Colors

Gunakan warna status secara konsisten.

### Success

```text
#12B76A
```

### Warning

```text
#F79009
```

### Danger

```text
#F04438
```

### Information

```text
#2E90FA
```

Semantic color hanya digunakan ketika memiliki makna.

Jangan menggunakan warna tersebut sebagai dekorasi.

---

# 06. Color Usage Ratio

Gunakan prinsip:

```text
80% Neutral
15% Dark / Text
5% Accent
```

Sebagian besar interface harus tetap neutral.

Primary blue hanya menjadi aksen visual.

Jangan membuat seluruh halaman berwarna biru.

---

# 07. Typography

Gunakan:

```text
Inter
```

Fallback:

```text
system-ui
-apple-system
BlinkMacSystemFont
"Segoe UI"
sans-serif
```

Typography harus terlihat profesional dan netral.

### Font Weight

Gunakan hanya:

```text
400 Regular
500 Medium
600 Semibold
```

Hindari penggunaan bold berlebihan.

---

# 08. Typography Scale

### Page Title

```text
24px
Line height: 32px
Weight: 600
```

### Section Heading

```text
18px
Line height: 28px
Weight: 600
```

### Component Heading

```text
15px
Line height: 22px
Weight: 600
```

### Body

```text
14px
Line height: 22px
Weight: 400
```

### Small Text

```text
13px
Line height: 20px
```

### Caption

```text
12px
Line height: 18px
```

---

# 09. Typography Character

Typography harus memiliki hierarchy yang jelas.

Contoh:

```text
Page Title
24px / 600

Supporting description
14px / 400

Section title
18px / 600

Body content
14px / 400

Metadata
12–13px / 400
```

Jangan membuat semua teks memiliki ukuran yang sama.

Namun jangan pula menggunakan terlalu banyak ukuran font.

---

# 10. Layout

Gunakan layout berbasis grid dengan alignment yang konsisten.

Semua elemen harus memiliki garis alignment yang jelas.

Contoh prinsip:

```text
┌────────────────────────────────────────────┐
│                                            │
│ Page Title                                 │
│ Supporting information                     │
│                                            │
│ ────────────────────────────────────────── │
│                                            │
│ Content                                    │
│                                            │
└────────────────────────────────────────────┘
```

Gunakan whitespace sebagai bagian dari desain.

Whitespace bukan ruang kosong yang harus selalu diisi.

---

# 11. Spacing System

Gunakan kelipatan 4px.

```text
4
8
12
16
20
24
32
40
48
64
```

### Default

```text
Page padding: 24px
Section spacing: 32px
Component gap: 16px
Small gap: 8px
```

Jangan menggunakan spacing secara acak.

---

# 12. Border Radius

Gunakan radius kecil dan konsisten.

```text
Input       6px
Button      6px
Card        8px
Modal       10px
Dropdown    8px
```

Badge boleh menggunakan:

```text
999px
```

Jangan menggunakan radius besar pada container utama.

---

# 13. Borders

Border merupakan salah satu elemen visual utama.

Default:

```text
1px solid #E4E7EC
```

Gunakan border untuk:

- Memisahkan section
- Membentuk table
- Membatasi input
- Membatasi card
- Membuat hierarchy

Border harus subtle.

Hindari border hitam yang terlalu kontras.

---

# 14. Shadows

Shadow harus sangat minimal.

Default component:

```text
box-shadow: none;
```

Elevation hanya digunakan untuk:

- Dropdown
- Popover
- Modal
- Floating element

Shadow harus terasa natural dan hampir tidak terlihat.

---

# 15. Surface Hierarchy

Gunakan tiga level visual:

```text
Background
#F8FAFC

Surface
#FFFFFF

Elevated Surface
#FFFFFF + subtle shadow
```

Jangan menggunakan banyak warna background.

Hierarchy dibangun dengan:

```text
background
border
spacing
typography
```

bukan dengan banyak warna.

---

# 16. Cards

Card digunakan hanya ketika informasi memang perlu dikelompokkan.

Style:

```text
background: #FFFFFF
border: 1px solid #E4E7EC
border-radius: 8px
```

Padding:

```text
20px
```

Card tidak boleh terlihat seperti floating object.

Hindari:

```text
Huge radius
Heavy shadow
Gradient background
Large icon
Decorative illustration
```

---

# 17. Tables

Table harus menjadi salah satu elemen visual paling kuat dalam ERP.

Style:

```text
Header:
13px / 500

Body:
14px / 400

Row:
48–56px
```

Table:

- Clean
- Compact
- Readable
- Consistent

Gunakan border tipis.

Hover state:

```text
#F9FAFB
```

Jangan menggunakan zebra striping yang terlalu kontras.

---

# 18. Buttons

Button harus terlihat seperti bagian dari sistem enterprise.

### Primary

```text
Background: #155EEF
Text: #FFFFFF
Height: 40px
Radius: 6px
```

### Secondary

```text
Background: #FFFFFF
Border: #D0D5DD
Text: #344054
Height: 40px
Radius: 6px
```

### Ghost

```text
Background: transparent
Text: #475467
```

Button tidak boleh menggunakan gradient.

---

# 19. Button Hierarchy

Dalam satu area:

```text
Primary Action
Secondary Action
Tertiary Action
```

Jangan membuat semua button menjadi primary.

Contoh:

```text
[Primary Action] [Secondary] [More]
```

Visual hierarchy harus langsung terlihat.

---

# 20. Inputs

Input harus terlihat sederhana dan solid.

```text
Height: 40px

Background:
#FFFFFF

Border:
#D0D5DD

Radius:
6px

Text:
14px
```

Focus:

```text
Border:
#155EEF

Focus ring:
subtle
```

Placeholder:

```text
#98A2B3
```

---

# 21. Labels

Label:

```text
13px
Weight: 500
Color: #344054
```

Jarak label ke input:

```text
6–8px
```

Jangan menggunakan label yang terlalu kecil.

---

# 22. Badges

Badge digunakan untuk status.

Style:

```text
font-size: 12px
font-weight: 500
padding: 4px 8px
border-radius: 999px
```

Gunakan background warna yang sangat soft.

Contoh:

```text
Success
#ECFDF3
#027A48

Warning
#FFFAEB
#B54708

Danger
#FEF3F2
#B42318

Neutral
#F2F4F7
#344054

Info
#EFF8FF
#175CD3
```

---

# 23. Icons

Gunakan satu icon style.

Recommended:

```text
Lucide
```

Icon harus memiliki stroke yang konsisten.

Ukuran:

```text
16px
18px
20px
```

Default:

```text
18px
```

Icon tidak digunakan sebagai dekorasi besar.

---

# 24. Icon Color

Default:

```text
#667085
```

Active:

```text
#155EEF
```

Danger:

```text
#F04438
```

Success:

```text
#12B76A
```

Jangan memberikan warna berbeda pada setiap icon.

---

# 25. Navigation Visual Style

Navigation harus:

- Compact
- Calm
- Clear
- Consistent

Active state menggunakan:

```text
Background: #EFF4FF
Text: #155EEF
```

Tidak menggunakan:

```text
gradient
glow
large pill
heavy shadow
```

---

# 26. Header Visual

Header harus memiliki hierarchy yang sederhana.

```text
Title

Supporting description

Actions
```

Tidak perlu hero section.

Tidak perlu background image.

Tidak perlu gradient.

Tidak perlu illustration.

---

# 27. Search Field

Search menggunakan desain minimal.

```text
Height: 40px
Background: #FFFFFF
Border: #D0D5DD
Radius: 6px
```

Icon search:

```text
18px
#667085
```

Placeholder:

```text
Search...
```

---

# 28. Dropdown

Dropdown:

```text
Background: #FFFFFF
Border: #E4E7EC
Radius: 8px
```

Shadow:

```text
Subtle
```

Item:

```text
Height: 36–40px
Padding: 8px 12px
```

Selected:

```text
Background: #F2F4F7
```

---

# 29. Modal

Modal harus compact.

```text
Background: #FFFFFF
Radius: 10px
```

Header:

```text
Title
Description
Close
```

Content:

```text
Form / Information
```

Footer:

```text
Secondary Action
Primary Action
```

Jangan membuat modal dengan radius ekstrem atau shadow berat.

---

# 30. Empty State

Empty state harus minimal.

```text
No data available

There is currently no information to display.

[Primary Action]
```

Tidak perlu ilustrasi besar.

Tidak perlu artwork dekoratif.

---

# 31. Loading State

Gunakan skeleton.

Skeleton:

```text
Background:
#EAECF0
```

Gunakan animasi shimmer yang sangat subtle jika diperlukan.

Hindari spinner pada seluruh halaman jika skeleton dapat digunakan.

---

# 32. Toast / Notification

Toast harus compact.

Contoh visual:

```text
┌──────────────────────────────────┐
│ ✓  Changes saved successfully    │
└──────────────────────────────────┘
```

Tidak menggunakan:

- gradient
- illustration
- oversized icon

---

# 33. Animation

Animation harus subtle.

Gunakan:

```text
150–200ms
```

untuk:

- Hover
- Focus
- Dropdown
- Modal
- State change

Hindari:

- Bounce
- Zoom besar
- Parallax
- Floating animation
- Excessive transition

ERP harus terasa cepat.

---

# 34. Hover State

Hover tidak boleh mengubah komponen secara drastis.

Contoh:

```text
Default:
#FFFFFF

Hover:
#F9FAFB
```

Button:

```text
Primary hover:
slightly darker blue
```

Tidak menggunakan glow.

---

# 35. Focus State

Semua interactive element harus memiliki focus state.

Gunakan:

```text
Primary blue
+
subtle focus ring
```

Focus harus terlihat tetapi tetap corporate.

---

# 36. Disabled State

Disabled:

```text
Background: #F2F4F7
Text: #98A2B3
Border: #EAECF0
```

Opacity jangan terlalu rendah sehingga sulit dibaca.

---

# 37. Responsive Visual Behavior

Desktop menjadi baseline.

Pada layar lebih kecil:

- Spacing dikurangi
- Columns dapat collapse
- Table dapat menjadi horizontally scrollable
- Sidebar dapat collapse
- Card dapat menjadi full width
- Typography tetap readable

Jangan membuat mobile layout dengan terlalu banyak perubahan visual.

---

# 38. Density

CTECH ERP menggunakan:

> **Medium Information Density**

Bukan:

> Spacious Marketing UI

dan bukan:

> Extremely Dense Legacy ERP

Target visual:

```text
Enough information
+
Enough whitespace
+
Clear hierarchy
```

---

# 39. Visual Hierarchy

Setiap halaman harus memiliki urutan visual:

```text
1. What page am I on?
2. What is important?
3. What can I do?
4. What information do I need?
5. What is secondary?
```

Gunakan:

```text
Size
Weight
Spacing
Color
Position
```

untuk menciptakan hierarchy.

---

# 40. Alignment

Alignment harus konsisten.

Gunakan:

```text
Left aligned
```

untuk sebagian besar informasi.

Angka dalam table dapat menggunakan:

```text
Right aligned
```

Action dapat menggunakan:

```text
Right aligned
```

Jangan mencampur alignment tanpa alasan.

---

# 41. Visual Rhythm

Interface harus memiliki ritme visual yang konsisten.

Contoh:

```text
Title
↓ 8px
Description
↓ 24px
Content
↓ 16px
Component
```

Jangan menggunakan spacing acak antar section.

---

# 42. Background Treatment

Background utama:

```text
#F8FAFC
```

Surface:

```text
#FFFFFF
```

Tidak menggunakan:

```text
Gradient background
Pattern
Noise texture
Illustration
Blur
Glow
```

Background harus tenang agar data menjadi fokus.

---

# 43. Creative Agency Character

Karakter creative agency tidak ditampilkan melalui dekorasi.

Gunakan:

### Typography

Sedikit lebih editorial.

### Composition

Gunakan whitespace dan alignment yang intentional.

### Color

Corporate blue sebagai aksen.

### Details

Border, icon, spacing, dan micro-interaction yang sangat rapi.

### Result

Interface tetap corporate tetapi tidak terasa seperti software accounting lama.

---

# 44. Design Tokens

Gunakan token berikut sebagai baseline:

```css
:root {
  --color-primary: #155EEF;
  --color-primary-dark: #0B3B8F;

  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;

  --color-border: #E4E7EC;

  --color-text: #101828;
  --color-text-secondary: #475467;
  --color-text-muted: #667085;

  --color-success: #12B76A;
  --color-warning: #F79009;
  --color-danger: #F04438;
  --color-info: #2E90FA;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 10px;

  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
}
```

---

# 45. Final Visual Checklist

Sebelum sebuah komponen dianggap selesai, pastikan:

- [ ] Tidak menggunakan gradient yang tidak diperlukan.
- [ ] Tidak menggunakan glassmorphism.
- [ ] Tidak menggunakan shadow berlebihan.
- [ ] Border radius konsisten.
- [ ] Typography memiliki hierarchy.
- [ ] Spacing menggunakan sistem 4px.
- [ ] Warna tetap restrained.
- [ ] Primary blue hanya digunakan sebagai accent.
- [ ] Icon menggunakan satu style.
- [ ] Table tetap readable.
- [ ] Button memiliki hierarchy.
- [ ] Status menggunakan semantic color.
- [ ] Hover state subtle.
- [ ] Animation subtle.
- [ ] Tidak ada dekorasi yang tidak memiliki fungsi.
- [ ] Tidak terlihat seperti template AI-generated.
- [ ] Tidak terlihat seperti landing page.
- [ ] Tidak mengubah fungsi atau struktur existing application hanya demi visual.

---

# 46. Final Design Principle

CTECH ERP harus terlihat:

**Corporate enough for management.**

**Simple enough for daily operations.**

**Modern enough for a technology company.**

**Distinct enough to feel like CTECH.**

Tetapi tidak boleh terlihat:

**Over-designed.**

**Over-decorated.**

**AI-generated.**

**Template-like.**

**Marketing-oriented.**

### Final Rule

> **Make the interface feel designed, not decorated.**