# Preview

For the new Pi Camera module we have to set the focus manual. This is hard without direct feedback.

So I tried [RPi-Cam](https://elinux.org/RPi-Cam-Web-Interface) and it seems to work well.
It is Open Source and availabel on [Github](https://github.com/silvanmelchior/RPi_Cam_Web_Interface).  

    sudo apt-get update
    sudo apt-get dist-upgrade
    git clone https://github.com/silvanmelchior/RPi_Cam_Web_Interface.git
    cd RPi_Cam_Web_Interface
    ./install.sh

Set autostart to off!

Only one appication can use the camera and when the RPi Cam runs we cannot capture pictures.
  
