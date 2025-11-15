$svgSprite = @"
    <svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
      <symbol id="envelope" viewBox="0 0 16 16">
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
      </symbol>
      <symbol id="phone" viewBox="0 0 16 16">
        <path d="M3.654 1.328a.678.678 0 0 1 .738-.088l2.522 1.262a.678.678 0 0 1 .291.918l-.805 1.612a.678.678 0 0 1-.746.36l-1.517-.303a11.12 11.12 0 0 0 4.515 4.515l.303-1.517a.678.678 0 0 1 .36-.746l1.612-.805a.678.678 0 0 1 .918.291l1.262 2.522a.678.678 0 0 1-.088.738l-1.272 1.272c-.278.278-.67.38-1.02.282a15.533 15.533 0 0 1-9.14-9.14c-.097-.35.004-.743.282-1.02Z" />
      </symbol>
    </svg>
"@

$files = @(
    'book-publishing.html',
    'diaries-planners.html',
    'corporate-gift-sets.html',
    'labels-stickers.html',
    'business-cards.html',
    'banners.html',
    'roll-up-banners.html',
    'hanging-banners.html',
    'flyers.html',
    'booklets.html',
    'corporate-diaries.html',
    'personalized-embossed-diaries.html',
    'privacy.html',
    'terms.html'
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw -Encoding UTF8
    
    # Add SVG sprite after <body>
    $content = $content -replace '(</head>\s*<body>)', "`$1`r`n$svgSprite"
    
    # Update icon references
    $content = $content -replace 'assets/img/icons\.svg#phone', '#phone'
    $content = $content -replace 'assets/img/icons\.svg#envelope', '#envelope'
    
    Set-Content -Path $file -Value $content -NoNewline -Encoding UTF8
    Write-Host "Fixed $file"
}

Write-Host "`nAll files updated successfully!"
