#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=================================================="
echo "    🚀 Deploy Office VR to GitHub Pages           "
echo "=================================================="
echo ""

# Ensure git branch is main
git branch -M main

# Check if origin already set
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null)

if [ -n "$CURRENT_REMOTE" ]; then
  echo "Current remote origin: $CURRENT_REMOTE"
  read -p "Do you want to push to this remote? (y/n): " CONFIRM
  if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
    git push -u origin main
    exit 0
  else
    git remote remove origin
  fi
fi

echo "Opening GitHub in your default browser to create 'office-vr'..."
open "https://github.com/new?name=office-vr&description=Office+VR+Digital+Twin+WebXR"

echo ""
echo "--------------------------------------------------"
echo "Step 1: On the GitHub page that just opened, click"
echo "        the green 'Create repository' button."
echo "Step 2: Copy the HTTPS or SSH repository URL and paste"
echo "        it below (e.g. https://github.com/username/office-vr.git):"
echo "--------------------------------------------------"
echo ""
read -p "Paste repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
  echo "No URL provided. You can run this script again anytime!"
  exit 1
fi

git remote add origin "$REPO_URL"
echo ""
echo "Pushing codebase and PBR assets to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "=================================================="
  echo " ✅ PUSH SUCCESSFUL!                              "
  echo "=================================================="
  echo ""
  echo "Final step to make it live:"
  echo "1. Go to your repo on GitHub: Settings > Pages"
  echo "2. Under 'Branch', select 'main' and '/ (root)'"
  echo "3. Click 'Save'"
  echo ""
  echo "Your VR Office will be online in ~1 minute!"
  echo "=================================================="
else
  echo ""
  echo "❌ Push failed. Please check your credentials or SSH keys and try again."
fi

