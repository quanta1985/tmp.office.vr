#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=================================================="
echo " 🔑 1-Click GitHub Web Sign-In & Instant Push     "
echo "=================================================="
echo ""
echo "This will open your browser to authorize your GitHub account."
echo ""

/opt/homebrew/bin/gh auth login -p https -w -h github.com
/opt/homebrew/bin/gh auth setup-git

echo ""
echo "Pushing code to https://github.com/quanta1985/tmp.office.vr..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "=================================================="
  echo " 🎉 SUCCESS! Code and 3D assets are live on GitHub!"
  echo "=================================================="
  echo ""
  echo "Opening GitHub Pages settings in your browser..."
  open "https://github.com/quanta1985/tmp.office.vr/settings/pages"
else
  echo ""
  echo "❌ Push failed. Please see the error message above."
fi

echo ""
read -p "Press [Enter] to exit..."

