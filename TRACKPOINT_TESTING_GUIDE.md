# Trackpoint Testing Guide - Sprintek SK8707-01

## Overview
This document provides comprehensive testing procedures for the Sprintek SK8707-01 3-axis PS/2 trackpoint integrated into the Knoblin keyboard platform using ZMK firmware with infused-kim's PS/2 driver implementation.

## Hardware Configuration

### Trackpoint Module: Sprintek SK8707-01
- **Type**: Compact 3-axis PS/2 pointing stick  
- **Voltage**: 3.3V (using 3.3V version)
- **Power Consumption**: 650 µA idle, 2.09 mA operating @ 3.3V
- **Features**: Z-Tap click/drag, CellMute™ EMI filtering

### Pin Assignments (knoblin.overlay:75-77)
```
Current Configuration:
- DATA: GPIO P0.17 (PS/2 DATA line)
- CLK:  GPIO P0.20 (PS/2 CLK line) 
- RST:  GPIO P0.22 (Power-On-Reset - Required for trackpoint)
- VCC:  3.3V from Nice!Nano
- GND:  Ground from Nice!Nano

Additional Pins:
- Encoder Click: GPIO P0.15 (moved from P0.17 to avoid conflict)
- S Key: GPIO P0.10
- Bootloader: GPIO P0.09
```

### Trackpoint Pinout (Sprintek SK8707-01)
```
1. GND        - Connect to Nice!Nano GND
2. DATA       - Connect to P0.17 (PS/2 DATA)
3. CLK        - Connect to P0.20 (PS/2 CLK)
4. RESET      - Connect to P0.22 (active high, internal pull-down)
5. VCC        - Connect to Nice!Nano 3.3V
6. LEFT BTN   - Optional for initial testing
7. MIDDLE BTN - Optional for initial testing  
8. RIGHT BTN  - Optional for initial testing
```

## Power Supply Recommendations

### For Testing: USB Power Only
- **Reason**: More consistent than external supply
- **Advantage**: Eliminates battery variables during development
- **Power Budget**: 2.09mA trackpoint + Nice!Nano well within USB capabilities

### For Production: Battery + USB
- Test with both power sources after initial USB testing succeeds
- Verify power management and sleep modes work correctly

## Firmware Configuration

### Current Implementation
- **Driver**: infused-kim's PS/2 UART implementation (`zmk,ps2-uart`)
- **Protocol**: UART-based PS/2 simulation for better nrf52 performance
- **Reset Sequence**: Software Power-On-Reset via GPIO 22
- **Features**: Runtime sensitivity adjustment, HID mouse integration

### Build Process
1. Edit `knoblin.overlay` for pin assignments
2. Build from `/Users/sperlmutter/dev/keyboard/zmk`:
   ```bash
   docker run --rm \
     --workdir /workspaces/zmk \
     -v $(pwd):/workspaces/zmk \
     -v /Users/sperlmutter/dev/keyboard/knoblincore:/workspaces/zmk-config \
     zmk-dev /bin/bash -c "west build -s app -b nice_nano_v2 -- -DSHIELD=knoblin -DZMK_CONFIG='/workspaces/zmk-config'"
   ```
3. Flash: `/Users/sperlmutter/dev/keyboard/zmk/build/zephyr/zmk.uf2`

## Testing Phases

### Phase 1: Hardware Verification
**Prerequisites**: Firmware flashed, hardware connected

1. **Power Verification**
   - Measure 3.3V on trackpoint VCC pin
   - Verify GND continuity between trackpoint and Nice!Nano
   - Check for shorts between power rails

2. **Signal Continuity**
   - Verify DATA line: Trackpoint pin 2 → Nice!Nano P0.17
   - Verify CLK line: Trackpoint pin 3 → Nice!Nano P0.20  
   - Verify RESET line: Trackpoint pin 4 → Nice!Nano P0.22
   - Use multimeter continuity mode

3. **Basic Functionality Test**
   - Flash firmware to Nice!Nano (double-click reset, copy UF2)
   - Verify keyboard basics: encoder rotation, button presses
   - Confirm no interference with existing functionality

### Phase 2: PS/2 Communication Testing

1. **Power-On-Reset Sequence**
   - Monitor RESET pin (P0.22) with oscilloscope/logic analyzer
   - Should see reset pulse during initialization
   - Verify trackpoint responds to reset sequence

2. **PS/2 Protocol Verification**
   - Monitor DATA (P0.17) and CLK (P0.20) lines
   - Look for PS/2 initialization commands
   - Verify trackpoint acknowledgments (0xFA response)

3. **Movement Data Generation**
   - Gently move trackpoint in X/Y directions
   - Monitor for PS/2 movement packets on DATA/CLK lines
   - Expected: 3-byte packets with movement data

### Phase 3: Host Integration Testing

1. **HID Mouse Reports**
   - Connect Nice!Nano to computer via USB
   - Test trackpoint movement → cursor movement on screen
   - Verify smooth, proportional response

2. **Sensitivity Testing**
   - Test light vs. firm pressure
   - Verify no false movements when idle
   - Check for proper dead zone behavior

3. **System Compatibility**
   - Test on multiple host systems (Windows, macOS, Linux)
   - Verify HID descriptor acceptance
   - Test Bluetooth connectivity if applicable

## Debugging Tools & Techniques

### Essential Equipment
1. **Logic Analyzer/Oscilloscope**
   - Monitor PS/2 timing and protocol
   - Verify reset pulse characteristics
   - Analyze communication errors

2. **Multimeter**
   - Verify power supply levels
   - Check continuity and resistance
   - Detect shorts or open circuits

3. **Host System Logging**
   - Enable HID debugging on host OS
   - Monitor USB/Bluetooth HID traffic
   - Check for device enumeration issues

### Common Issues & Solutions

| Issue | Symptoms | Diagnosis | Solution |
|-------|----------|-----------|----------|
| No trackpoint response | No cursor movement | Check power, reset pin | Verify 3.3V, enable reset sequence |
| Erratic movement | Jumpy/false cursor moves | Check signal integrity | Shield cables, check pull-ups |
| Communication errors | PS/2 protocol failures | Monitor DATA/CLK timing | Verify high-freq pin assignment |
| Host not recognizing | Device not enumerated | Check HID descriptor | Rebuild firmware, check config |

### Debugging Commands & Logs
```bash
# Check ZMK build logs for PS/2 driver compilation
docker run --rm zmk-dev /bin/bash -c "dmesg | grep ps2"

# Monitor USB HID traffic (Linux)
sudo usbmon -i usbX

# Enable HID debugging (Windows)
# Use Microsoft HID tools or USB packet capture
```

## Expected Results

### Successful Integration Indicators
1. **Hardware**: All continuity tests pass, proper power levels
2. **Firmware**: Clean build with PS/2 driver enabled
3. **Communication**: Valid PS/2 protocol traffic observed
4. **Host**: Smooth cursor movement, proper HID integration
5. **Reliability**: Consistent operation across power cycles

### Performance Metrics
- **Response Latency**: < 10ms movement to cursor response
- **Resolution**: Smooth movement control, no stepping
- **Power Consumption**: < 3mA total during active use
- **Reliability**: > 99% successful power-on sequences

## Troubleshooting Decision Tree

```
Start: Flash firmware, connect hardware
  ↓
Power OK? → No → Check VCC/GND connections
  ↓ Yes
Reset working? → No → Check GPIO 22 connection, verify rst-pin config
  ↓ Yes
PS/2 communication? → No → Check DATA/CLK lines, verify protocol timing
  ↓ Yes
Host recognizes device? → No → Check HID config, try different host
  ↓ Yes
Movement working? → No → Check sensitivity, verify movement packets
  ↓ Yes
Success: Full functionality achieved
```

## Advanced Configuration

### Runtime Sensitivity Adjustment
The infused-kim driver supports runtime configuration:
- Sensitivity levels
- Negative inertia settings  
- Transfer function parameters
- Press-to-select pressure sensitivity

### Integration with Keyboard Layers
- Temporary mouse layers during trackpoint use
- Speed adjustment via keyboard shortcuts
- Scroll mode toggle functionality

## References
- [infused-kim PS/2 Driver](https://github.com/infused-kim/kb_zmk_ps2_mouse_trackpoint_driver)
- [Sprintek SK8707-01 Datasheet](https://www.sprintek.com/downloads/SK8707.pdf)
- [ZMK Input/Pointing Documentation](https://zmk.dev/docs/features/pointing)
- [PS/2 Protocol Specification](https://www.computer-engineering.org/ps2protocol/)

---
*Document created: 2024-08-18*  
*Firmware version: Built with reset pin GPIO 22*  
*Hardware: Nice!Nano v2 + Sprintek SK8707-01*