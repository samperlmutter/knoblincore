// Sprintek SK8707-01 Sensor Board
// 8-pin castellated module for 3-axis PS/2 trackpoint
// Castellated pinout: GND, DATA, CLK, RESET, VCC, LEFT_BTN, MIDDLE_BTN, RIGHT_BTN

module.exports = {
  params: {
    designator: 'TP_SENSOR',
    orientation: 'up',
    GND: {type: 'net', value: 'GND'},
    DATA: {type: 'net', value: 'P0.17'},
    CLK: {type: 'net', value: 'P0.20'},
    RESET: {type: 'net', value: 'P0.22'},
    VCC: {type: 'net', value: 'VCC'},
    LEFT_BTN: {type: 'net', value: 'LEFT_BTN'},
    MIDDLE_BTN: {type: 'net', value: 'MIDDLE_BTN'},
    RIGHT_BTN: {type: 'net', value: 'RIGHT_BTN'}
  },
  body: p => {
    const standard = `
      (module Sprintek_SK8707_Sensor (layer F.Cu) (tedit 5B307E4C)
      ${p.at /* parametric position */}

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "SK8707_SENSOR" (at 0 5) (layer F.SilkS) (effects (font (size 1.27 1.27) (thickness 0.15))))
    
      ${''/* component outline - 7.5mm x 7.5mm sensor board */}
      (fp_line (start -3.75 -3.75) (end 3.75 -3.75) (layer F.SilkS) (width 0.15))
      (fp_line (start 3.75 -3.75) (end 3.75 3.75) (layer F.SilkS) (width 0.15))
      (fp_line (start 3.75 3.75) (end -3.75 3.75) (layer F.SilkS) (width 0.15))
      (fp_line (start -3.75 3.75) (end -3.75 -3.75) (layer F.SilkS) (width 0.15))
      
      ${''/* courtyard */}
      (fp_line (start -4.25 -4.25) (end 4.25 -4.25) (layer F.CrtYd) (width 0.05))
      (fp_line (start 4.25 -4.25) (end 4.25 4.25) (layer F.CrtYd) (width 0.05))
      (fp_line (start 4.25 4.25) (end -4.25 4.25) (layer F.CrtYd) (width 0.05))
      (fp_line (start -4.25 4.25) (end -4.25 -4.25) (layer F.CrtYd) (width 0.05))
      `

    function pins(def_neg, def_pos) {
      return `
        ${''/* pin labels for orientation */}
        (fp_text user GND (at -2.54 ${def_pos}2.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
        (fp_text user DATA (at -1.27 ${def_pos}2.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
        (fp_text user CLK (at 0 ${def_pos}2.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
        (fp_text user RST (at 1.27 ${def_pos}2.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
        (fp_text user VCC (at 2.54 ${def_pos}2.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
        (fp_text user LB (at -1.27 ${def_neg}2.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
        (fp_text user MB (at 0 ${def_neg}2.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
        (fp_text user RB (at 1.27 ${def_neg}2.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
      
        ${''/* castellated pads - 1.27mm pitch, sized for reliable connection */}
        (pad 1 smd rect (at -2.54 ${def_pos}3.75 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.GND.str})
        (pad 2 smd rect (at -1.27 ${def_pos}3.75 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.DATA.str})
        (pad 3 smd rect (at 0 ${def_pos}3.75 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.CLK.str})
        (pad 4 smd rect (at 1.27 ${def_pos}3.75 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.RESET.str})
        (pad 5 smd rect (at 2.54 ${def_pos}3.75 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.VCC.str})
        (pad 6 smd rect (at -1.27 ${def_neg}3.75 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.LEFT_BTN.str})
        (pad 7 smd rect (at 0 ${def_neg}3.75 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.MIDDLE_BTN.str})
        (pad 8 smd rect (at 1.27 ${def_neg}3.75 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.RIGHT_BTN.str})
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