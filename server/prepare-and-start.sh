#!/bin/sh
# 必要ならサードパーティーライブラリを準備して KonomiTV.py を起動する

if [ "$1" = install ]; then
    echo 'Installing KonomiTV using pm2 run as the current user...'
    echo 'Use `pm2 {stop|restart} KonomiTV` to temporarily stop or restart.'
    echo
    cd "`dirname $0`" && pm2 start ./thirdparty/Python/bin/python --name KonomiTV -- -m pipenv run python KonomiTV.py && pm2 save
    exit
elif [ "$1" = delete ]; then
    echo 'Deleting KonomiTV from pm2 process list...'
    pm2 delete KonomiTV && pm2 cleardump && pm2 save
    exit
fi

# ffmpeg や HWEncC は環境にあるコマンドのシンボリックリンクを作るだけ

cpython_tgz_uri='https://github.com/indygreg/python-build-standalone/releases/download/20221106/cpython-3.10.8+20221106-x86_64-unknown-linux-gnu-install_only.tar.gz'
cpython_sha256=6c8db44ae0e18e320320bbaaafd2d69cde8bfea171ae2d651b7993d1396260b7

tsreadex_src_uri='https://github.com/xtne6f/tsreadex/archive/11235d37202ae5af4ab50311e9cc8b691d809cc4.tar.gz'

psisiarc_src_uri='https://github.com/xtne6f/psisiarc/archive/75b89410561627bb11f0e5b13c00d030120c88b0.tar.gz'

pre_required_commands='curl sha256sum make g++'

echo "Checking for pre-required commands ( $pre_required_commands )..."
which $pre_required_commands
if [ $? -ne 0 ]; then
    echo 'Error!'
    exit 1
fi
echo 'OK.'

cd "`dirname $0`" && cd thirdparty || exit

if [ ! -e ../../config.yaml ]; then
    echo 'Error: config.yaml is not found.'
    exit 1
fi

if [ -e Python ]; then
    echo 'Python already exists. skipped.'
else
    echo 'Preparing Python...'
    curl -Lo dltmp.tar.gz "$cpython_tgz_uri"
    sha256sum dltmp.tar.gz | grep -q "^$cpython_sha256" || exit
    tar xzf dltmp.tar.gz
    rm dltmp.tar.gz
    mv python Python
    ln -s python3.10 Python/bin/python

    if [ -e ../.venv ]; then
        rm -rf ../.venv
        echo 'Virtualenv (.venv) is cleared.'
    fi
    ./Python/bin/python -m pip install pipenv==2022.11.11
    echo 'Done.'
fi

if [ -e FFmpeg ]; then
    echo 'FFmpeg already exists. skipped.'
else
    echo 'Preparing FFmpeg...'
    mkdir FFmpeg
    ln_name=FFmpeg/ffmpeg.elf
    bin_path=`which ffmpeg`
    if [ $? -eq 0 ]; then
        ln -s "$bin_path" $ln_name
    else
        echo '#!/bin/sh' >$ln_name
        echo 'exit 1' >>$ln_name
        chmod +x $ln_name
        echo 'Placed "do-nothing" command.'
    fi
    ln_name=FFmpeg/ffprobe.elf
    bin_path=`which ffprobe`
    if [ $? -eq 0 ]; then
        ln -s "$bin_path" $ln_name
    else
        echo '#!/bin/sh' >$ln_name
        echo 'exit 1' >>$ln_name
        chmod +x $ln_name
        echo 'Placed "do-nothing" command.'
    fi
    echo 'Done.'
fi

if [ -e QSVEncC ]; then
    echo 'QSVEncC already exists. skipped.'
else
    echo 'Preparing QSVEncC...'
    mkdir QSVEncC
    ln_name=QSVEncC/QSVEncC.elf
    bin_path=`which qsvencc`
    if [ $? -eq 0 ]; then
        ln -s "$bin_path" $ln_name
    else
        echo '#!/bin/sh' >$ln_name
        echo 'exit 1' >>$ln_name
        chmod +x $ln_name
        echo 'Placed "do-nothing" command.'
    fi
    echo 'Done.'
fi

if [ -e NVEncC ]; then
    echo 'NVEncC already exists. skipped.'
else
    echo 'Preparing NVEncC...'
    mkdir NVEncC
    ln_name=NVEncC/NVEncC.elf
    bin_path=`which nvencc`
    if [ $? -eq 0 ]; then
        ln -s "$bin_path" $ln_name
    else
        echo '#!/bin/sh' >$ln_name
        echo 'exit 1' >>$ln_name
        chmod +x $ln_name
        echo 'Placed "do-nothing" command.'
    fi
    echo 'Done.'
fi

if [ -e VCEEncC ]; then
    echo 'VCEEncC already exists. skipped.'
else
    echo 'Preparing VCEEncC...'
    mkdir VCEEncC
    ln_name=VCEEncC/VCEEncC.elf
    bin_path=`which vceencc`
    if [ $? -eq 0 ]; then
        ln -s "$bin_path" $ln_name
    else
        echo '#!/bin/sh' >$ln_name
        echo 'exit 1' >>$ln_name
        chmod +x $ln_name
        echo 'Placed "do-nothing" command.'
    fi
    echo 'Done.'
fi

if [ -e tsreadex ]; then
    echo 'tsreadex already exists. skipped.'
else
    echo 'Preparing tsreadex...'
    mkdir tsreadex && cd tsreadex || exit
    curl -L "$tsreadex_src_uri" | tar xzf -
    cd tsreadex-* && make || exit
    cp tsreadex ../tsreadex.elf
    cp License.txt Readme.txt ..
    cd ..
    rm -rf tsreadex-*
    cd ..
    echo 'Done.'
fi

if [ -e psisiarc ]; then
    echo 'psisiarc already exists. skipped.'
else
    echo 'Preparing psisiarc...'
    mkdir psisiarc && cd psisiarc || exit
    curl -L "$psisiarc_src_uri" | tar xzf -
    cd psisiarc-* && make || exit
    cp psisiarc ../psisiarc.elf
    cp License.txt Readme.txt ..
    cd ..
    rm -rf psisiarc-*
    cd ..
    echo 'Done.'
fi

cd ..

export PIPENV_VENV_IN_PROJECT=true

./thirdparty/Python/bin/python -m pipenv sync "--python=`readlink -f ./thirdparty/Python/bin`/python"
./thirdparty/Python/bin/python -m pipenv run aerich upgrade
./thirdparty/Python/bin/python -m pipenv run python KonomiTV.py

