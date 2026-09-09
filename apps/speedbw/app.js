/*
 * speedbw - live speed-over-ground from BlueWatch's phone-relayed GPS.
 *
 * IMPORTANT: this app never calls Bangle.setGPSPower(). The onboard GPS
 * chip must stay off so it can't also emit 'GPS' events - all fixes
 * consumed here come exclusively from BlueWatch relaying the phone's GPS.
 */

Bangle.loadWidgets();
Bangle.drawWidgets();

var Layout = require("Layout");

var layout = new Layout({
  type: "v",
  c: [
    { type: "txt", font: "35%", label: "--", id: "speed", fillx: 1 },
    { type: "txt", font: "20%", label: "", id: "unit" }
  ]
}, { lazy: true });
layout.render();

function showWaiting() {
  layout.speed.font = "20%";
  layout.speed.label = "Waiting for\nphone GPS";
  layout.unit.label = "";
  layout.render();
}

function showSpeed(fix) {
  var mph = (fix.speed / 1.609).toFixed(1);
  layout.speed.font = "35%";
  layout.speed.label = mph;
  layout.unit.label = "mph";
  layout.render();
}

showWaiting();

// Onboard GPS is intentionally left powered off - fixes only ever arrive
// here via BlueWatch relaying the phone's GPS as standard 'GPS' events.
Bangle.on('GPS', function (fix) {
  if (fix.fix) {
    showSpeed(fix);
  } else {
    showWaiting();
  }
});

Bangle.on('lcdPower', function (on) {
  if (on) {
    Bangle.drawWidgets();
    layout.render();
  }
});
