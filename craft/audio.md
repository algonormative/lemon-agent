---
title: "Lemon Agent for Audio"
craft: audio
status: v0
updated: 2026-08-15
description: "Use an agent to measure, organize, and critique audio bounces while you keep the mix decisions in Ableton Live."
---

You already know how to work in Ableton Live. The useful role for an
agent is not “make this warmer.” It is to inspect an exported file,
compare it with a reference, and give you measurements and listening
questions you can act on in the DAW.

The agent handles repeatable checks. **Your ears and taste make the mix.**

## Audit your next bounce

Export a WAV from Ableton, choose one reference track, and put both in a
small review folder. Keep the previous bounce instead of overwriting it.

```text
bounce-review/
  mix-v03.wav
  reference.wav
  brief.md
```

In `brief.md`, state the destination, what you changed, and what you are
unsure about. Then give the folder to a file-capable agent with this job:

```text
Audit mix-v03.wav against reference.wav. Do not edit or overwrite either
audio file. Use available deterministic tools before making listening
claims. Measure file format, channels, sample rate, duration, integrated
loudness, loudness range, true peak, silence, and broad spectral balance.
If a check cannot be run, mark it "not measured" rather than guessing.

Write bounce-audit.md with: (1) a measurement table for both files,
(2) any failed export gates, (3) no more than three differences worth
listening for, each tied to a measurement, and (4) no more than three
specific experiments to try in Ableton. Separate facts from judgment.
Do not claim a mix problem from a number alone.
```

The artifact is `bounce-audit.md`: a receipt you can compare with the
next export. Return to Ableton, make the changes you agree with, export
`mix-v04.wav`, and A/B the two versions. That is the loop.

## Starter tools

These are building blocks, not a required stack. Install only what your
agent can use in your own environment.

### FFmpeg

[FFmpeg](https://github.com/FFmpeg/FFmpeg) inspects formats, channels,
duration, peaks, silence, and loudness without opening a DAW.

```sh
brew install ffmpeg
```

### librosa and pyloudnorm

[librosa](https://github.com/librosa/librosa) provides time- and
frequency-domain analysis in Python.
[pyloudnorm](https://github.com/csteinmetz1/pyloudnorm) provides
BS.1770 loudness measurement.

```sh
python -m pip install librosa pyloudnorm
```

## The operating pattern

- **Files first.** Takes, renders, notes, and measurements live together
  where an agent can inspect them. The Ableton project remains the source
  for your creative decisions.
- **Checks before ears.** Catch clipping, silence, wrong duration, and
  wrong export format before spending attention on the mix.
- **Claims carry receipts.** “The low end is crowded” needs a measurement
  and a listening test. Descriptions without either are vibes.
- **New exports, never destructive edits.** Keep the path from raw take to
  current bounce visible.

## What ships next

Everything above works today with public tools. The packaged version is
deliberately narrower: one user, one measurement pass, one receipt.

### Who it is for first

A producer who exports a bounce from a DAW and wants to know whether the
file itself is sound before it leaves the machine — sent to a label,
uploaded, or dropped into a set. Not mastering engineers, not sample-pack
QA at scale. One person, one export, one question: **is there anything
wrong with this file that I would rather not discover later?**

### The one workflow

The studio version runs on [smpl](https://github.com/algonormative/smpl), a
pipe-based audio toolchain that passes NDJSON frames between stages. The
first packaged pass is a single pipe:

```sh
smpl read mix-v03.wav | smpl describe-all | smpl view
```

`describe-all` aggregates the light analysis tier in one pass: loudness,
spectral shape, technical QC, defect markers, and a mel spectrogram.
`view` renders those frames as a readable report and keeps the frames on
stdout for anything downstream. No model download, no account, no hosted
state.

**In:** the exported bounce (`mix-v03.wav`) and a `brief.md` naming the
destination and its loudness target.

**Out:** the frame stream — features carrying units, defect markers with
timestamps, a spectrogram image — and `bounce-audit.md`, the receipt that
stays beside the bounce so the next export has something to be compared
against.

### The instrument

**`audio-bounce-audit`**, an installable skill authored in this repo. It
conducts the practice around that pipe: the versioned review folder, the
brief, the gates, the receipt, and the return to the DAW. It uses smpl
when smpl is on the path and falls back to the FFmpeg measurements above
when it is not, marking anything it could not measure as not measured.

It will not restate smpl's flag surface. The smpl repository already
ships a `smpl-audit` skill for driving the toolchain itself, and this
page links to it rather than copying it.

### The judgment artifact

Reused, not invented: **smpl's QC gate set**.
`qc.clipping.detected` fires on a true peak at or above −0.1 dBTP.
`qc.dc_offset_dbfs` and `qc.snr_db` report offset and noise in named
units. `qc.lossy.confidence` scores whether a WAV was once an MP3, using
a detector that requires a plausible codec cutoff, a steep slope across
it, and a dead shelf above it before it will claim anything. Every key,
unit, and namespace is published in smpl's feature-key registry, so a
number in the report traces back to a definition.

What is still missing is smaller than a failure list: **a one-page bounce
gate table** mapping six checks — export format and duration, integrated
loudness against the stated destination, true peak, clipping, DC offset,
lossy origin — to the exact feature key, unit, threshold, and the reason
that threshold exists. That table is what this craft owes. There is no
Audio Failure List planned; these measurements already carry their own
evidence, and a list invented to match a template would not.

### The worked example

Two files published with smpl's own documentation: `bright.wav`, an airy
texture, and `lossy.wav`, the same texture after a 64 kbps MP3 round trip
back to WAV.

```sh
curl -LO https://algonormative.github.io/smpl/assets/bright.wav
curl -LO https://algonormative.github.io/smpl/assets/lossy.wav

smpl read bright.wav | smpl qc | smpl spectrogram --kind mel | smpl view > /dev/null
smpl read lossy.wav  | smpl qc | smpl spectrogram --kind mel | smpl view > /dev/null
```

Expect `bright.wav` to report a cutoff near 22 kHz with
`qc.lossy.confidence` at 0.0, and `lossy.wav` to report a cutoff near
16.5 kHz with confidence around 0.86. Same texture, same length, one
failed gate. You know the ground truth before you run it, which is the
point: the example shows the check catching something real instead of
describing a file you cannot verify. The spectrogram shows the encoder
ceiling before the number does.

### Who owns what

Three sites touch this material, and each owns one layer:

- **lemon-agent.dev/audio** documents the practice: folder discipline,
  gates, receipts, the loop back into the DAW, and the skill that
  conducts it.
- **[smpl](https://github.com/algonormative/smpl)** documents the tool:
  install, subcommands, the wire protocol, the feature-key registry.
  This page links to that reference and never restates it. A flag
  documented in two places goes stale in one of them.
- **[lemon.audio](https://lemon.audio)** documents the play: toys,
  drops, the flasher, the command-line studio, finished work in a
  weirder register.

Practice here, tool there, play at lemon.audio. When a page here needs a
tool detail, it links.

The implementation work — an unlisted instrument page, the skill, the
gate table, and the worked example — is tracked in the house's task
queue. This page stays out of primary navigation until someone outside
the house runs the audit on a bounce of their own and reports what it
missed.

## Watch out

- **The unproven meter.** Test a new probe on a known file before trusting
  its first surprising result.
- **The ungated bounce.** “Sounds fine here” is not an export check.
- **Selection by memory.** A/B candidates against the reference before
  committing.
- **Optimizing a metric.** Loudness, clarity, and spectral balance are
  constraints and clues, not goals by themselves.
