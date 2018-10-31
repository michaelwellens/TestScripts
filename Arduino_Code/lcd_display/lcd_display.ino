// include the library code:
#include <LiquidCrystal.h>

// Initialize the library with the numbers of the interface pins
LiquidCrystal lcd(7,6,5,4,3,2);

// Declare variables
const int interruptPin = 18;
volatile unsigned long time_passed;
volatile unsigned long trigger_time;


void setup() {
  // set up the LCD's number of columns and rows:
  lcd.begin(16,2);

  // Define pinmode and interupt
  pinMode(interruptPin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(interruptPin), showPassedTime, RISING);

}



void loop() {
  lcd.setCursor(0,0);
  // Print a message to the LCD
  lcd.print(" since reset");
  // set the cursor to column 0, line 2
  //(note: line 2 is the second row, since first row is 0);
  lcd.setCursor(0,2);
  //print the number of secime_elapsed = millis() - trigger_time;onds since reset:
  time_passed = millis()/100 - trigger_time;
  lcd.print(time_passed);

}

void showPassedTime() {
  cli();
  trigger_time = millis()/100;
  lcd.clear();
  sei();
}

