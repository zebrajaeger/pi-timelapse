# Timelapse

## Precoditions

A data sink like USB HDD that is writable mounted

Create a new directory on USB HDD whith timestamp as name

start Process 2
start Process 1


## Application workflow

### Process 1 : Image capture

Take every second a picture and store it to ramdisk /var/cam

### Process 2 : Copy images

Check ramdisk for new images and copy to usb drive/network ...
