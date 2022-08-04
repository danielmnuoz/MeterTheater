#shell script for kiosk mode for Chromium
#located at home/theaterbusser/kiosk.sh
#!/bin/bash
#stops the Pi from blanking out 
xset s noblank
xset s off
xset -dpms

#runs unclutter that hides the mouse if idling for more than 5 sec
unclutter -idle 5 -root &

#clear warning bars
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/theaterbusser/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/theaterbusser/.config/chromium/Default/Preferences

#launches metertheater in chromium in Kiosk
/usr/bin/chromium-browser  --kiosk https://metertheater &

#infinity loop that makes chromium switch tab every 15 sec
while true; do
         xdotool keydown ctrl+Next; xdotool keyup ctrl+Next;
      sleep 15
done
