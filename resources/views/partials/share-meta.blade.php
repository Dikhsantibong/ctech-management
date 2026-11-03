{{-- Metadata sharing dirender di server (HTML awal) agar crawler WhatsApp/Facebook/Telegram/LinkedIn/X tidak perlu menjalankan JavaScript. --}}
<meta name="description" content="{{ $shareMeta['description'] }}">
<link rel="canonical" href="{{ $shareMeta['url'] }}">

<meta property="og:type" content="article">
<meta property="og:site_name" content="{{ $shareMeta['site_name'] }}">
<meta property="og:locale" content="{{ $shareMeta['locale'] }}">
<meta property="og:url" content="{{ $shareMeta['url'] }}">
<meta property="og:title" content="{{ $shareMeta['title'] }}">
<meta property="og:description" content="{{ $shareMeta['description'] }}">
<meta property="og:image" content="{{ $shareMeta['image']['url'] }}">
@if (str_starts_with($shareMeta['image']['url'], 'https://'))
<meta property="og:image:secure_url" content="{{ $shareMeta['image']['url'] }}">
@endif
@if ($shareMeta['image']['type'])
<meta property="og:image:type" content="{{ $shareMeta['image']['type'] }}">
@endif
@if ($shareMeta['image']['width'] && $shareMeta['image']['height'])
<meta property="og:image:width" content="{{ $shareMeta['image']['width'] }}">
<meta property="og:image:height" content="{{ $shareMeta['image']['height'] }}">
@endif
<meta property="og:image:alt" content="{{ $shareMeta['image']['alt'] }}">

@if ($shareMeta['article']['published_time'])
<meta property="article:published_time" content="{{ $shareMeta['article']['published_time'] }}">
@endif
@if ($shareMeta['article']['modified_time'])
<meta property="article:modified_time" content="{{ $shareMeta['article']['modified_time'] }}">
@endif
<meta property="article:author" content="{{ $shareMeta['article']['author'] }}">
@if ($shareMeta['article']['section'])
<meta property="article:section" content="{{ $shareMeta['article']['section'] }}">
@endif
@foreach ($shareMeta['article']['tags'] as $tag)
<meta property="article:tag" content="{{ $tag }}">
@endforeach

<meta name="twitter:card" content="{{ $shareMeta['twitter']['card'] }}">
@if ($shareMeta['twitter']['site'])
<meta name="twitter:site" content="{{ $shareMeta['twitter']['site'] }}">
@endif
<meta name="twitter:title" content="{{ $shareMeta['title'] }}">
<meta name="twitter:description" content="{{ $shareMeta['description'] }}">
<meta name="twitter:image" content="{{ $shareMeta['image']['url'] }}">
<meta name="twitter:image:alt" content="{{ $shareMeta['image']['alt'] }}">

<script type="application/ld+json">{!! json_encode($shareMeta['json_ld'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) !!}</script>
