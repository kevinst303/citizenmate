#!/bin/bash
#
# CitizenMate — Kie.ai Nano Banana 2 Image Generator
# Generates ultra-realistic, consistent images for the landing page
#
# Usage: bash scripts/generate-images.sh
#

set -euo pipefail

API_KEY="${KIE_API_KEY:-e4fc401761f2af571ada5f8837de3c63}"
API_BASE="https://api.kie.ai/api/v1/jobs"
OUTPUT_DIR="$(cd "$(dirname "$0")/../public/generated" 2>/dev/null && pwd || echo "$(dirname "$0")/../public/generated")"
MAX_POLL_SECONDS=120
POLL_INTERVAL=4

# Consistent style directive for ultra-realistic output
STYLE="Ultra-realistic, DSLR-quality editorial photograph shot on Canon EOS R5 with 85mm f/1.4 lens. Natural skin with visible pores, fine hair, and real texture. Absolutely no airbrushed, plastic, or AI-generated skin appearance. Soft natural golden-hour lighting. Subtle film grain for authenticity. Shallow depth of field. Color palette: deep navy blue, warm gold, eucalyptus green, sky blue. Stock photography quality, indistinguishable from a real professional photo."

mkdir -p "$OUTPUT_DIR"

echo "🎨 CitizenMate — Kie.ai Nano Banana 2 Image Generator"
echo "📁 Output: $OUTPUT_DIR"
echo ""

# ── Helper: create a generation task ──
create_task() {
  local prompt="$1"
  local aspect_ratio="${2:-16:9}"
  local resolution="${3:-2K}"

  local response
  response=$(curl -s -X POST "$API_BASE/createTask" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d @- <<EOF
{
  "model": "nano-banana-2",
  "input": {
    "prompt": "$STYLE $prompt",
    "image_input": [],
    "aspect_ratio": "$aspect_ratio",
    "resolution": "$resolution",
    "output_format": "png"
  }
}
EOF
  )

  local code
  code=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin).get('code',''))" 2>/dev/null || echo "")
  
  if [ "$code" != "200" ]; then
    echo "FAILED: $response"
    return 1
  fi

  local task_id
  task_id=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['taskId'])" 2>/dev/null)
  echo "$task_id"
}

# ── Helper: poll until done, return image URL ──
poll_task() {
  local task_id="$1"
  local elapsed=0

  while [ $elapsed -lt $MAX_POLL_SECONDS ]; do
    local response
    response=$(curl -s "$API_BASE/recordInfo?taskId=$task_id" \
      -H "Authorization: Bearer $API_KEY")

    local state
    state=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['state'])" 2>/dev/null || echo "unknown")

    if [ "$state" = "success" ]; then
      local urls
      urls=$(echo "$response" | python3 -c "
import sys, json
data = json.load(sys.stdin)['data']
result = json.loads(data.get('resultJson', '{}'))
urls = result.get('resultUrls', [])
print(urls[0] if urls else '')
" 2>/dev/null)
      echo "$urls"
      return 0
    fi

    if [ "$state" = "fail" ]; then
      local msg
      msg=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin)['data'].get('failMsg','unknown'))" 2>/dev/null)
      echo "FAILED: $msg"
      return 1
    fi

    printf "."
    sleep $POLL_INTERVAL
    elapsed=$((elapsed + POLL_INTERVAL))
  done

  echo "TIMEOUT"
  return 1
}

# ── Helper: download file ──
download_file() {
  local url="$1"
  local dest="$2"
  curl -sL "$url" -o "$dest"
}

# ── Image definitions ──
# Each entry: filename|aspect_ratio|resolution|prompt
IMAGES=(
  "hero-study.png|16:9|2K|A warm, inviting scene of a diverse multicultural group of adults studying together at a modern Australian library. The group includes people of South Asian, East Asian, Middle Eastern, African, and Latin American backgrounds — all smiling, engaged, and helping each other learn. Visible through large windows: iconic Australian harbour, blue sky, eucalyptus trees. Open books, a tablet showing quiz questions, and coffee cups on the table. The mood is hopeful, supportive, and celebratory of new beginnings in Australia. Natural candid moment."
  "feature-tests.png|3:2|2K|Close-up of a confident young woman of South Asian descent using a modern tablet to take a practice citizenship test. The screen shows a clean quiz interface with multiple-choice questions. She is seated at a bright airy desk with a small Australian flag pin on her notebook. Soft bokeh background of a modern Australian home interior. Expression: focused yet calm and empowered. Natural candid portrait."
  "feature-bilingual.png|3:2|2K|A warm scene showing a young man of East Asian background studying with a bilingual book — English on one page and Chinese characters on the facing page. He is seated in a cozy Australian cafe with eucalyptus sprigs in a vase nearby. Books in multiple languages stacked beside him — Arabic, Hindi, Vietnamese, Mandarin. The mood is inclusive and empowering — learning in your own language to succeed in English. Natural warm portrait."
  "feature-progress.png|3:2|2K|A joyful young woman of African background looking at a laptop screen showing a dashboard with progress charts, green checkmarks, and achievement badges. She is smiling with a fist pump of celebration. Setting: bright modern Australian apartment with sunny suburban view through the window. The laptop screen shows circular progress rings at 85 percent completion in green and gold colors. Mood: achievement, confidence, readiness. Candid natural shot."
  "how-it-works-bg.png|16:9|2K|A serene, wide Australian landscape background. Soft rolling eucalyptus-covered hills under a vast blue sky with scattered white clouds. Golden afternoon sunlight bathes the scene. Gentle peaceful color palette of sage green, sky blue, soft gold, and cream. Clean minimal composition. Slightly dreamy atmosphere with a sense of openness, welcome, and possibility. No people. Real landscape photography."
  "social-proof-people.png|16:9|2K|A heartwarming group photo of newly inducted Australian citizens at an outdoor citizenship ceremony. A diverse group of 8 adults from different cultures — wearing smart casual clothes, some holding small Australian flags, all beaming with pride and joy. Behind them is a large Australian coat of arms banner. The group includes people of Indian, Filipino, Chinese, Lebanese, Somali, Colombian, and Vietnamese backgrounds. Children present too. The mood is emotional, proud, and joyously celebratory. Natural group photograph."
  "cta-australia.png|16:9|2K|Breathtaking panoramic view of Sydney Harbour at golden hour. The Opera House and Harbour Bridge illuminated in warm golden light reflecting off calm water. Silhouettes of a small diverse family — parents of different cultural backgrounds with two children — standing on a lookout point at the railing, gazing at the view with arms around each other. The sky painted in warm oranges, golds, and soft blues. Mood: hopeful, forward-looking, a family beginning an exciting new chapter in Australia. Cinematic landscape photography."
  "og-image.png|16:9|2K|A professional, clean hero composition for a social media Open Graph card. On the left side: a warm photo of a diverse group of 5 happy multicultural adults holding small Australian flags at a citizenship ceremony, dressed smartly. On the right side: a clean illustration of a modern phone showing a quiz app with green checkmarks. Background: soft elegant gradient from deep navy blue to warm gold. Subtle Australian Southern Cross star pattern. Professional, trustworthy, and inviting composition."
)

SUCCESS=0
FAILED=0
SKIPPED=0

for entry in "${IMAGES[@]}"; do
  IFS='|' read -r filename aspect_ratio resolution prompt <<< "$entry"

  # Skip if already exists
  if [ -f "$OUTPUT_DIR/$filename" ]; then
    echo "  ⏭  $filename — already exists, skipping"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  printf "  🔄 %s " "$filename"

  # Create task
  task_id=$(create_task "$prompt" "$aspect_ratio" "$resolution")
  
  if [[ "$task_id" == FAILED* ]]; then
    echo "❌ Task creation failed: $task_id"
    FAILED=$((FAILED + 1))
    sleep 2
    continue
  fi

  printf "[%s] " "$task_id"

  # Poll for result
  image_url=$(poll_task "$task_id")
  
  if [[ "$image_url" == FAILED* ]] || [[ "$image_url" == TIMEOUT* ]] || [ -z "$image_url" ]; then
    echo " ❌ $image_url"
    FAILED=$((FAILED + 1))
    sleep 2
    continue
  fi

  echo "" # newline after dots

  # Download
  download_file "$image_url" "$OUTPUT_DIR/$filename"
  
  filesize=$(du -k "$OUTPUT_DIR/$filename" | cut -f1)
  echo "  ✅ $filename — ${filesize} KB"
  SUCCESS=$((SUCCESS + 1))

  # Brief delay between requests
  sleep 2
done

echo ""
echo "📊 Results: $SUCCESS generated, $FAILED failed, $SKIPPED skipped"
echo "🎉 Done!"
