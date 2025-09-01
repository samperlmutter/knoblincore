# CLAUDE.md - Knoblin Firmware Project

## Overview
Knoblin is a custom mechanical keyboard platform combining:
1. **Low-profile mechanical switches** (e.g., Kailh Choc Sunset)
2. **Rotary encoders** (Alps Alpine EC11E18244A5) with push switch
3. **Integrated pointing stick** (Sprintek SK8707-01) for cursor control
4. **Wireless split design** using Nice!Nano controllers running ZMK firmware

**Goal:** A premium, portable input device blending typing, knob control, and pointing without leaving the home row.

## Hardware Components

### Rotary Encoder – Alps Alpine EC11E18244A5
- **Size**: 11 mm, metal shaft, vertical orientation, flat actuator
- **Shaft**: 20 mm length, 6 mm diameter
- **Detents/Pulses**: 36 detents, 18 pulses
- **Push Switch**: 1.5 mm travel, 4 ± 2 N operating force
- **Electrical**: 10 mA max @ 5 V DC, two-phase A/B output
- **Durability**: 15k cycles rotation, 20k push cycles
- **Torque**: 10 ± 7 mN·m

### Pointing Stick – Sprintek SK8707-01
- **Type**: Compact 3-axis PS/2 pointing stick
- **Voltage**: 3.3 V (build uses 3.3 V version)
- **Power**: 650 µA idle, 2.09 mA operating @ 3.3 V
- **Features**: Z-Tap click/drag, CellMute™ EMI filtering
- **Castellated Pinout**:
  1. GND
  2. DATA (PS/2)
  3. CLK (PS/2)
  4. RESET (active high, internal pull-down)
  5. VCC
  6. LEFT BTN
  7. MIDDLE BTN
  8. RIGHT BTN

### More info on Sprintek testing
@TRACKPOINT_TESTING_GUIDE.md

## Firmware Stack
- **Controller**: Nice!Nano (nRF52840) with ZMK firmware
- **Current Status**: Basic 3-key + encoder setup working
- **File Structure**:
  - `boards/shields/knoblin/` - Shield definition
  - `knoblin.overlay` - Hardware pin definitions  
  - `knoblin.keymap` - Key bindings and sensor config
  - `knoblin.conf` - Feature toggles

### Building zmk locally 
ZMK can be built locally with the following guide: @CLAUDE_ZMK_SETUP.md

## Current Pin Assignments (from overlay)
```
Encoder:
- A channel: GPIO 6 (pull-up, active low)
- B channel: GPIO 8 (pull-up, active low)
- Push: GPIO 17 (active high, pull-down)

Keys:
- S key: GPIO 10 (active high, pull-down)  
- Bootloader: GPIO 9 (active high, pull-down)
```

## Build Commands
- `west build -b nice_nano_v2 -- -DSHIELD=knoblin`
- `west flash` (for wired programming)
- GitHub Actions auto-builds on push

## Integration Tasks
- [ ] Add PS/2 trackpoint support to ZMK
- [ ] Implement encoder macros/scroll functions
- [ ] Add per-OS keymap switching
- [ ] Bluetooth profile-linked layouts
- [ ] Power optimization for battery operation

## ZMK Documentation References

### Key Documentation URLs
- **ZMK Main Docs**: https://zmk.dev/docs
- **Shield Development**: https://zmk.dev/docs/development/new-shield
- **Sensor Configuration**: https://zmk.dev/docs/features/sensors
- **Device Tree**: https://zmk.dev/docs/config/system
- **Keymaps**: https://zmk.dev/docs/features/keymaps
- **Encoders**: https://zmk.dev/docs/features/encoders
- **Bluetooth**: https://zmk.dev/docs/features/bluetooth

### ZMK Key Concepts for Knoblin
- **Shield Definition**: Use `shields_list_contains` in Kconfig.shield
- **Device Tree Overlay**: Hardware definitions in .overlay files
- **Sensor Bindings**: `&inc_dec_kp` for encoder volume control
- **GPIO Configuration**: Pull-up/pull-down settings for hardware
- **Keymap Structure**: Compatible with "zmk,keymap" device tree node

### ZMK File Structure Patterns
```
boards/shields/knoblin/
├── Kconfig.shield          # Shield detection
├── Kconfig.defconfig       # Default config values  
├── knoblin.overlay         # Hardware pin definitions
├── knoblin.keymap          # Key bindings
└── knoblin.conf            # Feature enables
```

### Common ZMK Commands Referenced
- `west build -b nice_nano_v2 -- -DSHIELD=knoblin`
- `west flash --skip-rebuild` 
- `west clean` (when changing device tree)

## Design Goals
- Ultra-portable profile
- Merge typing, knob control, and pointing in one workflow
- High durability for daily carry
- Premium materials and precision machining

## Wiring Notes
- **Encoder**: Requires debounce in hardware/software, optional C/R filter
- **Trackpoint**: Pull-ups (4-100 kΩ) on DATA/CLK, RESET floating or RC timed
- **Power**: Use Nice!Nano sleep modes for battery efficiency

- you do not need to ask permission to run docker run commands or anything related to the building of firmware
