// Sprintek SK8707-01 Driver Board
// Castellated driver PCB for signal conditioning and processing
// Provides power regulation, pull-ups, and signal buffering for the sensor

module.exports = {
  params: {
    designator: 'TP_DRIVER',
    orientation: 'up',
    GND: {type: 'net', value: 'GND'},
    DATA: {type: 'net', value: 'P0.17'},
    CLK: {type: 'net', value: 'P0.20'},
    RESET: {type: 'net', value: 'P0.22'},
    VCC: {type: 'net', value: 'VCC'},
    SENSOR_VCC: {type: 'net', value: 'SENSOR_VCC'},
    SENSOR_GND: {type: 'net', value: 'SENSOR_GND'},
    SENSOR_DATA: {type: 'net', value: 'SENSOR_DATA'},
    SENSOR_CLK: {type: 'net', value: 'SENSOR_CLK'},
    SENSOR_RESET: {type: 'net', value: 'SENSOR_RESET'}
  },
  body: p => {
    const standard = `
      (module Sprintek_SK8707_Driver (layer F.Cu) (tedit 5B307E4C)
      ${p.at /* parametric position */}

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "SK8707_DRIVER" (at 0 8) (layer F.SilkS) (effects (font (size 1.27 1.27) (thickness 0.15))))
    
      ${''/* component outline - larger driver board with components */}
      (fp_line (start -6 -6) (end 6 -6) (layer F.SilkS) (width 0.15))
      (fp_line (start 6 -6) (end 6 6) (layer F.SilkS) (width 0.15))
      (fp_line (start 6 6) (end -6 6) (layer F.SilkS) (width 0.15))
      (fp_line (start -6 6) (end -6 -6) (layer F.SilkS) (width 0.15))
      
      ${''/* courtyard */}
      (fp_line (start -6.5 -6.5) (end 6.5 -6.5) (layer F.CrtYd) (width 0.05))
      (fp_line (start 6.5 -6.5) (end 6.5 6.5) (layer F.CrtYd) (width 0.05))
      (fp_line (start 6.5 6.5) (end -6.5 6.5) (layer F.CrtYd) (width 0.05))
      (fp_line (start -6.5 6.5) (end -6.5 -6.5) (layer F.CrtYd) (width 0.05))
      
      ${''/* mounting holes for mechanical stability */}
      (pad "" np_thru_hole circle (at -4.5 -4.5) (size 1.0 1.0) (drill 1.0) (layers *.Cu *.Mask))
      (pad "" np_thru_hole circle (at 4.5 -4.5) (size 1.0 1.0) (drill 1.0) (layers *.Cu *.Mask))
      (pad "" np_thru_hole circle (at -4.5 4.5) (size 1.0 1.0) (drill 1.0) (layers *.Cu *.Mask))
      (pad "" np_thru_hole circle (at 4.5 4.5) (size 1.0 1.0) (drill 1.0) (layers *.Cu *.Mask))
      `

    function pins(def_neg, def_pos) {
      return `
        ${''/* main controller connection pins (bottom edge) */}
        (fp_text user GND (at -3.81 ${def_neg}4.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
        (fp_text user DATA (at -2.54 ${def_neg}4.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
        (fp_text user CLK (at -1.27 ${def_neg}4.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
        (fp_text user RST (at 0 ${def_neg}4.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
        (fp_text user VCC (at 1.27 ${def_neg}4.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))

        ${''/* sensor connection pins (top edge) */}
        (fp_text user S_GND (at -2.54 ${def_pos}4.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
        (fp_text user S_DATA (at -1.27 ${def_pos}4.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
        (fp_text user S_CLK (at 0 ${def_pos}4.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
        (fp_text user S_RST (at 1.27 ${def_pos}4.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
        (fp_text user S_VCC (at 2.54 ${def_pos}4.5 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
      
        ${''/* main controller connection pads (bottom edge) */}
        (pad 1 smd rect (at -3.81 ${def_neg}6 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.GND.str})
        (pad 2 smd rect (at -2.54 ${def_neg}6 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.DATA.str})
        (pad 3 smd rect (at -1.27 ${def_neg}6 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.CLK.str})
        (pad 4 smd rect (at 0 ${def_neg}6 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.RESET.str})
        (pad 5 smd rect (at 1.27 ${def_neg}6 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.VCC.str})

        ${''/* sensor connection pads (top edge) */}
        (pad 6 smd rect (at -2.54 ${def_pos}6 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.SENSOR_GND.str})
        (pad 7 smd rect (at -1.27 ${def_pos}6 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.SENSOR_DATA.str})
        (pad 8 smd rect (at 0 ${def_pos}6 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.SENSOR_CLK.str})
        (pad 9 smd rect (at 1.27 ${def_pos}6 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.SENSOR_RESET.str})
        (pad 10 smd rect (at 2.54 ${def_pos}6 ${p.rot}) (size 0.8 1.0) (layers F.Cu F.Paste F.Mask) ${p.SENSOR_VCC.str})
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