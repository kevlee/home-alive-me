# HAM Guide

## Introduction

HAM or homealiveme is a domotic software create for technical/no-technical users. HAM avoids people to spend hour to
configure and add domotic devices in their home.

The MVP only support Zwave connection on Linux serveur.

Furthermore, the software was think to fit to the 7 inch screen size. In other word, you coud complety create
workstation for your domotic system.

I will not say you can install it without technical skill because the MVP doesn't integrate auto-installer

## Pre-requirement

- Raspberry PI (at leat version 3)
- Zwave USB: https://fr.aliexpress.com/item/32891184698.html?spm=a2g0s.9042311.0.0.27426c375KU27R
- Touche screen 7 inch (optionnal) : https://fr.aliexpress.com/item/32891184698.html?spm=a2g0s.9042311.0.0.27426c375KU27R

## Rasberry Pi installation

You can use the raspberry softwar to create an SD card for tour Raspberry Pi

<div align="center"> https://www.raspberrypi.org/software/ </div>

Personnaly, i chose lite image: the Raspberry Pi OS Lite and update it to raspbian buster

You have to connect the raspberrypi to your wifi with the raspbian software :

	sudo raspi-config


## Basic installation

- Install git & docker :

		sudo apt-get install -y git docker docker-compose

- Create application IPs :
		
		sudo ip addr add 192.168.1.193 dev wlan0
		sudo ip addr add 192.168.1.194 dev wlan0
		sudo ip addr add 192.168.1.195 dev wlan0

- Set the graphical environnments:


		sudo apt-get install --no-install-recommends chromium-browser
		sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit
		sudo apt-get install matchbox-window-manager
		sudo apt-get install lightdm


- Set auto-login:

		sudo raspi-config
	- Select menu 3 Boot Options
	- Select menu B1 Choose whether to boot into a desktop environment or the command line 
	- Select B4 Desktop Autologin Desktop GUI, automatically logged in as 'pi' user

	**NB: You can create another user before this step to avoid an
	auto-login with full access to the Raspberry Pi**

- Edit startup configuration (Always boot the HDMI):

	*You have to uncomment the line with thoses variables 
	hdmi_force_hotplug=1 and hdmi_drive=2 in file "/boot/config.txt"*

		sudo nano "/boot/config.txt"

- Get the application sources:

		git clone https://github.com/kevlee/home-alive-me.git

- Launch application:

		cd home-alive-me && docker-compose up -d
		chromium-browser --kiosk 192.168.1.193


## Development GUIDE


### Launche a development server

- Get the application sources:

		git clone https://github.com/kevlee/home-alive-me.git

- Change IP in .env.development files by your computer IP.
- Launch server:

		cd home-alive-me && npm start server
		cd home-alive-me/API && npm start server
  


### Generate images for rasbian

	#in home-alive-me folder
	docker buildx build --platform linux/arm/v7 -f .\Dockerfile-rpi -t ham-web-rpi .
	#in home-alive-me/API folder
	docker buildx build --platform linux/arm/v7 -f .\Dockerfile-rpi -t ham-api-rpi .

### Ethernet connection (not tested):

If you use the eth0 interface you could create the application IPs with macvlan (not possible with wlan0 because the wifi
prevents to use virtual mac address through the local network)

	docker network create -d macvlan --subnet=192.168.1.192/24 --gateway=192.168.1.254 --ip-range=192.168.1.192/27 --aux-address='host=192.168.1.192' -o parent=eth0 -o macvlan_mode=bridge vlan
	sudo ip link add vlan link eth0 type macvlan mode bridge
	sudo ip addr add 192.168.1.192/27 dev vlan
	sudo ifconfig vlan up

*You have to change the dockerfile in order to connect docker images to the previous network created*



