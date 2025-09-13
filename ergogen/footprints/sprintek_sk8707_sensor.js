// Sprintek SK8707-01 Sensor Board
// 8-pin castellated module for 3-axis PS/2 trackpoint
// Castellated pinout: GND, DATA, CLK, RESET, VCC, LEFT_BTN, MIDDLE_BTN, RIGHT_BTN

module.exports = {
  params: {
    designator: 'TP_SENSOR',
    orientation: 'up',
    // Board dimensions
    board_width: 13.2,
    board_height: 18.29,
    // Pad specifications
    pad_count: 8,
    pad_spacing: 1.8,
    pad_width: 1.0,
    pad_height: 1.2,
    pad_offset_from_edge: 0.6,
    // Layout
    courtyard_margin: 0.5,
    label_offset_y: 2.355,
    // Adjustable positioning for all pads
    pad_offset_x: 0,
    pad_offset_y: 0,
    // Net assignments - 4 numbered pads (connect to driver board top pads)
    PAD1: {type: 'net', value: 'SENSOR_PAD1'},
    PAD2: {type: 'net', value: 'SENSOR_PAD2'},
    PAD3: {type: 'net', value: 'SENSOR_PAD3'},
    PAD4: {type: 'net', value: 'SENSOR_PAD4'}
  },
  body: p => {
    // Calculate dimensions
    const half_width = p.board_width / 2
    const half_height = p.board_height / 2
    const courtyard_half_width = half_width + p.courtyard_margin
    const courtyard_half_height = half_height + p.courtyard_margin
    const value_label_y = half_height + 2
    
    const standard = `
      (module Sprintek_SK8707_Sensor (layer F.Cu) (tedit 5B307E4C)
      ${p.at /* parametric position */}

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "SK8707_SENSOR" (at 0 ${value_label_y}) (layer F.SilkS) (effects (font (size 1.27 1.27) (thickness 0.15))))
    
      ${''/* component outline - parametric board dimensions */}
      (fp_line (start ${-half_width} ${-half_height}) (end ${half_width} ${-half_height}) (layer F.SilkS) (width 0.15))
      (fp_line (start ${half_width} ${-half_height}) (end ${half_width} ${half_height}) (layer F.SilkS) (width 0.15))
      (fp_line (start ${half_width} ${half_height}) (end ${-half_width} ${half_height}) (layer F.SilkS) (width 0.15))
      (fp_line (start ${-half_width} ${half_height}) (end ${-half_width} ${-half_height}) (layer F.SilkS) (width 0.15))
      
      ${''/* courtyard */}
      (fp_line (start ${-courtyard_half_width} ${-courtyard_half_height}) (end ${courtyard_half_width} ${-courtyard_half_height}) (layer F.CrtYd) (width 0.05))
      (fp_line (start ${courtyard_half_width} ${-courtyard_half_height}) (end ${courtyard_half_width} ${courtyard_half_height}) (layer F.CrtYd) (width 0.05))
      (fp_line (start ${courtyard_half_width} ${courtyard_half_height}) (end ${-courtyard_half_width} ${courtyard_half_height}) (layer F.CrtYd) (width 0.05))
      (fp_line (start ${-courtyard_half_width} ${courtyard_half_height}) (end ${-courtyard_half_width} ${-courtyard_half_height}) (layer F.CrtYd) (width 0.05))

      ${''/* joystick square - 2.4mm square, center 10.84mm from pads */}
      (fp_line (start -1.2 -2.895) (end 1.2 -2.895) (layer F.SilkS) (width 0.15))
      (fp_line (start 1.2 -2.895) (end 1.2 -0.495) (layer F.SilkS) (width 0.15))
      (fp_line (start 1.2 -0.495) (end -1.2 -0.495) (layer F.SilkS) (width 0.15))
      (fp_line (start -1.2 -0.495) (end -1.2 -2.895) (layer F.SilkS) (width 0.15))

      ${''/* crosshair centered on joystick */}
      (fp_line (start -1.5 -1.695) (end 1.5 -1.695) (layer F.SilkS) (width 0.1))
      (fp_line (start 0 -2.995) (end 0 -0.395) (layer F.SilkS) (width 0.1))
      `

    function pins(def_neg, def_pos) {
      // Calculate pad positions
      const half_height = p.board_height / 2
      const pad_edge_y = half_height - p.pad_offset_from_edge
      const label_y = pad_edge_y - p.label_offset_y
      const total_width = (p.pad_count - 1) * p.pad_spacing
      const start_x = -total_width / 2
      
      // Generate arrays for pad positions and nets - 4 numbered pads
      const pad_labels = ['1', '2', '3', '4']
      const pad_nets = [p.PAD1.str, p.PAD2.str, p.PAD3.str, p.PAD4.str]
      
      let labels = ''
      let pads = ''
      
      for (let i = 0; i < p.pad_count; i++) {
        const pad_x = start_x + (i * p.pad_spacing) + p.pad_offset_x
        const pad_num = i + 1
        const label_y_with_offset = (def_neg === '-') ? (label_y - p.pad_offset_y) : (-label_y + p.pad_offset_y)
        const pad_edge_y_with_offset = (def_neg === '-') ? (pad_edge_y - p.pad_offset_y) : (-pad_edge_y + p.pad_offset_y)
        
        labels += `        (fp_text user ${pad_labels[i]} (at ${pad_x} ${label_y_with_offset} ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))\n`
        pads += `        (pad ${pad_num} smd rect (at ${pad_x} ${pad_edge_y_with_offset} ${p.rot}) (size ${p.pad_width} ${p.pad_height}) (layers F.Cu F.Paste F.Mask) ${pad_nets[i]})\n`
      }
      
      return `
        ${''/* pin labels - parametric spacing and positioning */}
${labels.slice(0, -1)}  ${''/* remove last newline */}
      
        ${''/* castellated pads - parametric dimensions and spacing */}
${pads.slice(0, -1)}  ${''/* remove last newline */}
      `
    }

    if(p.orientation == 'up') {
      return `
        ${standard}
        ${pins('-', '')})
        `
    } else {
      return `
        ${standard}
        ${pins('', '-')})
        `
    }
  }
}