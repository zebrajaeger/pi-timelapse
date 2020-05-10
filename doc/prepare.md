# Prepare

## Install image

Use imager from rapberyy pi: https://www.raspberrypi.org/downloads/

and install raspbian lite without desktop

## Enable ssh

After flashing open boot partition of SDCard and create a empty file with name 'ssh' to enable ssh daemon

Source: https://www.raspberrypi.org/documentation/remote-access/ssh/

## Change system language

    cat /usr/share/i18n/SUPPORTED

// on error with locales (maybe cause of ssh)
    sudo echo "export LANGUAGE=de_DE.UTF-8" >> .bashrc
    sudo echo "export LANG=de_DE.UTF-8" >> .bashrc
    sudo echo "export LC_ALL=de_DE.UTF-8" >> .bashrc

    sudo raspi-config nonint do_change_locale de_DE.UTF-8 UTF-8
    sudo raspi-config nonint do_change_timezone Europe/Berlin
    sudo raspi-config nonint do_configure_keyboard de

## Enable sshd

## Enable serial console/terminal

    raspi-config nonint do_serial 0

## Enable cam

    sudo raspi-config nonint do_camera 0

## expand file system

    sudo raspi-config nonint get_can_expand
    sudo raspi-config nonint do_expand_rootfs
