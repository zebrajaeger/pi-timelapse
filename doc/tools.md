# Tools

## .ssh

folder

    mkdir ~/.ssh
    chmod 700 ~/.ssh

authorized keys file

    touch ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys

copy public key as new line in ~/.ssh/authorized_keys

## ll

    echo "# Custom aliases" >> ~/.bashrc
    echo "alias l='ls -aldh --color=auto'" >> ~/.bashrc
    echo "alias ll='ls -ald --color=auto'" >> ~/.bashrc
    echo "alias d='du -hs .[^.]* | sort -hr'" >> ~/.bashrc

logout/login or reread config

    source ~/.bashrc

## mc

    sudo apt install mc

## samba

source: https://www.elektronik-kompendium.de/sites/raspberry-pi/2007071.htm

    sudo apt-get install samba

smb.conf

    pi@raspberrypi:/var/log/samba $ cat /etc/samba/smb.conf
    [global]
    workgroup = WORKGROUP
    security = user
    encrypt passwords = yes
    client min protocol = SMB2
    client max protocol = SMB3
    
    [SambaTest]
    comment = Samba-Test-Freigabe
    path = /home/pi
    read only = no

set password for user 'pi':

    sudo smbpasswd -a pi

restart samba

    sudo service smbd restart
    sudo service smbd status

## git

    sudo apt install git

