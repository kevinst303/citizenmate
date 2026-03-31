#!/usr/bin/env python3
"""
CitizenMate - Kie.ai Nano Banana 2 Image Generator
Generates ultra-realistic, consistent images for the landing page.

Usage: python3 scripts/generate-images.py
"""

import json
import os
import ssl
import sys
import time
import urllib.request
import urllib.error

# Fix macOS SSL certificate issue
ssl_ctx = ssl.create_default_context()
try:
    import certifi
    ssl_ctx.load_verify_locations(certifi.where())
except ImportError:
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE

API_KEY = os.environ.get("KIE_API_KEY", "e4fc401761f2af571ada5f8837de3c63")
API_BASE = "https://api.kie.ai/api/v1/jobs"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "generated")
MAX_POLL_SECONDS = 180
POLL_INTERVAL = 5

# Ultra-realistic style directive
STYLE = (
    "Ultra-realistic, DSLR-quality editorial photograph shot on Canon EOS R5 "
    "with 85mm f/1.4 lens. Natural skin with visible pores, fine hair, and "
    "real texture. Absolutely no airbrushed, plastic, or AI-generated skin "
    "appearance. Soft natural golden-hour lighting. Subtle film grain for "
    "authenticity. Shallow depth of field. Color palette: deep navy blue, "
    "warm gold, eucalyptus green, sky blue. Stock photography quality, "
    "indistinguishable from a real professional photo."
)

IMAGES = [
    {
        "filename": "hero-study.png",
        "aspect_ratio": "16:9",
        "resolution": "2K",
        "prompt": (
            "A warm, inviting scene of a diverse multicultural group of adults "
            "studying together at a modern Australian library. The group includes "
            "people of South Asian, East Asian, Middle Eastern, African, and Latin "
            "American backgrounds, all smiling, engaged, and helping each other learn. "
            "Visible through large windows: iconic Australian harbour, blue sky, "
            "eucalyptus trees. Open books, a tablet showing quiz questions, and "
            "coffee cups on the table. The mood is hopeful, supportive, and "
            "celebratory of new beginnings in Australia. Natural candid moment."
        ),
    },
    {
        "filename": "feature-tests.png",
        "aspect_ratio": "3:2",
        "resolution": "2K",
        "prompt": (
            "Close-up of a confident young woman of South Asian descent using "
            "a modern tablet to take a practice citizenship test. The screen "
            "shows a clean quiz interface with multiple-choice questions. She is "
            "seated at a bright airy desk with a small Australian flag pin on her "
            "notebook. Soft bokeh background of a modern Australian home interior. "
            "Expression: focused yet calm and empowered. Natural candid portrait."
        ),
    },
    {
        "filename": "feature-bilingual.png",
        "aspect_ratio": "3:2",
        "resolution": "2K",
        "prompt": (
            "A warm scene showing a young man of East Asian background studying "
            "with a bilingual book, English on one page and Chinese characters on "
            "the facing page. He is seated in a cozy Australian cafe with eucalyptus "
            "sprigs in a vase nearby. Books in multiple languages stacked beside him: "
            "Arabic, Hindi, Vietnamese, Mandarin. The mood is inclusive and "
            "empowering, learning in your own language to succeed in English. "
            "Natural warm candid portrait."
        ),
    },
    {
        "filename": "feature-progress.png",
        "aspect_ratio": "3:2",
        "resolution": "2K",
        "prompt": (
            "A joyful young woman of African background looking at a laptop screen "
            "showing a dashboard with progress charts, green checkmarks, and "
            "achievement badges. She is smiling with a fist pump of celebration. "
            "Setting: bright modern Australian apartment with sunny suburban view "
            "through the window. The laptop screen shows circular progress rings at "
            "85 percent completion in green and gold colors. Mood: achievement, "
            "confidence, readiness. Candid natural shot."
        ),
    },
    {
        "filename": "how-it-works-bg.png",
        "aspect_ratio": "16:9",
        "resolution": "2K",
        "prompt": (
            "A serene, wide Australian landscape background. Soft rolling "
            "eucalyptus-covered hills under a vast blue sky with scattered white "
            "clouds. Golden afternoon sunlight bathes the scene. Gentle peaceful "
            "color palette of sage green, sky blue, soft gold, and cream. Clean "
            "minimal composition. Slightly dreamy atmosphere with a sense of "
            "openness, welcome, and possibility. No people. Real landscape "
            "photography."
        ),
    },
    {
        "filename": "social-proof-people.png",
        "aspect_ratio": "16:9",
        "resolution": "2K",
        "prompt": (
            "A heartwarming group photo of newly inducted Australian citizens at "
            "an outdoor citizenship ceremony. A diverse group of 8 adults from "
            "different cultures, wearing smart casual clothes, some holding small "
            "Australian flags, all beaming with pride and joy. Behind them is a "
            "large Australian coat of arms banner. The group includes people of "
            "Indian, Filipino, Chinese, Lebanese, Somali, Colombian, and Vietnamese "
            "backgrounds. Children present too. The mood is emotional, proud, and "
            "joyously celebratory. Natural group photograph."
        ),
    },
    {
        "filename": "cta-australia.png",
        "aspect_ratio": "16:9",
        "resolution": "2K",
        "prompt": (
            "Breathtaking panoramic view of Sydney Harbour at golden hour. The "
            "Opera House and Harbour Bridge illuminated in warm golden light "
            "reflecting off calm water. Silhouettes of a small diverse family, "
            "parents of different cultural backgrounds with two children, standing "
            "on a lookout point at the railing, gazing at the view with arms around "
            "each other. The sky painted in warm oranges, golds, and soft blues. "
            "Mood: hopeful, forward-looking, a family beginning an exciting new "
            "chapter in Australia. Cinematic landscape photography."
        ),
    },
    {
        "filename": "og-image.png",
        "aspect_ratio": "16:9",
        "resolution": "2K",
        "prompt": (
            "A professional, clean hero composition for a social media card. On the "
            "left side: a warm photo of a diverse group of 5 happy multicultural "
            "adults holding small Australian flags at a citizenship ceremony, dressed "
            "smartly. On the right side: a clean modern phone showing a quiz app with "
            "green checkmarks. Background: soft elegant gradient from deep navy blue "
            "to warm gold. Subtle Australian Southern Cross star pattern. "
            "Professional, trustworthy, and inviting composition."
        ),
    },
    {
        "filename": "dash-welcome.png",
        "aspect_ratio": "21:9",
        "resolution": "2K",
        "prompt": (
            "A welcoming over-the-shoulder shot of a diverse individual sitting at "
            "a clean, modern desk in an Australian home, looking at a beautiful "
            "tablet displaying a study plan. A stylized map of Australia is pinned "
            "to the corkboard in front of them. A steaming coffee cup and eucalyptus "
            "leaves on the desk. Warm, bright morning sunlight streaming through "
            "the window, representing a fresh start and motivation for the day's study."
        ),
    },
    {
        "filename": "dash-goal.png",
        "aspect_ratio": "3:2",
        "resolution": "2K",
        "prompt": (
            "Close-up, top-down view of multicultural hands using a nice pen to "
            "confidently circle a date on a physical desktop calendar. Next to the "
            "calendar sits a small Australian flag and a sprig of eucalyptus. "
            "Warm golden hour light highlights the hands. Motif of setting a goal "
            "and taking action. Professional, clean, and motivating photography."
        ),
    },
    {
        "filename": "study-header.png",
        "aspect_ratio": "21:9",
        "resolution": "2K",
        "prompt": (
            "An optimistic, wide cinematic shot of a diverse group of four people "
            "sitting casually on the grass in a sunny, beautiful Australian park. "
            "They are laughing and discussing a study booklet ('Our Common Bond' style), "
            "sharing knowledge. In the background, softly blurred Australian flora "
            "and a hint of a city skyline. Symbolizes the shared journey of learning "
            "Australian history and values together."
        ),
    },
    {
        "filename": "topic-people.png",
        "aspect_ratio": "3:2",
        "resolution": "2K",
        "prompt": (
            "A beautiful editorial portrait capturing the diversity of Australia. "
            "A group of three modern Australians (Indigenous, Anglo-Celtic, and "
            "East Asian heritage) sharing a laugh over a casual outdoor meal. "
            "Subtle, tasteful Aboriginal art motifs seamlessly integrated into the "
            "modern cafe background wall. Warm, inviting, and representative of "
            "a harmonious, multicultural society."
        ),
    },
    {
        "filename": "topic-beliefs.png",
        "aspect_ratio": "3:2",
        "resolution": "2K",
        "prompt": (
            "Breathtaking twilight photography of the Australian Parliament House "
            "in Canberra. The distinctive flagpole is illuminated against a deep "
            "navy and magenta sunset sky. Clean, majestic, and awe-inspiring. "
            "Symbolizes democracy, freedom of speech, and the core rights and "
            "liberties of Australian citizens. Shot from a low, empowering angle."
        ),
    },
    {
        "filename": "topic-gov.png",
        "aspect_ratio": "3:2",
        "resolution": "2K",
        "prompt": (
            "A professional, modern scene inside a bright, contemporary Australian "
            "government building or courtroom. Soft, diffused lighting illuminating "
            "wooden textures and the Australian coat of arms subtly in the background. "
            "A diverse professional woman in a crisp suit confidently reviewing a "
            "document. Conveys fairness, equality, governance, and the rule of law "
            "in a modern democratic society."
        ),
    },
    {
        "filename": "test-start.png",
        "aspect_ratio": "3:2",
        "resolution": "2K",
        "prompt": (
            "A close-up portrait of a young man of Middle Eastern descent taking "
            "a deep breath, eyes closed with a gentle, confident smile, holding "
            "a tablet in his hands right before starting a test. Soft, focused, "
            "warm indoor lighting representing deep concentration and mental "
            "preparation. The background is a dark, quiet library setting. "
            "Conveys encouragement and calm readiness."
        ),
    },
    {
        "filename": "result-pass.png",
        "aspect_ratio": "16:9",
        "resolution": "2K",
        "prompt": (
            "Exuberant celebration! A young woman of dynamic mixed heritage "
            "throwing her hands up in absolute joy, cheering loudly. She is holding "
            "up a digital tablet displaying large green checkmarks and a 100% score. "
            "Out of focus in the background, friends are clapping and celebrating "
            "with her. Bright, saturated, incredibly happy colors. Confetti-like "
            "bokeh in the sunlight. Pure elation and relief."
        ),
    },
    {
        "filename": "result-tryagain.png",
        "aspect_ratio": "16:9",
        "resolution": "2K",
        "prompt": (
            "A highly empathetic and supportive scene. A person looking determined "
            "but thoughtful, pointing at a study guide on a table. Sitting right "
            "beside them is an encouraging mentor or friend with a warm, reassuring "
            "hand on their shoulder, smiling supportively. Warm, soft lighting that "
            "feels safe and comforting. The visual message is 'Don't give up, "
            "you will get it next time.' Natural, candid emotion."
        ),
    },
    {
        "filename": "modal-test-date.png",
        "aspect_ratio": "16:9",
        "resolution": "2K",
        "prompt": (
            "A breathtaking, highly stylized sunrise over a famous Australian "
            "beach (like Bondi or Whitehaven). The sky is exploding with vibrant "
            "pinks, oranges, and golds, reflecting perfectly on the gentle surf. "
            "In the foreground, a subtle, beautiful abstract representation of a "
            "calendar page fluttering in the sea breeze. Symbolizes a new dawn, "
            "setting a life-changing goal, and looking forward to the future."
        ),
    },
    {
        "filename": "avatar-tutor.png",
        "aspect_ratio": "1:1",
        "resolution": "2K",
        "prompt": (
            "A hyper-realistic close-up portrait avatar for an AI chatbot. "
            "A remarkably friendly, approachable professional of mixed cultural "
            "heritage (e.g., Afro-Latina or Eurasian), looking directly into the "
            "lens with a genuinely warm, helpful smile. She is wearing a neat, "
            "modern navy-blue jacket. Crisp lighting against a clean, softly blurred "
            "background. Inspires immense trust and approachability."
        ),
    },
]


def api_request(url, method="GET", data=None):
    """Make an API request to kie.ai."""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req, timeout=30, context=ssl_ctx) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body_text = e.read().decode() if e.fp else ""
        print(f"\n    HTTP {e.code}: {body_text}")
        raise
    except Exception as e:
        print(f"\n    Request error: {e}")
        raise


def create_task(image_def):
    """Create an image generation task."""
    full_prompt = f"{STYLE} {image_def['prompt']}"
    payload = {
        "model": "nano-banana-2",
        "input": {
            "prompt": full_prompt,
            "image_input": [],
            "aspect_ratio": image_def["aspect_ratio"],
            "resolution": image_def["resolution"],
            "output_format": "png",
        },
    }
    result = api_request(f"{API_BASE}/createTask", method="POST", data=payload)
    if result.get("code") != 200:
        raise Exception(f"API error: {result.get('msg', 'unknown')}")
    return result["data"]["taskId"]


def poll_task(task_id):
    """Poll task until success or failure."""
    elapsed = 0
    while elapsed < MAX_POLL_SECONDS:
        result = api_request(f"{API_BASE}/recordInfo?taskId={task_id}")
        state = result.get("data", {}).get("state", "unknown")

        if state == "success":
            result_json = json.loads(result["data"].get("resultJson", "{}"))
            urls = result_json.get("resultUrls", [])
            return urls[0] if urls else None

        if state == "fail":
            msg = result["data"].get("failMsg", "unknown")
            raise Exception(f"Generation failed: {msg}")

        sys.stdout.write(".")
        sys.stdout.flush()
        time.sleep(POLL_INTERVAL)
        elapsed += POLL_INTERVAL

    raise Exception(f"Timed out after {MAX_POLL_SECONDS}s")


def download_file(url, dest_path):
    """Download a file from URL."""
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) CitizenMate/1.0",
    })
    with urllib.request.urlopen(req, context=ssl_ctx) as resp:
        with open(dest_path, 'wb') as f:
            f.write(resp.read())


def main():
    print("🎨 CitizenMate — Kie.ai Nano Banana 2 Image Generator\n")
    print(f"📁 Output: {OUTPUT_DIR}")
    print()

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    existing = set(os.listdir(OUTPUT_DIR))
    to_generate = []
    for img in IMAGES:
        if img["filename"] in existing:
            print(f"  ⏭  {img['filename']} — already exists, skipping")
        else:
            to_generate.append(img)

    if not to_generate:
        print("\n✅ All images already generated! Delete files to regenerate.")
        return

    print(f"\n🖼  Generating {len(to_generate)} images...\n")

    success = 0
    failed = 0

    for img in to_generate:
        try:
            sys.stdout.write(f"  🔄 {img['filename']} ")
            sys.stdout.flush()

            task_id = create_task(img)
            sys.stdout.write(f"[{task_id[:12]}...] ")
            sys.stdout.flush()

            image_url = poll_task(task_id)
            if not image_url:
                raise Exception("No result URL returned")

            dest = os.path.join(OUTPUT_DIR, img["filename"])
            download_file(image_url, dest)

            size_kb = os.path.getsize(dest) // 1024
            print(f" ✅ ({size_kb} KB)")
            success += 1

        except Exception as e:
            print(f" ❌ {e}")
            failed += 1

        time.sleep(2)  # Brief delay between requests

    skipped = len(IMAGES) - len(to_generate)
    print(f"\n📊 Results: {success} generated, {failed} failed, {skipped} skipped")
    print("🎉 Done!")


if __name__ == "__main__":
    main()
