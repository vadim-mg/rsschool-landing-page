#Requires -Version 5.1
$ErrorActionPreference = 'Stop'

# ==== НАСТРОЙКИ ====
$SourceBranch = 'landing-pages'
$TargetBranch = 'github-pages'
$DistDir      = 'dist'
$Remote       = 'origin'

$KeepInRoot = @(
    '.git',
    '.gitignore',
    'README.md',
    'dist'
)
# ===================

function Info($m) { Write-Host ">> $m" -ForegroundColor Cyan }
function Ok($m)   { Write-Host "   OK: $m" -ForegroundColor Green }
function Warn($m) { Write-Host "   ! $m" -ForegroundColor Yellow }

function Invoke-Git([string[]]$gitArgs) {
    & git @gitArgs
    if ($LASTEXITCODE -ne 0) { throw "git $($gitArgs -join ' ') завершился с кодом $LASTEXITCODE" }
}

Invoke-Git @('rev-parse', '--is-inside-work-tree') | Out-Null

$originalBranch = (& git rev-parse --abbrev-ref HEAD).Trim()
Info "Текущая ветка: $originalBranch"

$dirty = & git status --porcelain
if ($dirty) {
    Warn "Есть незакоммиченные изменения:"
    Write-Host $dirty
    throw "Сначала закоммить или спрячь изменения (git stash), потом деплой."
}

try {
    Info "Сборка ($DistDir)"
    # Invoke-Git @('checkout', $SourceBranch)
    & npm run build
    if ($LASTEXITCODE -ne 0) { throw "npm run build упал" }
    Ok "Сборка готова"

    if (-not (Test-Path $DistDir)) { throw "Папка $DistDir не найдена после сборки" }

    Info "Переключение на $TargetBranch"
    $localExists = (& git branch --list $TargetBranch | Out-String).Trim()
    if (-not $localExists) {
        Invoke-Git @('fetch', $Remote, $TargetBranch)
        Invoke-Git @('checkout', '-b', $TargetBranch, "$Remote/$TargetBranch")
    } else {
        Invoke-Git @('checkout', $TargetBranch)
        Invoke-Git @('pull', '--ff-only', $Remote, $TargetBranch)
    }
    Ok "На ветке $TargetBranch"

    Info "Очистка корня (кроме: $($KeepInRoot -join ', '))"
    Get-ChildItem -Force -Path . | Where-Object {
        $KeepInRoot -notcontains $_.Name
    } | ForEach-Object {
        Write-Host "  - $($_.Name)"
        Remove-Item -Recurse -Force -LiteralPath $_.FullName
    }
    Ok "Корень очищен"

    Info "Копирование $DistDir → корень"
    Copy-Item -Recurse -Force -Path (Join-Path $DistDir '*') -Destination .
    Ok "Файлы скопированы"

    Invoke-Git @('add', '-A')

    $changes = & git status --porcelain
    if (-not $changes) {
        Warn "Изменений нет — нечего коммитить"
    } else {
        $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
        # Invoke-Git @('commit', '-m', "deploy: $stamp")
        Ok "Коммит создан"
    }

    Info "Пуш в $Remote/$TargetBranch"
    # Invoke-Git @('push', $Remote, $TargetBranch)
    Ok "Запушено"
}
finally {
    Info "Возврат на $originalBranch"
    & git checkout $originalBranch | Out-Null
}

Ok "Деплой завершён"