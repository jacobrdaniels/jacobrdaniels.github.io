/* Original, resolution-independent illustrations. No external image requests. */
const AtlasArt = (() => {
  let serial = 0;
  const wireGlobe = (x, y, r, color, width = 1.5) =>
    `<g fill="none" stroke="${color}" stroke-width="${width}"><circle cx="${x}" cy="${y}" r="${r}"/><ellipse cx="${x}" cy="${y}" rx="${r * 0.38}" ry="${r}"/><ellipse cx="${x}" cy="${y}" rx="${r * 0.74}" ry="${r}"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.34}"/><path d="M${x - r} ${y}h${r * 2}"/></g>`;
  const fern = (x, y, scale, color, mirror = 1) =>
    `<g transform="translate(${x} ${y}) scale(${scale * mirror} ${scale})" fill="${color}"><path d="M0 0C-8-50 0-119 30-187" fill="none" stroke="${color}" stroke-width="3"/>${Array.from(
      { length: 8 },
      (_, i) => {
        let yy = -18 - i * 19,
          xx = i * i * 0.43;
        return `<path d="M${xx} ${yy}q-45-8-44-38q35 6 44 38ZM${xx} ${yy - 6}q42 2 47-30q-34 0-47 30Z"/>`;
      },
    ).join("")}</g>`;
  const monitor = (x, y, s, body, screen, stroke, rounded = 2) =>
    `<g transform="translate(${x} ${y}) scale(${s})" stroke="${stroke}" stroke-width="2"><path d="M94 119v23l-28 10h92l-28-10v-23" fill="${body}"/><rect x="0" y="0" width="224" height="128" rx="${rounded}" fill="${body}"/><rect x="12" y="11" width="200" height="100" rx="${rounded / 2}" fill="${screen}"/><path d="M93 120h38"/><circle cx="205" cy="120" r="2" fill="${stroke}"/></g>`;
  const star = (x, y, r, fill) =>
    `<path d="M${x} ${y - r}Q${x + 2} ${y - 2} ${x + r} ${y}Q${x + 2} ${y + 2} ${x} ${y + r}Q${x - 2} ${y + 2} ${x - r} ${y}Q${x - 2} ${y - 2} ${x} ${y - r}" fill="${fill}"/>`;
  const grain = (id) =>
    `<filter id="${id}-grain"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed="12"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".09"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter>`;

  function aero(id) {
    return `<defs>
      <linearGradient id="${id}-sky" x2="0" y2="1"><stop stop-color="#079cdf"/><stop offset=".66" stop-color="#b9edff"/><stop offset="1" stop-color="#f6ffff"/></linearGradient>
      <linearGradient id="${id}-hill" x1="0" y1="0" x2=".3" y2="1"><stop stop-color="#dcf752"/><stop offset=".38" stop-color="#7bc623"/><stop offset="1" stop-color="#277c27"/></linearGradient>
      <radialGradient id="${id}-water" cx=".35" cy=".25" r=".75"><stop stop-color="#b3f9ff" stop-opacity=".5"/><stop offset=".48" stop-color="#039ad6" stop-opacity=".8"/><stop offset=".8" stop-color="#00559d"/><stop offset="1" stop-color="#53d9ec"/></radialGradient>
      <linearGradient id="${id}-silver" x2=".7" y2="1"><stop stop-color="#fff"/><stop offset=".45" stop-color="#d6edf3"/><stop offset=".65" stop-color="#81aebc"/><stop offset="1" stop-color="#e6f8ff"/></linearGradient>
      <linearGradient id="${id}-leaf" x2=".2" y2="1"><stop stop-color="#a0d72b"/><stop offset="1" stop-color="#2d7929"/></linearGradient>
      <radialGradient id="${id}-bubble" cx=".3" cy=".25"><stop stop-color="#fff" stop-opacity=".9"/><stop offset=".5" stop-color="#fff" stop-opacity=".03"/><stop offset=".85" stop-color="#d7faff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".8"/></radialGradient>
      <filter id="${id}-blur"><feGaussianBlur stdDeviation="8"/></filter>
      <clipPath id="${id}-round"><rect width="600" height="420" rx="22"/></clipPath>
    </defs><g clip-path="url(#${id}-round)"><rect width="600" height="420" fill="url(#${id}-sky)"/><ellipse cx="160" cy="48" rx="160" ry="37" fill="white" opacity=".4" filter="url(#${id}-blur)"/><path d="M-50 336Q100 210 340 296T650 273V420H-50Z" fill="#9dce4c"/><path d="M-20 357Q300 237 620 345V420H-20Z" fill="url(#${id}-hill)"/>
    <ellipse cx="363" cy="365" rx="153" ry="20" fill="#215d44" opacity=".22" filter="url(#${id}-blur)"/>
    <g class="float-object"><circle cx="384" cy="154" r="112" fill="url(#${id}-water)" stroke="#c4fbff" stroke-width="2"/><g fill="#9cdd61" opacity=".8"><path d="m327 66 22 4 12 12 28-8 6 19-17 20 6 16-21 13-11 26-17-3-16-28-18-10 2-26Z"/><path d="m388 163 30 12 23 2 13 17-18 18-2 38-19 11-12-26 2-25-16-24Z"/><path d="m446 90 30 23 11 34-21-8-14-23-19-8Z"/></g><ellipse cx="355" cy="94" rx="68" ry="32" fill="white" opacity=".3" transform="rotate(-26 355 94)"/><path d="M288 151a97 97 0 0 1 107-94" fill="none" stroke="white" stroke-width="4" opacity=".72"/>${wireGlobe(384, 154, 111, "#dafaff55", 1)}</g>
    ${monitor(184, 237, 1.05, `url(#${id}-silver)`, "#d9f4ff", "#6097ae", 9)}<path d="M199 334V265h208v69q-59-49-100-28t-108 28" fill="#80c3e2"/><path d="M199 334q72-54 208-3v12H199" fill="#76b441"/>
    ${fern(127, 391, 1.15, `url(#${id}-leaf)`)}${fern(140, 391, 0.78, "#548f23", -1)}<ellipse cx="144" cy="393" rx="40" ry="7" fill="#33772b" opacity=".3"/>
    ${[
      [90, 93, 27],
      [503, 301, 35],
      [526, 65, 17],
      [222, 155, 13],
    ]
      .map(
        ([x, y, r]) =>
          `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id}-bubble)" stroke="#eaffff99"/>`,
      )
      .join(
        "",
      )}${star(483, 104, 15, "#fff")}${star(82, 122, 8, "#fff")}${star(253, 215, 10, "#fff")}</g>`;
  }

  function terminal(id) {
    return `<defs><pattern id="${id}-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#203a29" stroke-width=".65"/></pattern><pattern id="${id}-lines" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0h4" stroke="#000" stroke-opacity=".25"/></pattern></defs><rect width="600" height="420" fill="#09120d"/><rect width="600" height="420" fill="url(#${id}-grid)"/><g font-family="monospace" fill="#829c79" font-size="11"><text x="20" y="28">CONNECTING TO THE EVERYDAY OBSERVATORY...</text><text x="20" y="399">9600 BAUD / 8-N-1</text><text x="452" y="399">[ CONNECTED ]</text><text x="425" y="58">earth.obj</text><text x="27" y="279">fern.txt</text></g><path d="M20 42h560M20 376h560" stroke="#41603f"/>${wireGlobe(405, 155, 102, "#aee983")}
    ${monitor(171, 237, 1.04, "#132018", "#080f0c", "#aee983", 0)}<g fill="#b3ef85" font-family="monospace" font-size="13"><text x="196" y="270">$ hello, world</text><text x="196" y="296">&gt; stay curious.</text><text x="196" y="320">&gt; _</text></g>${fern(106, 361, 0.69, "#759f68")}${fern(116, 361, 0.52, "#b3ef85", -1)}<path d="M81 340h59l-8 26H89Z" fill="#09120d" stroke="#aee983"/><g fill="#eacb78">${star(64, 90, 6, "#eacb78")}${star(231, 92, 5, "#eacb78")}${star(518, 296, 5, "#eacb78")}</g><rect width="600" height="420" fill="url(#${id}-lines)" pointer-events="none"/>`;
  }

  function mac(id) {
    return `<defs><pattern id="${id}-dots" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#fff"/><rect width="2" height="2" fill="#000"/><rect x="2" y="2" width="2" height="2" fill="#000"/></pattern><pattern id="${id}-thin" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0h1" stroke="#000"/></pattern></defs><rect width="600" height="420" fill="url(#${id}-thin)"/><rect x="160" y="35" width="385" height="294" fill="#000"/><rect x="153" y="28" width="385" height="294" fill="#fff" stroke="#000" stroke-width="2"/><g stroke="#000">${[34, 38, 42, 46, 50].map((y) => `<path d="M158 ${y}h373"/>`).join("")}</g><rect x="287" y="29" width="119" height="23" fill="#fff"/><text x="301" y="46" font-family="monospace" font-size="13">The world</text><rect x="164" y="33" width="15" height="15" fill="#fff" stroke="#000"/>
    <circle cx="403" cy="166" r="83" fill="url(#${id}-dots)"/>${wireGlobe(400, 162, 82, "#000", 2)}<path d="m371 91 26 20-2 30-25 13-27-18 5-25ZM414 156l25 6 14 25-28 40-10-14-6-34Z" fill="#fff" stroke="#000" stroke-width="2"/>
    <g stroke="#000" stroke-width="3"><path d="M171 157h151l18 185H154Z" fill="#fff"/><rect x="172" y="175" width="138" height="100" rx="8" fill="#000"/><rect x="180" y="183" width="122" height="83" rx="4" fill="#fff"/><path d="M184 304h29m41 0h47M172 318h138"/><rect x="158" y="343" width="179" height="14" fill="url(#${id}-dots)"/><path d="m165 370-26 22h203l-16-22Z" fill="#fff"/></g><g stroke="#000" stroke-width="4"><path d="M217 211v15m41-15v15M220 241q20 13 37-2" fill="none"/></g><g stroke="#000" stroke-width="2"><path d="M173 378h151m-159 7h165"/></g>${fern(84, 320, 0.58, "#000")}${fern(92, 322, 0.42, "#000", -1)}<path d="M66 313h45l-6 26H72Z" fill="#fff" stroke="#000" stroke-width="2"/><text x="425" y="365" font-family="monospace" font-size="12">Hello, friend.</text><path d="M495 302v33l7-8 7 15 7-3-7-15h14Z" fill="#fff" stroke="#000" stroke-width="2"/>`;
  }

  function swiss() {
    return `<rect width="600" height="420" fill="#f4f2ea"/><path d="M300 0v420M0 210h600" stroke="#c8c6bd"/><circle cx="394" cy="161" r="137" fill="#e63222"/>${wireGlobe(394, 161, 136, "#f4f2ea", 1.5)}<g transform="translate(30 83)"><path d="M0 0h42v172H0zM0 188h42v42H0z" fill="#171714"/><path d="M78 0h42v230H78z" fill="#171714"/></g>${monitor(242, 260, 0.95, "#171714", "#f4f2ea", "#171714", 0)}<path d="M268 348 307 288l52 60 53-50 17 50Z" fill="#e63222"/>${fern(175, 397, 0.72, "#171714")}${fern(183, 397, 0.38, "#171714", -1)}<g font-family="Arial,sans-serif" font-size="11" fill="#171714"><text x="16" y="25">FORM / 01</text><text x="496" y="405">NATURE / 02</text><text x="325" y="237">FUNCTION / 03</text></g>`;
  }

  function manual(id) {
    return `<defs><pattern id="${id}-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#254c65" stroke-opacity=".12" stroke-width=".5"/></pattern>${grain(id)}</defs><rect width="600" height="420" fill="#e8deca"/><rect width="600" height="420" fill="url(#${id}-grid)"/><g filter="url(#${id}-grain)"><circle cx="405" cy="143" r="93" fill="#e8deca"/>${wireGlobe(405, 143, 93, "#254c65", 1.2)}<path d="M310 144h190M405 48v190" stroke="#d06332" stroke-dasharray="3 5"/>${monitor(174, 232, 0.98, "#e8deca", "#d9d1bd", "#254c65", 0)}<path d="M193 307v-43h61v27h34v-37h87v60H193Z" fill="none" stroke="#254c65" stroke-width="1.5"/><path d="M169 224v-20h235v20m-245 14h-16v119h16M180 218v-11m216 11v-11" stroke="#d06332" fill="none"/>
    ${fern(104, 344, 0.75, "#254c65")}${fern(109, 344, 0.46, "#254c65", -1)}<path d="M81 325h54l-8 35H89Z" fill="#e8deca" stroke="#254c65" stroke-width="1.5"/>
    <g fill="none" stroke="#254c65" stroke-width="1"><path d="M405 43V22h116M432 311h76v-56M94 202V111H40M227 358v36h134"/><circle cx="405" cy="43" r="3" fill="#d06332"/><circle cx="432" cy="311" r="3" fill="#d06332"/></g><g font-family="monospace" font-size="11" fill="#254c65"><text x="452" y="40">01. THE WORLD</text><text x="427" y="248">02. THE MACHINE</text><text x="28" y="95">03. THE FERN</text><text x="229" y="408">VIEW A / FRONT ELEVATION</text><text x="270" y="198">224 mm</text><text x="34" y="390">PLATE 07</text></g><g fill="#d06332"><circle cx="558" cy="364" r="20"/></g><text x="546" y="370" fill="#e8deca" font-family="monospace" font-size="16">07</text></g>`;
  }

  function zine(id) {
    return `<defs><pattern id="${id}-dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="#171717"/></pattern>${grain(id)}</defs><rect width="600" height="420" fill="#dfddd4"/><g filter="url(#${id}-grain)"><path d="m202 10 27 6 22-8 24 5 32-8 19 5 32-7 22 4 27-4 26 8 27-5 20 8 22-4 24 14-28 206-34-5-22 12-25-10-28 10-24-7-30 11-21-8-31 7-22-8-20 5Z" fill="#f8f6ee"/><circle cx="394" cy="151" r="109" fill="url(#${id}-dots)"/>${wireGlobe(394, 151, 109, "#171717", 3)}<path d="m375 48 21 28-25 25-5 32-35 8-29-16 17-37ZM397 146l50 19-2 33-26 42-20-37Z" fill="#171717"/>
    <path d="m30 86 132 9-10 273-128-9Z" fill="#dfff00"/>${fern(118, 350, 1.2, "#171717")}${fern(107, 349, 0.8, "#171717", -1)}<g transform="rotate(-7 286 301)"><path d="m160 214 239 4 15 143-278 6Z" fill="#fff"/>${monitor(166, 233, 0.93, "#f2efe5", "#171717", "#171717", 0)}<text x="184" y="279" fill="#fff" font-family="monospace" font-size="14">MAKE SOMETHING</text><text x="184" y="299" fill="#dfff00" font-family="monospace" font-size="14">THAT MATTERS.</text></g><path d="m198 195 69-13 8 32-69 12ZM438 279l72 24-11 27-70-22Z" fill="#c4b891" opacity=".7"/>
    <g transform="rotate(8 448 357)"><rect x="368" y="328" width="219" height="48" fill="#171717"/><text x="380" y="361" fill="#dfff00" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="29">STAY CURIOUS</text></g><path d="m550 80-10 26 29 2-28 13 13 24-27-13-8 25-5-27-25 3 20-19-20-17 28 6 8-28 8 26Z" fill="#dfff00" stroke="#171717" stroke-width="2"/><path d="M32 35q77-46 127 22T91 83" fill="none" stroke="#171717" stroke-width="4"/></g>`;
  }

  function y2k(id) {
    return `<defs><linearGradient id="${id}-metal" x1=".1" y1="0" x2=".75" y2="1"><stop stop-color="#fff"/><stop offset=".19" stop-color="#c1d3ec"/><stop offset=".36" stop-color="#eefbff"/><stop offset=".47" stop-color="#354b78"/><stop offset=".51" stop-color="#121b42"/><stop offset=".54" stop-color="#96bed6"/><stop offset=".76" stop-color="#eaffff"/><stop offset="1" stop-color="#5254ae"/></linearGradient><radialGradient id="${id}-sphere" cx=".32" cy=".22"><stop stop-color="#fff"/><stop offset=".26" stop-color="#e4faff"/><stop offset=".49" stop-color="#899dbe"/><stop offset=".65" stop-color="#1d2257"/><stop offset=".72" stop-color="#7374ce"/><stop offset=".9" stop-color="#b1f4e8"/><stop offset="1" stop-color="#eaf6ff"/></radialGradient><radialGradient id="${id}-bg"><stop stop-color="#fff"/><stop offset="1" stop-color="#bcc8e3"/></radialGradient><filter id="${id}-blur"><feGaussianBlur stdDeviation="10"/></filter></defs><rect width="600" height="420" rx="40" fill="url(#${id}-bg)"/><g stroke="#7478b2" opacity=".3" fill="none">${[0, 1, 2, 3, 4, 5].map((i) => `<ellipse cx="310" cy="215" rx="${120 + i * 37}" ry="${40 + i * 18}" transform="rotate(-24 310 215)"/>`).join("")}</g><ellipse cx="365" cy="351" rx="162" ry="26" fill="#35365f" opacity=".2" filter="url(#${id}-blur)"/><g class="float-object"><circle cx="374" cy="158" r="105" fill="url(#${id}-sphere)"/>${wireGlobe(374, 158, 103, "#c9dcff66", 1)}<ellipse cx="374" cy="158" rx="179" ry="47" transform="rotate(-25 374 158)" stroke="url(#${id}-metal)" stroke-width="15" fill="none"/><ellipse cx="374" cy="158" rx="180" ry="47" transform="rotate(-25 374 158)" stroke="#ffffff99" stroke-width="1" fill="none"/></g><g transform="translate(19 -7) rotate(-8 275 312)">${monitor(175, 255, 0.91, `url(#${id}-metal)`, "#32365b", "#edfaff", 13)}<path d="M194 327q60-53 163-33m-163 48q60-53 163-33" stroke="#a6f5e1" fill="none" stroke-width="2"/><text x="219" y="288" fill="#e8edff" font-family="monospace" font-size="9">SYSTEM_2000</text></g>${fern(133, 363, 0.83, `url(#${id}-metal)`)}${fern(146, 363, 0.48, `url(#${id}-metal)`, -1)}${star(500, 64, 31, "#fff")}${star(229, 94, 15, "#5551f0")}${star(515, 306, 16, "#fff")}<g fill="#51569a" font-family="monospace" font-size="9"><text x="26" y="34">FUTURE SYSTEMS™</text><text x="455" y="395">V.2000 / ONLINE</text></g>`;
  }

  function nouveau(id) {
    return `<defs><pattern id="${id}-rays" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 0 12 12M-3 9 3 15M9-3 15 3" stroke="#b18a45" stroke-opacity=".18"/></pattern>${grain(id)}</defs><rect width="600" height="420" fill="#f3ebd4"/><g filter="url(#${id}-grain)"><path d="M100 405V190a200 180 0 0 1 400 0v215Z" fill="#e7dec3" stroke="#b18a45" stroke-width="2"/><path d="M112 405V190a188 168 0 0 1 376 0v215Z" fill="url(#${id}-rays)" stroke="#b18a45"/><circle cx="314" cy="159" r="108" fill="#809076" stroke="#29483d" stroke-width="2"/>${wireGlobe(314, 159, 100, "#e7dec3", 1.25)}<circle cx="314" cy="159" r="117" fill="none" stroke="#b18a45"/><circle cx="314" cy="159" r="121" fill="none" stroke="#b18a45" stroke-width=".6"/>
    <g fill="none" stroke="#29483d"><path d="M62 414C190 349 15 225 103 140S77 25 149 21M538 414C410 349 585 225 497 140S523 25 451 21" stroke-width="5"/><path d="M78 414C220 322 37 216 118 144S91 45 150 34M522 414C380 322 563 216 482 144S509 45 450 34" stroke-width="2"/></g>
    ${fern(105, 388, 1.0, "#29483d")}${fern(495, 388, 1.0, "#29483d", -1)}${fern(71, 297, 0.67, "#819277", -1)}${fern(529, 297, 0.67, "#819277")}
    <g>${monitor(202, 266, 0.87, "#b7ad89", "#29483d", "#29483d", 14)}<path d="M226 342q26-53 42-45t26 32 28-26 33 30" stroke="#b18a45" fill="none" stroke-width="2"/><circle cx="270" cy="297" r="7" fill="#b18a45"/></g>
    <g fill="#a86f53" stroke="#29483d" stroke-width="1">${[
      [104, 143],
      [496, 143],
      [147, 28],
      [453, 28],
      [84, 308],
      [516, 308],
    ]
      .map(
        ([x, y]) =>
          `<g transform="translate(${x} ${y})">${[0, 60, 120, 180, 240, 300].map((a) => `<ellipse cy="-9" rx="6" ry="12" transform="rotate(${a})"/>`).join("")}<circle r="5" fill="#d8bf77"/></g>`,
      )
      .join(
        "",
      )}</g><path d="M164 398h272M180 405h240" stroke="#b18a45"/><g fill="#29483d"><path d="m293 390 7-7 7 7-7 7Z"/></g></g>`;
  }

  const renderers = { aero, terminal, mac, swiss, manual, zine, y2k, nouveau };
  return {
    scene(style) {
      const id = `art-${style}-${++serial}`;
      return `<svg class="illustration" viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A globe, a computer, and a fern, illustrated in ${style === "aero" ? "Frutiger Aero" : style} style">${renderers[style](id)}</svg>`;
    },
  };
})();
