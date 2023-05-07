# 必要ならサードパーティーライブラリを準備して KonomiTV.py を起動する

# 問題があれば実行を停止
$ErrorActionPreference = "Stop"

# ハッシュチェックを省略したいときは $*SHA256 変数をコメントアウトする

$cpythonTgzUri = "https://github.com/indygreg/python-build-standalone/releases/download/20240814/cpython-3.11.9+20240814-x86_64-pc-windows-msvc-install_only.tar.gz"
$cpythonSHA256 = "4c71d25731214b8a960d1d87510f24179d819249c5b434aaf7135818421b6215"
$poetryVersion = "1.8.3"

$ffmpegZipUri = "https://github.com/BtbN/FFmpeg-Builds/releases/download/autobuild-2024-08-31-12-50/ffmpeg-n7.0.2-6-g7e69129d2f-win64-gpl-shared-7.0.zip"
$ffmpegSHA256 = "10d1d5e084b5e44190dd456331b701f325fd311384ac199762800bd22771948c"

$qsvencc7zUri = "https://github.com/rigaya/QSVEnc/releases/download/7.69/QSVEncC_7.69_x64.7z"
$qsvenccSHA256 = "320ff92ce5601e929a2d68a2450b6a68536b946bea9be1e7b02dc8010440fd85"

$nvencc7zUri = "https://github.com/rigaya/NVEnc/releases/download/7.66/NVEncC_7.66_x64.7z"
$nvenccSHA256 = "92ef2094b5bdde9d1b378cf1f7bb3c165acc5d3a620797e619b9a90a33227255"

$vceencc7zUri = "https://github.com/rigaya/VCEEnc/releases/download/8.23/VCEEncC_8.23_x64.7z"
$vceenccSHA256 = "c11bd942c29aa6eb41979f8928945f8dd680fbaedb2f84e352624c2321eeef17"

$tsreadexZipUri = "https://github.com/xtne6f/tsreadex/releases/download/master-240517/tsreadex-master-240517.zip"
$tsreadexSHA256 = "472897e084dad6146a4ea327fb9267dd09775d3bc68248f676249f1de08c7fdb"

$psisiarcZipUri = "https://github.com/xtne6f/psisiarc/releases/download/master-230324/psisiarc-master-230324.zip"
$psisiarcSHA256 = "9e9fb304383ebb35fcfc9679182509e4069535e97a809f343bf0f6db59412d0b"

# 7z.exe のあるフォルダを PATH に追加
$Env:Path += ";C:\Program Files\7-Zip;C:\Program Files (x86)\7-Zip"

$null = gcm 7z.exe -ErrorAction SilentlyContinue
$exists7z = $?

if (!$exists7z) {
    throw "Error: 7-Zip is not found."
}

pushd -LiteralPath $PSScriptRoot\thirdparty

if (!(Test-Path ..\..\config.yaml)) {
    "config.yaml が見つかりません。 config.example.yaml を元に各自で作成してください。"
    throw "Error: config.yaml is not found."
}

if (Test-Path Python) {
    "Python already exists. skipped."
} else {
    "Preparing Python..."
    Invoke-WebRequest $cpythonTgzUri -OutFile dltmp.tar.gz
    if ($cpythonSHA256 -and ((Get-FileHash dltmp.tar.gz -Algorithm SHA256).Hash -ne $cpythonSHA256)) {
        throw "Hash error."
    }
    7z.exe e dltmp.tar.gz dltmp.tar
    rm dltmp.tar.gz
    7z.exe x -oPython dltmp.tar
    rm dltmp.tar
    mv Python\python\* Python
    rm Python\python

    if (Test-Path ..\.venv) {
        rm -Recurse ..\.venv
        "Virtualenv (.venv) is cleared."
    }
    .\Python\python.exe -m pip install poetry==$poetryVersion
    "Done."
}

if (Test-Path FFmpeg) {
    "FFmpeg already exists. skipped."
} else {
    "Preparing FFmpeg..."
    Invoke-WebRequest $ffmpegZipUri -OutFile dltmp.zip
    if ($ffmpegSHA256 -and ((Get-FileHash dltmp.zip -Algorithm SHA256).Hash -ne $ffmpegSHA256)) {
        throw "Hash error."
    }
    7z.exe e -oFFmpeg dltmp.zip */LICENSE.txt */bin/*.dll */bin/ffmpeg.exe */bin/ffprobe.exe
    rm dltmp.zip
    "Done."
}

if (Test-Path QSVEncC) {
    "QSVEncC already exists. skipped."
} else {
    "Preparing QSVEncC..."
    Invoke-WebRequest $qsvencc7zUri -OutFile dltmp.7z
    if ($qsvenccSHA256 -and ((Get-FileHash dltmp.7z -Algorithm SHA256).Hash -ne $qsvenccSHA256)) {
        throw "Hash error."
    }
    7z.exe e -oQSVEncC dltmp.7z
    rm dltmp.7z
    pushd QSVEncC
    if (Test-Path QSVEncC64.exe) {
        mv QSVEncC64.exe QSVEncC.exe
    }
    popd
    "Done."
}

if (Test-Path NVEncC) {
    "NVEncC already exists. skipped."
} else {
    "Preparing NVEncC..."
    Invoke-WebRequest $nvencc7zUri -OutFile dltmp.7z
    if ($nvenccSHA256 -and ((Get-FileHash dltmp.7z -Algorithm SHA256).Hash -ne $nvenccSHA256)) {
        throw "Hash error."
    }
    7z.exe e -oNVEncC dltmp.7z
    rm dltmp.7z
    pushd NVEncC
    if (Test-Path NVEncC64.exe) {
        mv NVEncC64.exe NVEncC.exe
    }
    popd
    "Done."
}

if (Test-Path VCEEncC) {
    "VCEEncC already exists. skipped."
} else {
    "Preparing VCEEncC..."
    Invoke-WebRequest $vceencc7zUri -OutFile dltmp.7z
    if ($vceenccSHA256 -and ((Get-FileHash dltmp.7z -Algorithm SHA256).Hash -ne $vceenccSHA256)) {
        throw "Hash error."
    }
    7z.exe e -oVCEEncC dltmp.7z
    rm dltmp.7z
    pushd VCEEncC
    if (Test-Path VCEEncC64.exe) {
        mv VCEEncC64.exe VCEEncC.exe
    }
    popd
    "Done."
}

if (Test-Path tsreadex) {
    "tsreadex already exists. skipped."
} else {
    "Preparing tsreadex..."
    Invoke-WebRequest $tsreadexZipUri -OutFile dltmp.zip
    if ($tsreadexSHA256 -and ((Get-FileHash dltmp.zip -Algorithm SHA256).Hash -ne $tsreadexSHA256)) {
        throw "Hash error."
    }
    7z.exe e -otsreadex dltmp.zip Readme.txt x86/tsreadex.exe
    rm dltmp.zip
    "Done."
}

if (Test-Path psisiarc) {
    "psisiarc already exists. skipped."
} else {
    "Preparing psisiarc..."
    Invoke-WebRequest $psisiarcZipUri -OutFile dltmp.zip
    if ($psisiarcSHA256 -and ((Get-FileHash dltmp.zip -Algorithm SHA256).Hash -ne $psisiarcSHA256)) {
        throw "Hash error."
    }
    7z.exe e -opsisiarc dltmp.zip Readme.txt x86/psisiarc.exe
    rm dltmp.zip
    "Done."
}

pushd -LiteralPath $PSScriptRoot

.\thirdparty\Python\python.exe -m poetry env use $(Convert-Path .\thirdparty\Python\python.exe)
.\thirdparty\Python\python.exe -m poetry install --only main --no-root
.\thirdparty\Python\python.exe -m poetry run aerich upgrade
.\thirdparty\Python\python.exe -m poetry run python -X utf8 KonomiTV.py
