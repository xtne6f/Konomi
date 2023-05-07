# 必要ならサードパーティーライブラリを準備して KonomiTV.py を起動する

# 問題があれば実行を停止
$ErrorActionPreference = "Stop"

# ハッシュチェックを省略したいときは $*SHA256 変数をコメントアウトする

$cpythonTgzUri = "https://github.com/indygreg/python-build-standalone/releases/download/20230826/cpython-3.11.5+20230826-x86_64-pc-windows-msvc-shared-install_only.tar.gz"
$cpythonSHA256 = "00f002263efc8aea896bcfaaf906b1f4dab3e5cd3db53e2b69ab9a10ba220b97"
$poetryVersion = "1.6.1"

$ffmpegZipUri = "https://github.com/BtbN/FFmpeg-Builds/releases/download/autobuild-2023-08-31-12-54/ffmpeg-n5.1.3-16-g566aa38d98-win64-gpl-shared-5.1.zip"
$ffmpegSHA256 = "dc45e5a2fc3e991523b80b559242637d863bc91b196358203e054da2e9bc7fa5"

$qsvencc7zUri = "https://github.com/rigaya/QSVEnc/releases/download/7.48/QSVEncC_7.48_x64.7z"
$qsvenccSHA256 = "d8cfd2d1b46824fa55487f7ff06dde9b4ddf38a3f08ce0b7b0870e7fa419abb0"

$nvencc7zUri = "https://github.com/rigaya/NVEnc/releases/download/7.31/NVEncC_7.31_x64.7z"
$nvenccSHA256 = "6819b0af6ccc2ecc9002a2d119746c713c310cb4a4c185b1c86b34098d5b4a08"

$vceencc7zUri = "https://github.com/rigaya/VCEEnc/releases/download/8.16/VCEEncC_8.16_x64.7z"
$vceenccSHA256 = "ff6209c8b2e7293924ba624448ff5c93453d89257076d9762429794b60a37fe7"

$tsreadexZipUri = "https://github.com/xtne6f/tsreadex/releases/download/master-230809/tsreadex-master-230809.zip"
$tsreadexSHA256 = "24352d653182c6b2d0aa20327a8a63d90a75ebb38b4a54c02e14febbfe4f55a1"

$psisiarcZipUri = "https://github.com/xtne6f/psisiarc/releases/download/master-220821/psisiarc-master-220821.zip"
$psisiarcSHA256 = "991b6c72bf639de028913a39763b3a17b64421d8f2fb434b0a7c853e4f3257ef"

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
