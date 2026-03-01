"""Convert ALL GTZAN .au files to .wav for full audio playback"""
import os
import soundfile as sf

src = "/Users/deepakkurapati/Downloads/genres"
dst = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'audio')
os.makedirs(dst, exist_ok=True)

total, success, failed = 0, 0, 0
for genre in os.listdir(src):
    genre_path = os.path.join(src, genre)
    if not os.path.isdir(genre_path): continue
    out_dir = os.path.join(dst, genre)
    os.makedirs(out_dir, exist_ok=True)
    files = [f for f in os.listdir(genre_path) if f.endswith('.au')]
    for f in files:
        total += 1
        in_path = os.path.join(genre_path, f)
        out_path = os.path.join(out_dir, f.replace('.au', '.wav'))
        if os.path.exists(out_path):
            success += 1
            continue
        try:
            data, sr = sf.read(in_path)
            sf.write(out_path, data, sr)
            success += 1
            print(f"✓ [{success}/{total}] {genre}/{f}")
        except Exception as e:
            failed += 1
            print(f"✗ {genre}/{f}: {e}")

print(f"\n✅ Done! {success} converted, {failed} failed out of {total} total files.")
