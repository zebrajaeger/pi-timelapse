# Tools

## .ssh

mkdir ~/.ssh
chmod 700 ~/.ssh

touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

copy public key as new line in ~/.ssh/authorized_keys

## ll

echo "# Custom aliases" >> ~/.bashrc
echo "alias l='ls -aldh --color=auto'" >> ~/.bashrc
echo "alias ll='ls -ald --color=auto'" >> ~/.bashrc

## mc

sudo apt install mc

## samba

sudo apt-get install samba

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

password:

sudo smbpasswd -a pi

sudo service smbd restart
sudo service smbd status

## git

sudo apt install git

