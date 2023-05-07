# 必要ならサードパーティーライブラリを準備して KonomiTV.py を起動する

# 問題があれば実行を停止
$ErrorActionPreference = "Stop"

# ハッシュチェックを省略したいときは $*SHA256 変数をコメントアウトする

$cpythonTgzUri = "https://github.com/indygreg/python-build-standalone/releases/download/20230116/cpython-3.11.1+20230116-x86_64-pc-windows-msvc-shared-install_only.tar.gz"
$cpythonSHA256 = "edc08979cb0666a597466176511529c049a6f0bba8adf70df441708f766de5bf"
$pypenvVersion = "2023.4.29"

$ffmpegZipUri = "https://github.com/BtbN/FFmpeg-Builds/releases/download/autobuild-2023-03-31-12-50/ffmpeg-n5.1.3-win64-gpl-shared-5.1.zip"
$ffmpegSHA256 = "c153426803bfc591cd9a56b17539f2966bd0ef4f7703a07d73d3ddd2c3f2a8e4"

$qsvencc7zUri = "https://github.com/rigaya/QSVEnc/releases/download/7.37/QSVEncC_7.37_x64.7z"
$qsvenccSHA256 = "91884d09b733e159353151bff55bce3ed9c8e81caec2681c6d725ac758a43654"

$nvencc7zUri = "https://github.com/rigaya/NVEnc/releases/download/7.24/NVEncC_7.24_x64.7z"
$nvenccSHA256 = "67d82892931338f96f7c74757daed518ff866493a6ff5c44b32d6b0224a75c47"

$vceencc7zUri = "https://github.com/rigaya/VCEEnc/releases/download/8.11/VCEEncC_8.11_x64.7z"
$vceenccSHA256 = "c00a699b9ac09c1048b3e8c918ffede93d0f684ba23c82553d57b4b1ec4e2e2b"

$tsreadexZipUri = "https://github.com/xtne6f/tsreadex/releases/download/master-220821/tsreadex-master-220821.zip"
$tsreadexSHA256 = "6ba47dc8fdaf9e2bf744a85164ee77a5ee195ce19a54f8f6176b2122900b0256"

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
    .\Python\python.exe -m pip install pipenv==$pypenvVersion
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

$Env:PIPENV_VENV_IN_PROJECT = "true"

.\thirdparty\Python\python.exe -m pipenv sync --python=$(Convert-Path .\thirdparty\Python\python.exe)
.\thirdparty\Python\python.exe -m pipenv run aerich upgrade
.\thirdparty\Python\python.exe -m pipenv run python -X utf8 KonomiTV.py
