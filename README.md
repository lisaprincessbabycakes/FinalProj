# Milestone 1 - Project ideas and diagrams

## Idea #1  Virtual pet on screen with LED interaction 
A virtual pet system that displays an animated character on p5.js canvas and responds to user input (Arduino button or touch sensor) - the pet’s mood changes based on how the user interacts with it and the LED lights provides physical feedback. 
- Feature include: virtual pet on screen, a p5.js animated character that displays different states (happy, neutral, sad, sleepy) and the states will change based on user interaction other than lack of interaction (pet neglect) 
- LED feedback: LEDs change color to represent pet’s mood (green= happy) (yellow = neutral) (red = sad) (blue = sleepy) — blinking patterns for additional expressiveness (eg. Slow pulse when sleepy) 
- User interaction: Button press to pet virtual character and the button triggers a feeding or playing animation that will affect the pet’s mood positively 
- Automated mood changes - if the user doesn’t interact with the pet for a set amount of time the pet’s mood will worsen which will trigger sad visuals and red LEDs. 

[![Untitled-Artwork-18.png](https://i.postimg.cc/Hn81c9tw/Untitled-Artwork-18.png)](https://postimg.cc/xNQ4BHh8)


## Idea #2 - Crochet Trainer 
As ambitious as this idea sounds, I want to implement my passion for crochet into this creative coding project. 

So this is a system that is designed to teach users to crochet specific stitches interactively. So this would combine instructions displayed on the screen with real-time feedback from user’s motions using sensors attached to the crochet hook. 

Arduino - inputs: motion sensors that are attached to the crochet hook to detect movement patterns 
LED indictors: light up green for correct motions and red for errors  - P5.js - animations, text-based guidance (“insert the hook here” “pull up a look”) , progress bar tracks how many stitches the user has completed and displays their progress. 

[![Untitled-Artwork-17.png](https://i.postimg.cc/Ls0HJ5pM/Untitled-Artwork-17.png)](https://postimg.cc/7C0vcxhB)


## Idea #3 - mini traffic light project 

Create a traffic light simulation that changes colors in sequence or in manual control. LEDs for red, yellow and green and buttons to switch lights as the arduino components. For the p5.js aspect, there will be visual displays of cars/pedestrians reacting to the lights.  Just a simple yet function project, good for understanding timing and logic. 

1. Automatic Mode: The lights change in a timed sequence (Red → Green → Yellow → Red).
2. Manual Mode: A button allows the user to switch the lights manually.
3. Visual Feedback: Lights displayed both physically with LEDs and virtually using p5.js.
4. Optional Additions:
    * Sound effects for each light (e.g., a beep when transitioning).
    * Animated cars or pedestrians reacting to the lights on p5.js.

    [![Untitled-Artwork-19.png](https://i.postimg.cc/BnkYtfVV/Untitled-Artwork-19.png)](https://postimg.cc/68VL1gwr)

# Milestone 2 - project proposal, planning and organizing

Based on the feedback from milestone 1, I've decided to pursue the crochet project idea. However, since detecting precise movements might be challenging, I'll simplify it so the needles can detect general movements and translate them into audio or visual patterns inspired by the crocheting motions. The Arduino will collect motion data from the crochet hook using sensors and then send the data to the computer through a serial connection, and P5.js will receive the motion data from Arduino to map motion data to generate dynamic visuals based on crochet movements. 

I'm going to be using the GY-521 MPU-6050 3 Axis Accelerometer Gyroscope Module (6-axis accelerometer) as the motion sensor 

## 1. Circuit Diagram: The Arduino Nano is connected to a motion sensor (accelerator/gyroscope) and powered through a USB external power supply. The sensors are attached to the crochet hook to capture motion data.
   [![Untitled-Artwork-24.png](https://i.postimg.cc/ncXcRJjW/Untitled-Artwork-24.png)](https://postimg.cc/ykzHx2Th)
   
## 2. Libraries for Arduino:
    * Adafruit_LSM6DSO (for accelerometer/gyroscope data).
    * ArduinoJson (for efficient data serialization).
* Libraries for p5.js:
    * p5.serialport (to communicate with Arduino).
    * p5.js built-in libraries for visuals (e.g., shapes, color, motion).

## 3. User Testing Plan
* Target Audience:
    * Artists and crafters interested in integrating technology into their creative processes.
      
* Testing Approach:
    * Recruit crocheters of varying skill levels.
    * Provide them with the instrumented crochet hook and observe their interactions.
    * Collect feedback on usability and the relevance of the visuals to their experience.

# References and inspo: 

Exploring existing projects that transform physical motion into digital art provides valuable inspiration and context. One notable example is Daniel Rozin's "Mechanical Mirrors" series. These installations use physical objects, such as wooden tiles, metal pieces, or other materials, arranged into a grid. The pieces move in response to the viewer's presence or gestures, creating reflective, pixelated images. Rozin's work bridges the gap between analog motion and digital expression, highlighting the interplay between physical interaction and artistic representation. It serves as a compelling example of how movement can be transformed into dynamic, visually striking digital art. If you ever been to the ITP 4th floor of this building, you would see the same work. 


Daniel Rozin – Mechanical Mirrors

## Pseudocode below : 
```
// Arduino
void loop() {
    readSensorData();
    sendDataToSerial();
}

// p5.js
function setup() {
    createCanvas(windowWidth, windowHeight);
    initializeSerialCommunication();
}

function draw() {
    clear();
    getMotionData();
    generateVisualsBasedOnData();
}
```
Initial Functions:
1. readSensorData() (Arduino): Reads motion sensor values.
2. sendDataToSerial() (Arduino): Sends serialized data to p5.js.
3. generateVisualsBasedOnData() (p5.js): Maps sensor values to visuals.


How the code works: The Arduino reads accelerometer (ax, ay, az) and gyroscope (gx, gy, gz) data and sends this data as a comma separated string via the serial port.
p5.js receives the data string via p5.serialport, splits the string into individual sensor values, and maps these values to visual elements (e.g., position, size).


Next Steps...... Set up the physical interaction with crochet hook and arduino 
Test the serial communication: Use the Arduino Serial Monitor to verify sensor data output and then use serial.print debugging in p5.js to ensure data is received correctly.
To Enhance visuals, I will experiment with color changes, particle systems, waveform effects, and map gyroscope data to rotational elements for more dynamic visuals.


# Milestone #3 

I brought the MPU6050 sensor, which combines an accelerometer and gyroscope. However, I have an issue connecting it to the Arduino for motion data acquisition and serial communication. Ideally, I would want the sensor to be attached to the crochet hook, reading the crochet hook's motion and relation in real time and sending data to p5.js to create visuals based on sensor data. 

[![Screenshot-2024-12-09-at-1-04-09-PM.png](https://i.postimg.cc/QtKLNtz7/Screenshot-2024-12-09-at-1-04-09-PM.png)](https://postimg.cc/YG7DbpM2)

I will be using external libraries p5.webserial.js for serial communication in p5.js and Sensor libraries (e.g., the MPU6050 library for Arduino).


Because the MPU6050 chip wasn’t working, I watched a tutorial that mentioned that the board has a built-in chip (LSM9DS1) - Its got three sensors (x.y.z) - accelerometer, gyroscope, and magnetometer and I had to download the library (LSM9DS1):

https://youtu.be/WJkn9ZmS9Gs?si=Gm0ggqQVrI1T9jRY

But unfortunately, I was also struggling with getting the code to work with the board.  
[![Screenshot-2024-12-08-at-10-19-43-PM.png](https://i.postimg.cc/PqRskZSh/Screenshot-2024-12-08-at-10-19-43-PM.png)](https://postimg.cc/Y4Yy64cy)

As for the moment, I might as well start with the coding for the p5.js visuals and how I envision how it would look like. 





