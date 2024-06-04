#!/bin/bash

PROJECT_NAME=unknown

#Parse CLI args
while [[ "$#" -gt 0 ]]; do case $1 in
    -n)  PROJECT_NAME="$2";                shift;;
    *) echo "ERROR: Unknown parameter passed: $1"; usage; exit 1;;
esac; shift; done

usage() {
    cat << EOF
$programname: Run test folders
usage:
    -h                   Show usage

    -n                   Project name

EOF
}

if [ $PROJECT_NAME == "unknown" ]; then
  echo "Error: Please provide a project name"
  echo
  usage
  exit 1
fi

echo "PROJECT_NAME: $PROJECT_NAME"

clear
pushd ..

rm -rf $PROJECT_NAME

mkdir "./$PROJECT_NAME"
pushd $PROJECT_NAME

npm init --yes && npm pkg set type="module"
npm install @apollo/server graphql
npm install --save-dev typescript @types/node

mkdir src
touch src/index.ts
touch tsconfig.json
echo '
{ 
  "compilerOptions": { 
    "rootDirs": ["src"], 
    "outDir": "dist", 
    "lib": ["es2020"], 
    "target": "es2020", 
    "module": "esnext", 
    "moduleResolution": "node", 
    "esModuleInterop": true, 
    "types": ["node"] 
  } 
}
' > tsconfig.json

popd