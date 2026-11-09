#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=================================================="
echo "    🚀 Pushing Office VR to quanta1985/tmp.office.vr"
echo "=================================================="
echo ""
echo "Remote Target: $(git remote get-url origin)"
echo ""
echo "Pushing code, PBR assets, and video to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "=================================================="
  echo " 🎉 SUCCESS! Pushed to tmp.office.vr!             "
  echo ""
  echo "Now enable GitHub Pages:"
  echo "1. Go to: https://github.com/quanta1985/tmp.office.vr/settings/pages"
  echo "2. Under 'Branch', select 'main' and '/ (root)'"
  echo "3. Click 'Save'"
  echo ""
  echo "Your live site will be ready at:"
  echo "👉 https://quanta1985.github.io/tmp.office.vr/"
  echo "=================================================="
else
  echo ""
  echo "--------------------------------------------------"
  echo "⚠️  If authentication failed:"
  echo "GitHub requires a Personal Access Token (PAT) with 'repo'"
  echo "scope instead of your account password."
  echo "Generate one at: https://github.com/settings/tokens"
  echo "--------------------------------------------------"
fi

echo ""
read -p "Press [Enter] to exit..."
