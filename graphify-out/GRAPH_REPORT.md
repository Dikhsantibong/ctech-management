# Graph Report - .  (2026-08-02)

## Corpus Check
- 376 files · ~302,669 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1596 nodes · 3480 edges · 215 communities (137 shown, 78 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 83 edges (avg confidence: 0.79)
- Token cost: 476,777 input · 0 output

## Community Hubs (Navigation)
- React UI Components & Pages
- Task & Feedback Controllers
- Fortify Auth Requests
- Client/Project/Document Controllers
- Auth Feature Tests
- Composer Setup Scripts
- App Sidebar Navigation
- User Auth Feature Tests
- Breadcrumb Components
- Client/Meeting Controllers
- Company Setting & Content Plan Controllers
- Activity Log & Project Activity Controllers
- News Controller
- App Header & Logo Components
- App Shell Layout Components
- Nav Footer & Main Nav Components
- Public Marketing Components (About/Clients/News)
- Public Footer & Navbar
- SEO & Contact/Footer Pages
- TS Compiler Config
- Two-Factor Auth Modal
- Appearance Hooks & Toaster
- Avatar & Dropdown Components
- Text Link & Magnetic Button
- Components.json (shadcn config)
- Heading & Passkey Management
- Inertia Request Handling Tests
- Lint Workflow (CI)
- Announcement Controller
- NPM Dev Dependencies
- Letter Controller
- Project Milestone Controller
- Radix UI Dependencies
- Rollup/Tailwind Native Binaries
- Hero Shader & App Wrapper
- Work Controller
- Invoice Controller
- Auth TS Types
- Document Controller
- File Controller
- Incoming Letter Controller
- Appearance & Role Middleware
- Composer Dependencies (require)
- Database Seeders
- Page Header & Portfolio Gallery
- Deadline Reminder Command
- Composer Dev Dependencies
- NPM Scripts
- Daily Report Controller
- composer.json
- Sections: Process.tsx
- Animations: motionVariants.ts
- Auth: EmailVerificationTest.php
- config
- Factories: UserFactory.php
- Ui: alert-error.tsx
- Sections: Statistics.tsx
- Settings: ProfileUpdateTest.php
- Products: paylo.tsx
- autoload
- extra
- Components: appearance-tabs.tsx
- package.json
- autoload-dev
- keywords
- Team Members at PLN Nusantara Power Office
- eslint.config.js
- Public: robots.txt (SEO crawl rules)
- Ui: icon.tsx
- Ui: placeholder-pattern.tsx
- Animations: animations.ts
- Lib: constants.ts
- NPM Dependency: chart.js
- NPM Dependency: clsx
- Sidebar Logo (CTech Brand Mark)
- Our Story Photo 1 - PLN Nusantara Power Kendari Me
- NPM Dependency: concurrently
- NPM Dependency: date-fns
- NPM Dependency: eslint-import-resolver-typescript
- NPM Dependency: eslint-plugin-import
- NPM Dependency: eslint-plugin-react
- NPM Dependency: framer-motion
- NPM Dependency: @headlessui/react
- NPM Dependency: @inertiajs/react
- NPM Dependency: @inertiajs/vite
- NPM Dependency: input-otp
- Kabupaten Buton Utara Emblem (company5.png)
- NPM Dependency: @laravel/passkeys
- NPM Dependency: lenis
- NPM Dependency: lucide-react
- NPM Dependency: @radix-ui/react-avatar
- NPM Dependency: @radix-ui/react-checkbox
- NPM Dependency: @radix-ui/react-collapsible
- NPM Dependency: @radix-ui/react-dialog
- NPM Dependency: @radix-ui/react-label
- NPM Dependency: @radix-ui/react-navigation-menu
- NPM Dependency: @radix-ui/react-select
- NPM Dependency: @radix-ui/react-separator
- NPM Dependency: @radix-ui/react-slot
- NPM Dependency: @radix-ui/react-switch
- NPM Dependency: @radix-ui/react-tabs
- NPM Dependency: @radix-ui/react-toggle
- NPM Dependency: @radix-ui/react-toggle-group
- NPM Dependency: react
- NPM Dependency: react-chartjs-2
- NPM Dependency: react-dom
- NPM Dependency: react-quill-new
- NPM Dependency: react-window
- NPM Dependency: sonner
- NPM Dependency: tailwind-merge
- NPM Dependency: tailwindcss
- NPM Dependency: @tailwindcss/vite
- NPM Dependency: tw-animate-css
- NPM Dependency: @types/react
- NPM Dependency: @types/react-dom
- NPM Dependency: @types/react-window
- NPM Dependency: typescript
- NPM Dependency: vite
- NPM Dependency: @vitejs/plugin-react
- NPM Dependency: prettier
- NPM Dependency: prettier-plugin-tailwindcss
- NPM Dependency: @stylistic/eslint-plugin
- NPM Dependency: @types/node
- Apple Touch Icon (Laravel Logo)
- Company Presentation Event Photo (Speaker with Mic
- Lib: fonts.ts
- Favicon (Laravel Logo Mark)
- CTech 'TC' Monogram Logo (logo-web.png)
- PLN Nusantara Power Logo (company1.png)
- Lalu Lintas (Korps Lalu Lintas / Indonesian Traffi
- SDM POLRI Logo
- Muna Barat Regency Emblem (company4.png)
- Our Story Photo 3 - Team Coding Session
- Our Story Photo 5 - Team Meeting/Training Session

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `User` - 58 edges
3. `Button()` - 56 edges
4. `Project` - 44 edges
5. `Controller` - 40 edges
6. `Label()` - 35 edges
7. `Input()` - 34 edges
8. `TestCase` - 29 edges
9. `Badge()` - 27 edges
10. `DialogContent()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `pnpm Workspace Configuration` --conceptually_related_to--> `Linter Workflow (lint.yml)`  [AMBIGUOUS]
  pnpm-workspace.yaml → .github/workflows/lint.yml
- `pnpm Workspace Configuration` --conceptually_related_to--> `Tests Workflow (tests.yml)`  [AMBIGUOUS]
  pnpm-workspace.yaml → .github/workflows/tests.yml
- `useLenis()` --references--> `lenis`  [EXTRACTED]
  resources/js/hooks/use-lenis.ts → package.json
- `logActivity()` --calls--> `ActivityLog`  [INFERRED]
  app/Traits/LogsActivity.php → app/Models/ActivityLog.php
- `CardFooter()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/card.tsx → resources/js/lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CI Dependency Install & Build Pipeline (Node + PHP)** — _github_workflows_lint_linter_workflow, _github_workflows_tests_tests_workflow, pnpm_workspace_config [INFERRED 0.75]

## Communities (215 total, 78 thin omitted)

### Community 0 - "React UI Components & Pages"
Cohesion: 0.05
Nodes (90): DeleteUser(), InputError(), formats, LetterEditor(), modules, LetterPageSettings(), Props, Props (+82 more)

### Community 1 - "Task & Feedback Controllers"
Cohesion: 0.07
Nodes (14): TaskController, ClientFeedback, DailyReportTask, DocumentPermission, InvoiceItem, MeetingActionItem, MeetingParticipant, ProjectDocument (+6 more)

### Community 2 - "Fortify Auth Requests"
Cohesion: 0.07
Nodes (16): CreateNewUser, ResetUserPassword, emailRules(), nameRules(), profileRules(), PasswordUpdateRequest, ProfileDeleteRequest, ProfileUpdateRequest (+8 more)

### Community 3 - "Client/Project/Document Controllers"
Cohesion: 0.10
Nodes (7): ClientFeedbackController, ProjectDocumentController, ProjectMeetingController, ProjectRevisionController, ProjectController, Project, Illuminate\Http\Request

### Community 4 - "Auth Feature Tests"
Cohesion: 0.09
Nodes (11): Illuminate\Foundation\Testing\RefreshDatabase, Illuminate\Foundation\Testing\TestCase, PasswordConfirmationTest, RegistrationTest, TwoFactorChallengeTest, VerificationNotificationTest, DashboardTest, ExampleTest (+3 more)

### Community 5 - "Composer Setup Scripts"
Cohesion: 0.06
Nodes (36): scripts, ci:check, dev, lint, lint:check, post-autoload-dump, post-create-project-cmd, post-root-package-install (+28 more)

### Community 6 - "App Sidebar Navigation"
Cohesion: 0.09
Nodes (31): administrationNav, announcementsNav, dashboardNav, financeNav, marketingNav, operationsNav, systemNav, NavUser() (+23 more)

### Community 7 - "User Auth Feature Tests"
Cohesion: 0.10
Nodes (10): UserController, User, Illuminate\Database\Eloquent\Factories\HasFactory, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Fortify\Contracts\PasskeyUser, Laravel\Fortify\PasskeyAuthenticatable, Laravel\Fortify\TwoFactorAuthenticatable (+2 more)

### Community 8 - "Breadcrumb Components"
Cohesion: 0.11
Nodes (28): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), DialogOverlay() (+20 more)

### Community 9 - "Client/Meeting Controllers"
Cohesion: 0.09
Nodes (5): ClientController, Client, Meeting, ProjectDocumentFolder, Illuminate\Database\Eloquent\Relations\HasMany

### Community 10 - "Company Setting & Content Plan Controllers"
Cohesion: 0.11
Nodes (5): CompanySettingController, ContentPlanController, CompanySetting, ContentPlan, Illuminate\Database\Eloquent\Relations\BelongsToMany

### Community 11 - "Activity Log & Project Activity Controllers"
Cohesion: 0.11
Nodes (12): ActivityLogController, ProjectActivityController, Controller, ProfileController, SecurityController, ActivityLog, logActivity(), Illuminate\Foundation\Auth\Access\AuthorizesRequests (+4 more)

### Community 12 - "News Controller"
Cohesion: 0.13
Nodes (6): NewsController, PortfolioController, PublicController, SitemapController, News, Portfolio

### Community 13 - "App Header & Logo Components"
Cohesion: 0.12
Nodes (16): mainNavItems, Props, rightNavItems, AppLogo(), AppLogoIcon(), Sheet(), SheetContent(), SheetDescription() (+8 more)

### Community 14 - "App Shell Layout Components"
Cohesion: 0.16
Nodes (14): AppContent(), Props, AppShell(), Props, AppSidebar(), AppSidebarHeader(), Breadcrumbs(), LanguageSwitcher() (+6 more)

### Community 15 - "Nav Footer & Main Nav Components"
Cohesion: 0.15
Nodes (18): AppHeader(), NavFooter(), NavMain(), Separator(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarMenu() (+10 more)

### Community 16 - "Public Marketing Components (About/Clients/News)"
Cohesion: 0.12
Nodes (16): About(), ClientMarquee(), EASE, NewsHighlight(), stripHtml(), CARD_COLORS, EASE, imageUrl() (+8 more)

### Community 17 - "Public Footer & Navbar"
Cohesion: 0.12
Nodes (10): PublicFooter(), EASE, MENU_ITEMS, PremiumNavbar(), PremiumNavbarProps, benefits, features, pricing (+2 more)

### Community 18 - "SEO & Contact/Footer Pages"
Cohesion: 0.19
Nodes (14): Contact(), Footer(), NAV_LINKS, SOCIAL_LINKS, SEO(), SEOProps, useLenis(), ContactIndex() (+6 more)

### Community 19 - "TS Compiler Config"
Cohesion: 0.10
Nodes (19): resources/js/**/*.d.ts, resources/js/**/*.ts, resources/js/**/*.tsx, compilerOptions, allowJs, baseUrl, esModuleInterop, forceConsistentCasingInFileNames (+11 more)

### Community 20 - "Two-Factor Auth Modal"
Cohesion: 0.16
Nodes (12): Props, TwoFactorSetupStep(), InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, CopiedValue, CopyFn (+4 more)

### Community 21 - "Appearance Hooks & Toaster"
Cohesion: 0.19
Nodes (17): Toaster(), applyTheme(), getStoredAppearance(), handleSystemThemeChange(), initializeTheme(), isDarkMode(), listeners, mediaQuery() (+9 more)

### Community 22 - "Avatar & Dropdown Components"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 23 - "Text Link & Magnetic Button"
Cohesion: 0.16
Nodes (10): Props, TextLink(), MagneticButton(), MagneticButtonProps, ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle() (+2 more)

### Community 24 - "Components.json (shadcn config)"
Cohesion: 0.16
Nodes (13): Avatar(), AvatarFallback(), AvatarImage(), DropdownMenuGroup(), DropdownMenuLabel(), DropdownMenuSeparator(), UserInfo(), Props (+5 more)

### Community 25 - "Heading & Passkey Management"
Cohesion: 0.19
Nodes (11): Heading(), ManagePasskeys(), Props, ManageTwoFactor(), Props, PasskeyItem(), PasskeyRegistration(), TwoFactorRecoveryCodes() (+3 more)

### Community 26 - "Inertia Request Handling Tests"
Cohesion: 0.14
Nodes (3): HandleInertiaRequests, Inertia\Middleware, PasswordResetTest

### Community 27 - "Lint Workflow (CI)"
Cohesion: 0.17
Nodes (15): actions/checkout GitHub Action, composer lint script, Linter Workflow (lint.yml), npm run format script, npm run lint script, quality job, shivammathur/setup-php Action, php artisan key:generate command (+7 more)

### Community 29 - "NPM Dev Dependencies"
Cohesion: 0.13
Nodes (15): babel-plugin-react-compiler, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, @laravel/vite-plugin-wayfinder, devDependencies, babel-plugin-react-compiler (+7 more)

### Community 32 - "Radix UI Dependencies"
Cohesion: 0.15
Nodes (13): class-variance-authority, globals, laravel-vite-plugin, dependencies, class-variance-authority, globals, laravel-vite-plugin, @radix-ui/react-dropdown-menu (+5 more)

### Community 33 - "Rollup/Tailwind Native Binaries"
Cohesion: 0.15
Nodes (13): lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu (+5 more)

### Community 34 - "Hero Shader & App Wrapper"
Cohesion: 0.21
Nodes (7): HeroShaderCanvas(), EASE, Hero(), TooltipProvider(), AppLayout(), AuthSplitLayout(), AuthLayout()

### Community 36 - "Invoice Controller"
Cohesion: 0.33
Nodes (3): InvoiceController, Invoice, Main Logo (TC Monogram)

### Community 37 - "Auth TS Types"
Cohesion: 0.22
Nodes (9): Auth, Passkey, TwoFactorSecretKey, TwoFactorSetupData, User, InertiaConfig, @inertiajs/core, InputHTMLAttributes (+1 more)

### Community 41 - "Appearance & Role Middleware"
Cohesion: 0.31
Nodes (5): HandleAppearance, RoleMiddleware, Closure, Illuminate\Foundation\Configuration\Middleware, Symfony\Component\HttpFoundation\Response

### Community 42 - "Composer Dependencies (require)"
Cohesion: 0.20
Nodes (10): require, barryvdh/laravel-dompdf, inertiajs/inertia-laravel, laravel/chisel, laravel/fortify, laravel/framework, laravel/sanctum, laravel/tinker (+2 more)

### Community 43 - "Database Seeders"
Cohesion: 0.29
Nodes (4): DatabaseSeeder, DummyTaskSeeder, LetterTemplatesSeeder, Illuminate\Database\Seeder

### Community 44 - "Page Header & Portfolio Gallery"
Cohesion: 0.24
Nodes (6): EASE, PageHeader(), PageHeaderProps, EASE, PortfolioGallery(), PortfolioIndex()

### Community 45 - "Deadline Reminder Command"
Cohesion: 0.33
Nodes (4): SendDeadlineReminders, NotificationReminderLog, Illuminate\Console\Command, Illuminate\Database\Eloquent\Relations\MorphTo

### Community 46 - "Composer Dev Dependencies"
Cohesion: 0.22
Nodes (9): require-dev, fakerphp/faker, laravel/pail, laravel/pao, laravel/pint, laravel/sail, mockery/mockery, nunomaduro/collision (+1 more)

### Community 47 - "NPM Scripts"
Cohesion: 0.22
Nodes (9): scripts, build, build:ssr, dev, format, format:check, lint, lint:check (+1 more)

### Community 49 - "composer.json"
Cohesion: 0.25
Nodes (7): description, license, minimum-stability, name, prefer-stable, $schema, type

### Community 50 - "Sections: Process.tsx"
Cohesion: 0.29
Nodes (6): EASE, Process(), PROCESS_STEPS, EASE, SERVICES, ServicesIndex()

### Community 51 - "Animations: motionVariants.ts"
Cohesion: 0.25
Nodes (7): EASING, fadeIn, fadeUp, imageReveal, revealLine, scaleUp, staggerContainer

### Community 53 - "config"
Cohesion: 0.29
Nodes (7): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 54 - "Factories: UserFactory.php"
Cohesion: 0.43
Nodes (3): UserFactory, Illuminate\Database\Eloquent\Factories\Factory, static

### Community 55 - "Ui: alert-error.tsx"
Cohesion: 0.48
Nodes (5): AlertError(), Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 56 - "Sections: Statistics.tsx"
Cohesion: 0.33
Nodes (4): EASE, Statistics(), STATS, AboutIndex()

### Community 58 - "Products: paylo.tsx"
Cohesion: 0.33
Nodes (4): benefits, features, pricing, useCases

### Community 59 - "autoload"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 60 - "extra"
Cohesion: 0.40
Nodes (5): extra, laravel, post-create-project, dont-discover, installer

### Community 62 - "package.json"
Cohesion: 0.50
Nodes (3): private, $schema, type

### Community 64 - "autoload-dev"
Cohesion: 0.67
Nodes (3): autoload-dev, psr-4, Tests\\

### Community 65 - "keywords"
Cohesion: 0.67
Nodes (3): keywords, framework, laravel

### Community 66 - "Team Members at PLN Nusantara Power Office"
Cohesion: 0.67
Nodes (3): Company "Our Story" Narrative Section, PLN Nusantara Power (client/partner organization), Team Members at PLN Nusantara Power Office

### Community 120 - "Public: robots.txt (SEO crawl rules)"
Cohesion: 0.67
Nodes (3): Disallowed internal app routes (dashboard, files, documents, invoices, letters, clients, projects, tasks, works, users, content-plans, announcements, activity-logs, company-settings, settings, calendar, login, register, storage), robots.txt (SEO crawl rules), sitemap.xml reference

## Ambiguous Edges - Review These
- `Linter Workflow (lint.yml)` → `pnpm Workspace Configuration`  [AMBIGUOUS]
  pnpm-workspace.yaml · relation: conceptually_related_to
- `Tests Workflow (tests.yml)` → `pnpm Workspace Configuration`  [AMBIGUOUS]
  pnpm-workspace.yaml · relation: conceptually_related_to

## Knowledge Gaps
- **321 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+316 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **78 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Linter Workflow (lint.yml)` and `pnpm Workspace Configuration`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Tests Workflow (tests.yml)` and `pnpm Workspace Configuration`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `dependencies` connect `Radix UI Dependencies` to `NPM Dependency: concurrently`, `NPM Dependency: date-fns`, `NPM Dependency: framer-motion`, `NPM Dependency: @headlessui/react`, `NPM Dependency: @inertiajs/react`, `NPM Dependency: @inertiajs/vite`, `NPM Dependency: input-otp`, `NPM Dependency: @laravel/passkeys`, `NPM Dependency: lenis`, `NPM Dependency: lucide-react`, `NPM Dependency: @radix-ui/react-avatar`, `NPM Dependency: @radix-ui/react-checkbox`, `NPM Dependency: @radix-ui/react-collapsible`, `NPM Dependency: @radix-ui/react-dialog`, `NPM Dependency: @radix-ui/react-label`, `NPM Dependency: @radix-ui/react-navigation-menu`, `NPM Dependency: @radix-ui/react-select`, `NPM Dependency: @radix-ui/react-separator`, `NPM Dependency: @radix-ui/react-slot`, `NPM Dependency: @radix-ui/react-switch`, `NPM Dependency: @radix-ui/react-tabs`, `NPM Dependency: @radix-ui/react-toggle`, `NPM Dependency: @radix-ui/react-toggle-group`, `NPM Dependency: react`, `NPM Dependency: react-chartjs-2`, `NPM Dependency: react-dom`, `NPM Dependency: react-quill-new`, `NPM Dependency: react-window`, `NPM Dependency: sonner`, `NPM Dependency: tailwind-merge`, `NPM Dependency: tailwindcss`, `NPM Dependency: @tailwindcss/vite`, `NPM Dependency: tw-animate-css`, `NPM Dependency: @types/react`, `NPM Dependency: @types/react-dom`, `NPM Dependency: @types/react-window`, `NPM Dependency: typescript`, `NPM Dependency: vite`, `NPM Dependency: @vitejs/plugin-react`, `package.json`, `NPM Dependency: chart.js`, `NPM Dependency: clsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `useLenis()` connect `SEO & Contact/Footer Pages` to `Page Header & Portfolio Gallery`, `NPM Dependency: lenis`, `Public Marketing Components (About/Clients/News)`, `Sections: Process.tsx`, `Sections: Statistics.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `lenis` connect `NPM Dependency: lenis` to `Radix UI Dependencies`, `SEO & Contact/Footer Pages`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Are the 39 inferred relationships involving `User` (e.g. with `.index()` and `.show()`) actually correct?**
  _`User` has 39 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _321 weakly-connected nodes found - possible documentation gaps or missing edges._