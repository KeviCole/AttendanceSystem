#!/bin/bash

# Usage: find_student.sh ID PASSWORD
ID="$1"
PASSWORD="$2"

if [[ ${#ID} -ne 7 ]]; then
    echo "ID must be 7 characters long (e.g., AB12345)."
    exit 1
fi

if [[ ${#PASSWORD} -ne 10 ]]; then
    echo "Password must be exactly 10 characters."
    exit 1
fi

CURRENT_DIR="/home/students"
for ((i=0; i<${#ID}; i++)); do
    char="${ID:$i:1}"
    CURRENT_DIR="$CURRENT_DIR/$char"
    if [[ ! -d "$CURRENT_DIR" ]]; then
        echo "Directory path for ID not found!"
        exit 1
    fi
done

echo "Student ID located: $CURRENT_DIR"

# Log UNIX timestamp
echo "$(date +%s)" >> "$CURRENT_DIR/timestamp.txt"
echo "Timestamp updated."

exit 0
