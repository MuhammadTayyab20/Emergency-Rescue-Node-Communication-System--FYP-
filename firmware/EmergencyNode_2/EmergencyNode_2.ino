#include <WiFi.h>
#include <WebServer.h>
#include <DNSServer.h>
#include <LoRa.h>
#include <SPI.h>

// LoRa pins for Heltec V2
#define SCK 5
#define MISO 19
#define MOSI 27
#define SS 18
#define RST 14
#define DIO0 26

const char* ssid = "EmergencyNode2";

DNSServer dnsServer;
WebServer server(80);

String htmlPage = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
<meta name='viewport' content='width=device-width, initial-scale=1'>
<title>Emergency Help</title>
<style>
body{font-family:Arial;background:#111;color:white;padding:20px;margin:0;}
h1{color:#ff4444;text-align:center;}
p{text-align:center;color:#aaa;}
.form{background:#222;padding:20px;border-radius:10px;margin-top:20px;}
input{width:100%;padding:12px;margin:8px 0;border-radius:5px;border:none;font-size:16px;box-sizing:border-box;}
button{width:100%;padding:15px;background:#ff4444;color:white;border:none;border-radius:5px;font-size:18px;font-weight:bold;margin-top:10px;}
#status{text-align:center;margin-top:15px;font-size:16px;}
</style>
</head>
<body>
<h1>EMERGENCY HELP</h1>
<p>Fill in your details. Help will be sent to your location.</p>
<div class='form'>
<input type='text' id='name' placeholder='Your Full Name'><br>
<input type='tel' id='phone' placeholder='Emergency Contact Number'><br>
<button onclick='sendAlert()'>SEND EMERGENCY ALERT</button>
</div>
<p id='status'></p>
<script>
function sendAlert(){
  var name=document.getElementById('name').value;
  var phone=document.getElementById('phone').value;
  if(!name){alert('Please enter your name!');return;}
  document.getElementById('status').innerHTML='Getting your location...';
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(pos){
      var lat=pos.coords.latitude;
      var lon=pos.coords.longitude;
      document.getElementById('status').innerHTML='Sending alert...';
      fetch('/submit?name='+encodeURIComponent(name)+'&phone='+encodeURIComponent(phone)+'&lat='+lat+'&lon='+lon)
      .then(r=>r.text())
      .then(t=>{document.getElementById('status').innerHTML=t;});
    },function(){
      document.getElementById('status').innerHTML='Sending without GPS...';
      fetch('/submit?name='+encodeURIComponent(name)+'&phone='+encodeURIComponent(phone)+'&lat=0&lon=0')
      .then(r=>r.text())
      .then(t=>{document.getElementById('status').innerHTML=t;});
    });
  }
}
</script>
</body>
</html>
)rawliteral";

void handleRoot() {
  server.send(200, "text/html", htmlPage);
}

// Redirect any "is there internet?" probe to the real captive portal page.
// This triggers the "Sign in to network" popup/notification on phones.
void handleCaptiveRedirect() {
  String redirect = "http://192.168.4.1/";
  server.sendHeader("Location", redirect, true);
  server.sendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  server.send(302, "text/plain", "");
}

void handleSubmit() {
  String name  = server.arg("name");
  String phone = server.arg("phone");
  String lat   = server.arg("lat");
  String lon   = server.arg("lon");

  if (lat == "" || lat == "0") lat = "24.910753";
  if (lon == "" || lon == "0") lon = "67.118386";

  String packet = "NAME:" + name + ",PHONE:" + phone + ",LAT:" + lat + ",LON:" + lon;

  Serial.println(">>> Trying to TX LoRa...");
  LoRa.beginPacket();
  LoRa.print(packet);
  int ok = LoRa.endPacket();
  Serial.printf(">>> TX result=%d  packet=%s\n", ok, packet.c_str());

  if (ok == 1) {
    server.send(200, "text/plain", "OK - Alert sent! Stay where you are.");
  } else {
    server.send(200, "text/plain", "FAIL - LoRa transmit failed (result=0). Check power/wiring.");
  }
}

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println();
  Serial.println("==== NODE BOOT ====");
  Serial.println("STEP 1: Serial alive");

  SPI.begin(SCK, MISO, MOSI, SS);
  Serial.println("STEP 2: SPI started");

  LoRa.setPins(SS, RST, DIO0);
  Serial.println("STEP 3: LoRa pins set");

  if (!LoRa.begin(433E6)) {
    Serial.println("STEP 4: LoRa.begin FAILED");
  } else {
    Serial.println("STEP 4: LoRa.begin OK");
  }

  LoRa.setTxPower(17);
  LoRa.setSpreadingFactor(9);
  LoRa.setSignalBandwidth(125E3);
  LoRa.setCodingRate4(5);
  LoRa.setSyncWord(0xF3);
  LoRa.enableCrc();
  Serial.println("STEP 5: LoRa configured");

  WiFi.softAP(ssid);
  WiFi.setSleep(false);   // keep WiFi awake so it doesn't starve LoRa TX
  Serial.print("STEP 6: Hotspot up, IP=");
  Serial.println(WiFi.softAPIP());

  dnsServer.start(53, "*", WiFi.softAPIP());
  Serial.println("STEP 7: DNS started");

  server.on("/", handleRoot);
  server.on("/submit", handleSubmit);

  // Captive portal probe URLs - force the phone OS to show "Sign in" popup.
  server.on("/generate_204",       handleCaptiveRedirect); // Android (Samsung)
  server.on("/gen_204",            handleCaptiveRedirect); // older Android
  server.on("/hotspot-detect.html",handleCaptiveRedirect); // iOS, macOS
  server.on("/library/test/success.html", handleCaptiveRedirect); // iOS variant
  server.on("/ncsi.txt",           handleCaptiveRedirect); // Windows
  server.on("/connecttest.txt",    handleCaptiveRedirect); // Windows
  server.on("/redirect",           handleCaptiveRedirect); // generic
  server.on("/success.txt",        handleCaptiveRedirect); // Firefox

  // Anything else also redirects to the portal
  server.onNotFound(handleCaptiveRedirect);

  server.begin();
  Serial.println("STEP 8: HTTP server ready");

  Serial.println("==== NODE READY ====");
}

void loop() {
  dnsServer.processNextRequest();
  server.handleClient();
}