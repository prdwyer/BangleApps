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
  width: g.getWidth(),
  height: g.getHeight() - 24, // leave room for widget bar
  c: [
    { type: "txt", font: "35%", label: "--", id: "speed", fillx: 1 },
    { type: "txt", font: "20%", label: "", id: "unit", fillx: 1 }
  ]
}, { lazy: true });

function draw() {
  g.clear();
  Bangle.drawWidgets();
  layout.render();
}

function showWaiting() {
  layout.speed.font = "20%";
  layout.speed.label = "Waiting for";
  layout.unit.label = "phone GPS";
  draw();
}

function showSpeed(fix) {
  var mph = (fix.speed / 1.609).toFixed(1);
  layout.speed.font = "35%";
  layout.speed.label = mph;
  layout.unit.label = "mph";
  draw();
}

showWaiting();

Bangle.on('GPS', function (fix) {
  if (fix.fix) showSpeed(fix); else showWaiting();
});

Bangle.on('lcdPower', function (on) {
  if (on) draw();
});








