# ZMK Local Development Setup - Working Steps

## Prerequisites
- Docker installed
- Terminal access

## Initial Setup (One-time)

1. **Clone ZMK as sibling to knoblincore:**
```bash
cd /Users/sperlmutter/dev/keyboard
git clone https://github.com/zmkfirmware/zmk.git
```

2. **Pull base Docker image:**
```bash
docker pull zmkfirmware/zmk-dev-arm:3.5
```

3. **Build ZMK Docker container:**
```bash
cd zmk
docker build -t zmk-dev -f .devcontainer/Dockerfile .devcontainer/
```

4. **Initialize Zephyr workspace:**
```bash
docker run --rm \
  --workdir /workspaces/zmk \
  -v $(pwd):/workspaces/zmk \
  -v /Users/sperlmutter/dev/keyboard/knoblincore:/workspaces/zmk-config \
  zmk-dev /bin/bash -c "west init -l app/ && west update"
```

## Build Knoblincore Firmware

**From `/Users/sperlmutter/dev/keyboard/zmk` directory:**
```bash
docker run --rm \
  --workdir /workspaces/zmk \
  -v $(pwd):/workspaces/zmk \
  -v /Users/sperlmutter/dev/keyboard/knoblincore:/workspaces/zmk-config \
  zmk-dev /bin/bash -c "west build -s app -b nice_nano_v2 -- -DSHIELD=knoblin -DZMK_CONFIG='/workspaces/zmk-config'"
```

## Firmware Location
- **Built firmware:** `/Users/sperlmutter/dev/keyboard/zmk/build/zephyr/zmk.uf2`
- **Flash to Nice!Nano:** Double-click reset, copy UF2 file to USB storage

## Directory Structure
```
/Users/sperlmutter/dev/keyboard/
├── knoblincore/          # Your keyboard config (shield files)
└── zmk/                  # ZMK firmware repo
    └── build/zephyr/zmk.uf2  # Built firmware
```

## Benefits
- ✅ Local builds in ~2-3 minutes
- ✅ Full compiler error visibility in terminal
- ✅ No GitHub Actions delays
- ✅ Immediate iteration on firmware changes