#!/bin/bash
open -na "Google Chrome" --args --user-data-dir="${HOME}/Library/Application Support/Google/Chrome" --profile-directory="Default" "$@" 
echo "In Open Script"
