# VuejsApp1

prepare the raspberry


minimum graphique tools

sudo apt-get install --no-install-recommends chromium-browser
sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit
sudo apt-get install matchbox-window-manager
sudo apt-get install lightdm

sudo apt-get install docker


edit the startup config
sudo vim "/boot/config.txt"
uncomment hdmi_force_hotplug=1 and hdmi_drive=2

set auto destop log 
sudo raspi-config
go to menu 3 Boot Options
go to menu B1 Choose whether to boot into a desktop environment or the command line 
Select B4 Desktop Autologin Desktop GUI, automatically logged in as 'pi' user 
