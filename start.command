#!/bin/bash
# Start local HTTP server and open Office VR in default browser
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

PORT=8000
echo "=================================================="
echo " Starting Office VR Digital Twin Server on :$PORT "
echo "=================================================="

# Check if port is already in use, if so pick another
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
  PORT=8080
fi

# Open browser after 1 second delay
(sleep 1 && open "http://localhost:$PORT") &

python3 -m http.server $PORT

