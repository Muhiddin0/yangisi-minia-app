<#
.SYNOPSIS
    Serverdagi yangisi-mini-app loyihasini redeploy qiladi.

.DESCRIPTION
    Windows mashinangizdan SSH orqali serverga ulanadi,
    eng so'nggi kodni git'dan tortib oladi va Docker konteynerlarni
    qayta build qilib ishga tushiradi.

.EXAMPLE
    .\deploy.ps1
    .\deploy.ps1 -Server root@123.45.67.89
    .\deploy.ps1 -NoBuild        # build qilmasdan faqat qayta ishga tushiradi
#>

[CmdletBinding()]
param(
    # Server manzili: SSH config'dagi alias (siznikida "doston") yoki root@<IP>.
    [string]$Server = "doston",

    # Serverdagi loyiha papkasi (uy katalogiga nisbatan yoki to'liq yo'l).
    [string]$ProjectPath = "~/kumo/yangisi-minia-app",

    # Qaysi branch'dan tortib olish kerak.
    [string]$Branch = "main",

    # SSH kalitining yo'li (kerak bo'lsa). Bo'sh bo'lsa standart kalit ishlatiladi.
    [string]$IdentityFile = "",

    # Build qilmasdan faqat konteynerlarni qayta ishga tushirish uchun.
    [switch]$NoBuild
)

$ErrorActionPreference = "Stop"

# ssh mavjudligini tekshirish
if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Host "XATO: 'ssh' topilmadi. Windows OpenSSH Client'ni o'rnating:" -ForegroundColor Red
    Write-Host "  Settings > Apps > Optional features > Add > OpenSSH Client" -ForegroundColor Yellow
    exit 1
}

# Docker buyrug'ini tanlash
if ($NoBuild) {
    $dockerCmd = "docker compose up -d"
} else {
    $dockerCmd = "docker compose up --build -d"
}

# Serverda bajariladigan buyruqlar zanjiri.
# 'set -e' — biror buyruq xato bersa, qolganlari bajarilmaydi.
$remoteCommand = @"
set -e
echo '==> Loyiha papkasiga o'\''tilmoqda: $ProjectPath'
cd $ProjectPath
echo '==> git pull origin $Branch'
git pull origin $Branch
echo '==> $dockerCmd'
$dockerCmd
echo '==> Ishlab turgan konteynerlar:'
docker compose ps
"@

# SSH argumentlarini yig'ish
$sshArgs = @()
if ($IdentityFile -ne "") {
    $sshArgs += @("-i", $IdentityFile)
}
$sshArgs += $Server
$sshArgs += $remoteCommand

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host " Redeploy boshlanmoqda: $Server" -ForegroundColor Cyan
Write-Host " Papka : $ProjectPath" -ForegroundColor Cyan
Write-Host " Branch: $Branch" -ForegroundColor Cyan
Write-Host " Build : $(if ($NoBuild) { 'YO`Q' } else { 'HA' })" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# SSH'ni ishga tushirish
& ssh @sshArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Redeploy muvaffaqiyatli yakunlandi!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Redeploy xatolik bilan tugadi (exit code: $LASTEXITCODE)" -ForegroundColor Red
    exit $LASTEXITCODE
}
