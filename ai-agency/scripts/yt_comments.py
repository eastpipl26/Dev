"""
yt_comments.py — yt-dlp 기반 YouTube 댓글 수집
사용법:
  # 단일 영상
  python scripts/yt_comments.py --url "https://youtu.be/VIDEO_ID" --max 200

  # JSON 파일에서 상위 N개 영상 일괄 수집
  python scripts/yt_comments.py --from outputs/raw/260410_휴대용_유모차기_videos.json --max 100 --top 5

출력: outputs/raw/YYMMDD_<slug>_comments.json
"""
import os
import sys
import json
import argparse
import re
from datetime import datetime
from pathlib import Path

try:
    import yt_dlp
except ImportError:
    print("❌ yt-dlp 패키지가 없습니다.")
    print("   실행: pip install yt-dlp")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT / "outputs" / "raw"


def slugify(text: str) -> str:
    text = re.sub(r"[\\/:*?\"<>|]", "", text)
    text = re.sub(r"\s+", "_", text.strip())
    return text[:40]


def is_valid_comment(text: str) -> bool:
    """스팸/이모지뿐인 댓글 필터."""
    if not text or len(text.strip()) < 3:
        return False
    # 한글/영문/숫자가 하나도 없으면 이모지/기호뿐
    if not re.search(r"[가-힣a-zA-Z0-9]", text):
        return False
    # 스팸 의심 키워드
    spam_patterns = ["구독", "맞구독", "subscribe back", "first!", "1등"]
    text_lower = text.lower()
    if any(p in text_lower for p in spam_patterns) and len(text) < 20:
        return False
    return True


def fetch_comments(video_url: str, max_comments: int):
    """yt-dlp로 한 영상의 댓글 수집."""
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "getcomments": True,
        "extractor_args": {
            "youtube": {
                "max_comments": [str(max_comments), "all", "0", "0"],
                "comment_sort": ["top"],
            }
        },
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(video_url, download=False)

    comments_raw = info.get("comments") or []
    video_title = info.get("title", "")

    comments = []
    for c in comments_raw:
        text = c.get("text", "")
        if not is_valid_comment(text):
            continue
        comments.append({
            "text": text.strip(),
            "author": c.get("author", ""),
            "likes": c.get("like_count") or 0,
            "timestamp": c.get("timestamp"),
            "is_reply": c.get("parent") != "root",
        })

    return {
        "video_id": info.get("id"),
        "video_title": video_title,
        "video_url": video_url,
        "total_fetched": len(comments_raw),
        "after_filter": len(comments),
        "comments": comments,
    }


def load_video_urls_from_json(json_path: Path, top: int):
    """3-C에서 만든 JSON을 읽어 상위 top개 영상 URL 반환."""
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    videos = data.get("videos", [])
    if not videos:
        print(f"❌ {json_path}에 videos 필드가 비어있습니다.")
        sys.exit(1)
    return {
        "query": data.get("query", json_path.stem),
        "urls": [(v["url"], v["title"], v["view_count"]) for v in videos[:top]],
    }


def main():
    parser = argparse.ArgumentParser(description="YouTube 댓글 수집")
    src = parser.add_mutually_exclusive_group(required=True)
    src.add_argument("--url", help="단일 영상 URL")
    src.add_argument("--from", dest="source_json",
                     help="3-C 결과 JSON 파일 경로")
    parser.add_argument("--max", type=int, default=200,
                        help="영상당 최대 댓글 수 (기본: 200)")
    parser.add_argument("--top", type=int, default=5,
                        help="--from 사용 시 상위 몇 개 영상 (기본: 5)")
    args = parser.parse_args()

    results = []
    query_slug = "single"

    if args.url:
        print(f"🔍 댓글 수집 중: {args.url}")
        try:
            r = fetch_comments(args.url, args.max)
            results.append(r)
            query_slug = slugify(r["video_title"])[:30]
            print(f"   ✅ {r['after_filter']}개 (필터 전 {r['total_fetched']}개)")
        except Exception as e:
            print(f"   ❌ 실패: {e}")
            sys.exit(1)

    else:  # --from
        src_path = Path(args.source_json)
        if not src_path.exists():
            print(f"❌ 파일 없음: {src_path}")
            sys.exit(1)
        meta = load_video_urls_from_json(src_path, args.top)
        query_slug = slugify(meta["query"])
        print(f"🔍 소스: {meta['query']} (상위 {len(meta['urls'])}개 영상)")

        for i, (url, title, views) in enumerate(meta["urls"], 1):
            print(f"\n[{i}/{len(meta['urls'])}] {title[:50]}... ({views:,}회)")
            try:
                r = fetch_comments(url, args.max)
                results.append(r)
                print(f"   ✅ {r['after_filter']}개 (필터 전 {r['total_fetched']}개)")
            except Exception as e:
                print(f"   ⚠️  스킵: {e}")
                continue

    # 저장
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    date_str = datetime.now().strftime("%y%m%d")
    out_path = OUTPUT_DIR / f"{date_str}_{query_slug}_comments.json"

    total_comments = sum(r["after_filter"] for r in results)
    payload = {
        "source": args.source_json or args.url,
        "collected_at": datetime.now().isoformat(),
        "video_count": len(results),
        "total_comments": total_comments,
        "videos": results,
    }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 저장 완료: {out_path}")
    print(f"   총 {len(results)}개 영상, {total_comments}개 댓글")


if __name__ == "__main__":
    main()
