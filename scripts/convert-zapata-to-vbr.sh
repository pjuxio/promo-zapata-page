#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   bash scripts/convert-zapata-to-vbr.sh [bitrate] [output_dir]
# Example:
#   bash scripts/convert-zapata-to-vbr.sh 128k mp3/128kbps
#
# bitrate: constant bitrate, default 128k
bitrate="${1:-128k}"
output_dir="${2:-mp3/128kbps}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg is not installed or not in PATH." >&2
  echo "Install it (macOS): brew install ffmpeg" >&2
  exit 1
fi

if [[ ! "$bitrate" =~ ^[0-9]+k$ ]]; then
  echo "Error: bitrate must be in the form <number>k, for example 128k." >&2
  exit 1
fi

files=(
  "mp3/Zapata Lost Tape 01.mp3"
  "mp3/Zapata Lost Tape 02.mp3"
  "mp3/Zapata Lost Tape 03.mp3"
  "mp3/Zapata Lost Tape 04.mp3"
  "mp3/Zapata Lost Tape 05.mp3"
  "mp3/Zapata Lost Tape 06.mp3"
)

mkdir -p "$output_dir"

converted=0
skipped=0

for input in "${files[@]}"; do
  if [[ ! -f "$input" ]]; then
    echo "Skipping missing file: $input"
    ((skipped+=1))
    continue
  fi

  base_name="$(basename "$input" .mp3)"
  output="$output_dir/${base_name} (${bitrate}).mp3"

  echo "Converting: $input -> $bitrate"
  ffmpeg -hide_banner -loglevel error -y \
    -i "$input" \
    -codec:a libmp3lame \
    -b:a "$bitrate" \
    -minrate "$bitrate" \
    -maxrate "$bitrate" \
    -bufsize 2M \
    -map_metadata 0 \
    -id3v2_version 3 \
    "$output"

  echo "Created: $output"
  ((converted+=1))
done

echo "Done. Converted: $converted | Skipped: $skipped | Output dir: $output_dir"
