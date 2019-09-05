@echo off

pushd ..
set parentPath=%cd%

echo
echo ===============================================
echo abriendo %parentPath% con el visual studio code
echo ===============================================
echo

code .
