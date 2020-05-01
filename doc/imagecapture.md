# imagecapture


## raspistill

Doc: https://www.raspberrypi.org/documentation/raspbian/applications/camera.md
Source: https://github.com/raspberrypi/userland/blob/master/host_applications/linux/apps/raspicam/RaspiStill.c

Options we use:

--mode 2
--encoding jpg
--quality 100

[--raw]

--thumb none
--nopreview
--burst

--timeout 3600 // in ms; 1h=3600000
--timelapse 1000 //in ms
--timestamp

--exposure auto //auto,night,nightpreview,backlight,spotlight,sports,snow,beach,verylong,fixedfps,antishake,fireworks
--metering average // average, spot, backlit, matrix
--drc off // dynmaic range compression off,low,med,high
--digitalgain 1

--awb off // off, auto, sun.cloud,shade,tungsten,fluorescentincandescent,flash,horizon,greyworld
--flicker off // off,auto,50hz,60hz
--imxfx none // no effects

--stats
--verbose

raspistill \
--mode 2 --encoding jpg --quality 100 \
--thumb none --nopreview --burst \
--timeout 60000 --timelapse 1000 \
--exposure auto  --metering average --drc off --digitalgain 1 \
--awb off --flicker off --imxfx none \
--stats --verbose \
--timestamp -o /var/cam/img-%08d.jpg

//raspistill -n -md 2  -tl 1000 -t 60000 -v --thumb none -bm -o /var/cam/img-%08d.jpg -q 100  
