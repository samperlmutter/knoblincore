// Sprintek SK8707-01 Driver Board
// Castellated driver PCB for signal conditioning and processing
// Provides power regulation, pull-ups, and signal buffering for the sensor

module.exports = {
  params: {
    designator: 'TP_DRIVER',
    orientation: 'up',
    // Board dimensions
    board_width: 23,
    board_height: 14.5,
    // Bottom pad set
    bottom_pad_count: 8,
    bottom_pad_spacing: 1.8,
    bottom_pad_width: 1.0,
    bottom_pad_height: 1.2,
    bottom_pad_start_x: -8.42,
    bottom_pad_offset_from_edge: 0.6,
    // Top pad set
    top_pad_count: 4,
    top_pad_spacing: 0.4,
    top_pad_width: 2.25,
    top_pad_height: 2.25,
    top_pad_center_x: 0,
    top_pad_offset_from_edge: 0.6,
    // Layout
    courtyard_margin: 0.5,
    label_offset_y: 2.775,
    // Adjustable positioning for top pads
    top_pad_offset_x: 0,
    top_pad_offset_y: 0,
    // Net assignments - Bottom pad set (connect to Nice!Nano)
    GND: {type: 'net', value: 'GND'},
    DATA: {type: 'net', value: 'P0.17'},
    CLK: {type: 'net', value: 'P0.20'},
    RST: {type: 'net', value: 'P0.22'},
    VCC: {type: 'net', value: 'VCC'},
    LEFT: {type: 'net', value: 'LEFT_BTN'},
    MIDDLE: {type: 'net', value: 'MIDDLE_BTN'},
    RIGHT: {type: 'net', value: 'RIGHT_BTN'},
    // Net assignments - Top pad set (connect to sensor board)
    TOP_PAD1: {type: 'net', value: 'SENSOR_PAD1'},
    TOP_PAD2: {type: 'net', value: 'SENSOR_PAD2'},
    TOP_PAD3: {type: 'net', value: 'SENSOR_PAD3'},
    TOP_PAD4: {type: 'net', value: 'SENSOR_PAD4'}
  },
  body: p => {
    // Calculate dimensions
    const half_width = p.board_width / 2
    const half_height = p.board_height / 2
    const courtyard_half_width = half_width + p.courtyard_margin
    const courtyard_half_height = half_height + p.courtyard_margin
    const value_label_y = half_height + 2
    
    const standard = `
      (module Sprintek_SK8707_Driver (layer F.Cu) (tedit 5B307E4C)
      ${p.at /* parametric position */}

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "SK8707_DRIVER" (at 0 ${value_label_y}) (layer F.SilkS) (effects (font (size 1.27 1.27) (thickness 0.15))))
    
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
      `

    function pins(def_neg, def_pos) {
      // Calculate pad positions
      const half_height = p.board_height / 2
      const bottom_pad_edge_y = half_height - p.bottom_pad_offset_from_edge
      const bottom_label_y = bottom_pad_edge_y - p.label_offset_y
      const top_pad_edge_y = half_height - p.top_pad_offset_from_edge
      const top_label_y = top_pad_edge_y - p.label_offset_y
      
      // Bottom pad calculations
      const bottom_labels = ['GND', 'DATA', 'CLK', 'RST', 'VCC', 'LEFT', 'MID', 'RIGHT']
      const bottom_nets = [p.GND.str, p.DATA.str, p.CLK.str, p.RST.str, p.VCC.str, p.LEFT.str, p.MIDDLE.str, p.RIGHT.str]
      
      // Top pad calculations with offset
      const top_total_width = (p.top_pad_count - 1) * p.top_pad_spacing
      const top_start_x = p.top_pad_center_x - (top_total_width / 2) + p.top_pad_offset_x
      const top_labels = ['1', '2', '3', '4']
      const top_nets = [p.TOP_PAD1.str, p.TOP_PAD2.str, p.TOP_PAD3.str, p.TOP_PAD4.str]
      
      let bottom_labels_str = ''
      let bottom_pads_str = ''
      let top_labels_str = ''
      let top_pads_str = ''
      
      // Generate bottom pad set
      for (let i = 0; i < p.bottom_pad_count; i++) {
        const pad_x = p.bottom_pad_start_x + (i * p.bottom_pad_spacing)
        const pad_num = i + 1
        
        bottom_labels_str += `        (fp_text user ${bottom_labels[i]} (at ${pad_x} ${def_neg}${bottom_label_y} ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))\n`
        bottom_pads_str += `        (pad ${pad_num} smd rect (at ${pad_x} ${def_neg}${bottom_pad_edge_y} ${p.rot}) (size ${p.bottom_pad_width} ${p.bottom_pad_height}) (layers F.Cu F.Paste F.Mask) ${bottom_nets[i]})\n`
      }
      
      // Generate top pad set
      for (let i = 0; i < p.top_pad_count; i++) {
        const pad_x = top_start_x + (i * p.top_pad_spacing)
        const pad_num = p.bottom_pad_count + i + 1
        const label_y = (def_pos === '') ? (top_label_y + p.top_pad_offset_y) : (-top_label_y - p.top_pad_offset_y)
        const pad_y = (def_pos === '') ? (top_pad_edge_y + p.top_pad_offset_y) : (-top_pad_edge_y - p.top_pad_offset_y)
        
        top_labels_str += `        (fp_text user ${top_labels[i]} (at ${pad_x} ${label_y} ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))\n`
        top_pads_str += `        (pad ${pad_num} smd rect (at ${pad_x} ${pad_y} ${p.rot}) (size ${p.top_pad_width} ${p.top_pad_height}) (layers F.Cu F.Paste F.Mask) ${top_nets[i]})\n`
      }
      
      return `
        ${''/* bottom pad set labels - parametric positioning */}
${bottom_labels_str.slice(0, -1)}  ${''/* remove last newline */}

        ${''/* top pad set labels - parametric positioning */}
${top_labels_str.slice(0, -1)}  ${''/* remove last newline */}
      
        ${''/* bottom pad set - parametric dimensions and spacing */}
${bottom_pads_str.slice(0, -1)}  ${''/* remove last newline */}

        ${''/* top pad set - parametric dimensions and spacing */}
${top_pads_str.slice(0, -1)}  ${''/* remove last newline */}
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
