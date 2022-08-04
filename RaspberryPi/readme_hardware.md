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
Scroll all the way down to find the startup script.


## Hardware List

Raspberry Pi 4
22 AWG solid core wire 
WS2812B LED strips
3 pin strip to wire connectors (soldering is better)
3D printed case and diffusers provided by Iain 
10” Raspberry Pi touchscreen
External power supply for WS2812B
¼”  Heat shrink tubing  (1/3 shrink ratio)

What we would have bought/ done differently:
22 AWG stranded wire 3pin LED strip wire
Soldering the wires
12” Pi touchscreen ?

SSH into the Pi using PuTTY
Hostname: theaterbusser
Password: raspberry
