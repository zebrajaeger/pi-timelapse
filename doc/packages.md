# Packages

## ~~nvm~~

Does not work due to non interactive shell used by remote-code.
Use standard node installation instead. 

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

reopen terminal

    nvm install --lts

## Node

    curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    sudo apt-get install -y nodejs

## pm2

    npm i -g pm2

## ~~mosquitto~~ 

not needed anymore

source: https://www.modius-techblog.de/smart-home/mqtt-broker-auf-dem-raspberry-pi/

sudo apt install -y mosquitto mosquitto-clients
sudo systemctl enable mosquitto.service

test:
mosquitto_sub -t test &
mosquitto_pub  -t test -m "Hello world!"

example:
root@raspberrypi:/home/pi/test# mosquitto_sub -t test &
[1] 2280
root@raspberrypi:/home/pi/test# mosquitto_pub  -t test -m "Hello world!"
Hello world!
