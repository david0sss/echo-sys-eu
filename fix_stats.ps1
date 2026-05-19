$path = 'd:\echo-sys-eu\src\App.tsx'
$f = Get-Content $path -Raw
$f = $f -replace [regex]::Escape('&lt;0.1mm</div>'), '360mm</div>'
$f = $f -replace [regex]::Escape("t('struct')"), "t('conc_thick')"
$old1 = 'ISO-9001 <CheckCircle2'
$new1 = "{t('cert_val')} <CheckCircle2"
$f = $f.Replace($old1, $new1)
$old2 = "t('mfg_comp')"
$new2 = "t('cert_in_eu')"
$f = $f.Replace($old2, $new2)
Set-Content $path $f -NoNewline
Write-Host "Done"
