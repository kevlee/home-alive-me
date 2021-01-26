# API

prepare the raspberry


sudo apt-get install --no-install-recommends chromium-browser
sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit
sudo apt-get install matchbox-window-manager

sudo apt-get install docker

edit the startup config
sudo vim "/boot/config.txt"
uncomment hdmi_force_hotplug=1 and hdmi_drive=2