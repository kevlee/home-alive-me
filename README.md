# VuejsApp1


Generate images for rasbian

docker buildx build --platform linux/arm/v7 -f .\Dockerfile-rpi -t ham-web-rpi .

prepare the raspberry


minimum graphique tools

sudo apt-get install --no-install-recommends chromium-browser
sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit
sudo apt-get install matchbox-window-manager
sudo apt-get install lightdm

sudo apt-get install docker
sudo apt-get install docker-compose


edit the startup config
sudo vim "/boot/config.txt"
uncomment hdmi_force_hotplug=1 and hdmi_drive=2

set auto destop log 
sudo raspi-config
go to menu 3 Boot Options
go to menu B1 Choose whether to boot into a desktop environment or the command line 
Select B4 Desktop Autologin Desktop GUI, automatically logged in as 'pi' user 


create docker network warning only work with eth no tested yet
pi@raspberrypi:~ $ docker network create -d macvlan --subnet=192.168.1.192/24 --gateway=192.168.1.254 --ip-range=192.168.1.192/27 --aux-address='host=192.168.1.192' -o parent=wlan0 -o macvlan_mode=bridge vlan
5838671ecb94916d749c3c9281a6c5c1744a910035f271277a28cebf5384c9dd
pi@raspberrypi:~ $ sudo ip link add vlan link wlan0 type macvlan mode bridge
pi@raspberrypi:~ $ sudo ip addr add 192.168.1.192/27 dev vlan metric 300
pi@raspberrypi:~ $ sudo ifconfig vlan up
pi@raspberrypi:~ $ docker run -d --net=vlan --ip 192.168.1.193 -p 192.168.1.193:80:80 --expose=80 kevlee/ham-web-rpi


workarround use ip addr add directly on wlan0 (durty solution)

