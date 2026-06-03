// ============================================================
//  GATEWAY (USB-bridge version)
//  No WiFi. No HTTP. Just LoRa RX -> print to USB serial.
//  A python script on the laptop reads serial and POSTs to backend.
// ============================================================

#include <LoRa.h>
#include <SPI.h>

// LoRa pins for Heltec V2
#define SCK 5
#define MISO 19
#define MOSI 27
#define SS 18
#define RST 14
#define DIO0 26

unsigned long lastHeartbeat = 0;
unsigned long lastRxArm     = 0;

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println();
  Serial.println("==== GATEWAY BOOT (USB bridge mode) ====");

  SPI.begin(SCK, MISO, MOSI, SS);
  LoRa.setPins(SS, RST, DIO0);

  if (!LoRa.begin(433E6)) {
    Serial.println("LoRa.begin FAILED");
    while (1) delay(1000);
  }
  Serial.println("LoRa.begin OK");

  // MUST match node exactly
  LoRa.setTxPower(17);
  LoRa.setSpreadingFactor(9);
  LoRa.setSignalBandwidth(125E3);
  LoRa.setCodingRate4(5);
  LoRa.setSyncWord(0xF3);
  LoRa.enableCrc();

  LoRa.receive();
  Serial.println("==== GATEWAY READY ====");
}

void loop() {
  // Heartbeat so you can see the loop is alive
  if (millis() - lastHeartbeat > 10000) {
    lastHeartbeat = millis();
    Serial.printf("[heartbeat] uptime=%lus\n", millis() / 1000);
  }

  // Re-arm RX every second just in case
  if (millis() - lastRxArm > 1000) {
    lastRxArm = millis();
    LoRa.receive();
  }

  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    String packet = "";
    while (LoRa.available()) packet += (char)LoRa.read();

    // Print the packet on a single line with a known prefix so the
    // python script can parse it reliably.
    Serial.print("PACKET:");
    Serial.println(packet);

    Serial.printf("META: size=%d RSSI=%d SNR=%.1f\n",
                  packetSize, LoRa.packetRssi(), LoRa.packetSnr());
  }
}