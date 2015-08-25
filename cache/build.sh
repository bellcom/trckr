#!/bin/bash
readonly version=0.11.5

echo "fetch node-webkit"
wget http://dl.node-webkit.org/v$version/node-webkit-v$version-linux-x64.tar.gz
wget http://dl.node-webkit.org/v$version/node-webkit-v$version-win-ia32.zip
wget http://dl.node-webkit.org/v$version/node-webkit-v$version-osx-x64.zip

echo "extract archives"
tar -zxvf node-webkit-v$version-linux-x64.tar.gz
unzip node-webkit-v$version-win-ia32.zip
unzip node-webkit-v$version-osx-x64.zip

echo "archive src"
mkdir -p build
$(cd ../src && zip -r ../cache/build/app.nw . -x vendor/bootstrap/node_modules/\* > /dev/null)

echo "create binary for linux"
mkdir -p build/linux
cat node-webkit-v$version-linux-x64/nw build/app.nw > build/linux/trckr
chmod +x build/linux/trckr
echo "fixing udev dependency"
sed -i 's/udev\.so\.0/udev.so.1/g' build/linux/trckr

cp node-webkit-v$version-linux-x64/nw.pak build/linux/
cp node-webkit-v$version-linux-x64/icudtl.dat build/linux/

echo "archive linux binary"
mkdir -p dist
$(cd build/linux && zip -r ../../dist/trckr-linux.zip . > /dev/null)

echo "create app for mac os"
mkdir -p build/mac
cp -r node-webkit-v$version-osx-x64/node-webkit.app build/mac/trckr.app
cp build/app.nw build/mac/trckr.app/Contents/Resources/app.nw

echo "archive mac binary"
$(cd build/mac && zip -r ../../dist/trckr-mac.zip . > /dev/null)

echo "create binary for windows"
mkdir -p build/windows
cat node-webkit-v$version-win-ia32/nw.exe build/app.nw > build/windows/trckr.exe
cp node-webkit-v$version-win-ia32/nw.pak build/windows/
cp node-webkit-v$version-win-ia32/icudtl.dat build/windows/

echo "archive windows binary"
$(cd build/windows && zip -r ../../dist/trckr-windows.zip . > /dev/null)

echo "Ready for distribution"
