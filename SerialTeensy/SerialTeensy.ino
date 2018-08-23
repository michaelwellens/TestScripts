// set this to the hardware serial port you wish to use
#define HWSERIAL Serial1

void setup() {
  Serial.begin(9600);
  HWSERIAL.begin(38400, SERIAL_8N1);
}

void serialEvent1 () {
  String incomingString;
  incomingString = HWSERIAL.read();
  Serial.print(incomingString);
}

void loop() {
        
        //HWSERIAL.print("Hallo");
        //delay(500);
        
}
