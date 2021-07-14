# pi-timelapse

## Config pi

- enable camera
- enable serial (optional)
- enable gpio
- extend file system (optional)

## Install dependencies

    sudo apt install libudev-dev 

## Hardware interface

Timelapse JPG capture with raspberry pi and Raspberry Pi camera

Hardware/Schematic: https://easyeda.com/zebrajaeger/pi-timelapse

TODO: shutdown: https://www.embeddedcomputing.com/technology/open-source/development-kits/raspberry-pi-power-up-and-shutdown-with-a-physical-button

## Install requirements

### Update

    sudo apt update
    sudo apt upgrade

### NodeJs

- nvm does not work for development, node has to be installed globally


    sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
    sudo apt-get install -y nodejs

check:

    pi@pi4:~ $ node --version
    v14.17.2

    pi@pi4:~ $ which node
    /usr/bin/node

### nodemon (develop only)

    sudo npm i -g nodemon

### Yarn (develop, optional)

    sudo npm i yarn

### usbmount

- usbmount, take a look at https://gist.github.com/zebrajaeger/168341df88abb6caaea5a029a2117925
- nodejs 

### create 200MB temp dir (RAMdrive)

#### Create folder

    sudo mkdir /var/cam
    sudo chmod 1757 /var/cam

#### create fstab entry

    sudo nano /etc/fstab

add

    tmpfs /var/cam tmpfs nodev,nosuid,size=200M 0 0
    
mount it for this time (automatically on reboot)

    sudo mount -a

check it

    pi@pi4:~ $ mount | grep cam
    tmpfs on /var/cam type tmpfs (rw,nosuid,nodev,relatime,size=204800k)


## Develop

Uses rsync and seems to have trouble with cygwin. 

    cd dev
    npm run develop
