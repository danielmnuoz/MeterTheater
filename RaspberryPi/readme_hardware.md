## Kiosk Mode
Shell script located at
        $sudo nano /home/theaterbusser/kiosk.sh
       
Stop kiosk mode

        $sudo systemctl stop kiosk.serivce
        
Enable kiosk mode (running at boot)

        $sudo systemctl enable kiosk.serice 
Disable kiosk mode (stop running at boot)

        $sudo systemctl disable kiosk.service

Enable theater.py at boot:

        $sudo nano /home/theaterbusser/ .bashrc
	
Scroll all the way down to find the startup script:

	echo Running at boot
	sudo python3 /home/theaterbusser/Desktop/theater.py
	

## Hardware List

	Raspberry Pi 4
	22 AWG solid core wire 
	WS2812B LED strips
	3 pin strip to wire connectors 
	3D printed case and diffusers provided by Iain 
	10” Raspberry Pi touchscreen
	External power supply for the LED strip
	Wire clips
	¼”  Heat shrink tubing  (1/3 shrink ratio)


## LED Strip
The project uses a W2812B RGB Addressable LED Strip. The Pi has a library called NeoPixel that allows users to change a specific LED at a designated location. The library only works with 2811/2812 RGB LED strips.
## SSH into the Pi using PuTTY

Hostname: theaterbusser
Password: raspberry

## What we would have bought/ done differently:
	22 AWG stranded (instead of solid) wire 3pin LED strip wire
	Soldering the wires
	12” Pi touchscreen ?
