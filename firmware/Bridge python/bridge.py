"""
LoRa Gateway USB Bridge
Reads packets from gateway.ino over USB serial, POSTs them to backend.
"""
import json
import sys
import time
import requests
import serial

# ============ CONFIG ============
SERIAL_PORT = "COM4"
BAUD_RATE   = 115200
API_URL     = "http://localhost:8000/api/users/entry"
# ================================


def parse_packet(line: str):
    if not line.startswith("PACKET:"):
        return None
    body = line[len("PACKET:"):].strip()
    fields = {}
    for part in body.split(","):
        if ":" not in part:
            continue
        key, value = part.split(":", 1)
        fields[key.strip().upper()] = value.strip()
    try:
        return {
            "name": fields.get("NAME", ""),
            "emergency_number": fields.get("PHONE", ""),
            "latitude": float(fields.get("LAT", "0")),
            "longitude": float(fields.get("LON", "0")),
        }
    except ValueError as exc:
        print(f"  ! could not parse lat/lon: {exc}")
        return None


def post_to_backend(payload: dict):
    try:
        print(f"  -> POSTing to {API_URL}")
        print(f"     payload: {json.dumps(payload)}")
        response = requests.post(
            API_URL,
            json=payload,
            timeout=10,
            headers={"Content-Type": "application/json"},
        )
        print(f"  <- HTTP {response.status_code}: {response.text[:200]}")
    except requests.exceptions.RequestException as exc:
        print(f"  ! POST failed: {exc}")


def main():
    print(f"Opening {SERIAL_PORT} at {BAUD_RATE} baud...")
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    except serial.SerialException as exc:
        print(f"FATAL: could not open {SERIAL_PORT}: {exc}")
        print("Make sure the Arduino IDE Serial Monitor is CLOSED.")
        sys.exit(1)

    print("Listening for LoRa packets from gateway...")
    print("=" * 60)

    while True:
        try:
            raw = ser.readline()
            if not raw:
                continue
            line = raw.decode("utf-8", errors="replace").strip()
            if not line:
                continue
            print(f"[gateway] {line}")
            if line.startswith("PACKET:"):
                payload = parse_packet(line)
                if payload:
                    post_to_backend(payload)
                else:
                    print("  ! packet parsing failed")
        except KeyboardInterrupt:
            print("\nStopped by user.")
            break
        except Exception as exc:
            print(f"  ! unexpected error: {exc}")
            time.sleep(1)

    ser.close()


if __name__ == "__main__":
    main()