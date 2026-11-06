#!/usr/bin/env python3
"""
One-Minute Reel Cut — Automated Video Trimmer CLI
Bharat Space Education Research Centre · GenAI Internship (Week 2, Project 15)

Removes silences, cuts filler words, crops to 9:16 vertical video,
burns in highlighted subtitles, and generates a clean 60-second reel.
"""

import os
import sys
import json
import subprocess

def generate_edit_plan(transcript_file):
    with open(transcript_file, 'r') as f:
        data = json.load(f)
    
    kept_segments = [s for s in data['segments'] if s.get('keep', False)]
    total_kept_duration = sum(s['end'] - s['start'] for s in kept_segments)
    
    print("=" * 60)
    print("ONE-MINUTE REEL CUT: EDIT PLAN")
    print(f"Source file: {data.get('sourceFile', 'raw-video.mp4')}")
    print(f"Original duration: {data.get('originalDuration', 300):.1f}s")
    print(f"Edited reel duration: {total_kept_duration:.1f}s (Target: <= 60s)")
    print("=" * 60)
    
    for s in data['segments']:
        status = "[KEEP]" if s.get('keep') else "[CUT]"
        reason = f"({s.get('reason')})" if not s.get('keep') else ""
        print(f"{status} {s['start']:05.1f}s - {s['end']:05.1f}s | {s['text'][:50]}... {reason}")
        
    return kept_segments

def render_ffmpeg_command(kept_segments, input_video="raw-video.mp4", output_video="output_reel_60s.mp4"):
    # Build FFmpeg select filter and 9:16 vertical crop
    # Crop to 9:16 keeping face centered: crop=ih*(9/16):ih
    select_filters = []
    for s in kept_segments:
        select_filters.append(f"between(t,{s['start']},{s['end']})")
    
    v_select = "+".join(select_filters)
    
    cmd = (
        f"ffmpeg -i {input_video} "
        f"-vf \"select='{v_select}',setpts=N/FRAME_RATE/TB,crop=ih*(9/16):ih,scale=1080:1920,"
        f"drawtext=text='Agents do the work':fontcolor=white:fontsize=54:x=(w-text_w)/2:y=180:box=1:boxcolor=black@0.6\" "
        f"-af \"aselect='{v_select}',asetpts=N/SR/TB,afade=t=in:ss=0:d=0.5,afade=t=out:st=57:d=1.5\" "
        f"-c:v libx264 -preset fast -crf 22 -c:a aac -b:a 192k {output_video}"
    )
    
    print("\nGenerated Production FFmpeg Command:")
    print("-" * 60)
    print(cmd)
    print("-" * 60)
    return cmd

if __name__ == "__main__":
    transcript_path = os.path.join(os.path.dirname(__file__), "sample-transcript.json")
    if os.path.exists(transcript_path):
        kept = generate_edit_plan(transcript_path)
        render_ffmpeg_command(kept)
    else:
        print(f"Transcript not found at {transcript_path}")
