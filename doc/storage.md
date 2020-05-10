# Ramdisk

## Create usergroup and add user pi

    sudo groupadd cam
    sudo usermod -a -G cam pi 

## Create targetDir for images

    sudo mkdir /var/cam
    sudo chown root:cam /var/cam

## Create 250MB ramdisk

    sudo echo "tmpfs /var/cam tmpfs nodev,nosuid,size=250M 0 0 " >> /etc/fstab

    sudo sh -c "echo 'tmpfs /var/cam tmpfs nodev,nosuid,size=250M 0 0 ' >> '/etc/fstab'"
    sudo mount -a

df -h

## USB hdd

### Peek

    pi@raspberrypi:~ $ sudo fdisk -l 

[...]

    Disk /dev/sda: 3,7 TiB, 4000752599040 bytes, 7813969920 sectors
    Disk model: Elements 25A1
    Units: sectors of 1 * 512 = 512 bytes
    Sector size (logical/physical): 512 bytes / 4096 bytes
    I/O size (minimum/optimal): 4096 bytes / 4096 bytes
    Disklabel type: gpt
    Disk identifier: AAC1622E-8522-41F4-86B5-855D6E575501
    
    Device     Start        End    Sectors  Size Type
    /dev/sda1   2048 7813969886 7813967839  3,7T Linux filesystem

### Mount

    sudo blkid

example without usb hdd:

    pi@raspberrypi:~ $ sudo blkid
    devmmcblk0p1: LABEL_FATBOOT="boot" LABEL="boot" UUID="4BBD-D3E7" TYPE="vfat" PARTUUID="738a4d67-01"
    devmmcblk0p2: LABEL="rootfs" UUID="45e99191-771b-4e12-a526-0779148892cb" TYPE="ext4" PARTUUID="738a4d67-02"
    devmmcblk0: PTUUID="738a4d67" PTTYPE="dos"

example with usb hdd:

    devmmcblk0p1: LABEL_FATBOOT="boot" LABEL="boot" UUID="4BBD-D3E7" TYPE="vfat" PARTUUID="738a4d67-01"
    devmmcblk0p2: LABEL="rootfs" UUID="45e99191-771b-4e12-a526-0779148892cb" TYPE="ext4" PARTUUID="738a4d67-02"
    devsda1: UUID="40ae4c8f-77f9-4ce5-b2ce-3c00a930af59" TYPE="ext4" PARTUUID="91476ab0-003d-714f-9780-65d176699c32"
    devmmcblk0: PTUUID="738a4d67" PTTYPE="dos"

The new one is
 
    devsda1: UUID="40ae4c8f-77f9-4ce5-b2ce-3c00a930af59" TYPE="ext4" PARTUUID="91476ab0-003d-714f-9780-65d176699c32"

// --------------------------

    sudo mkdir /mnt/hdd
    sudo chmod 770 /mnt/hdd

// --------------------------

    get User ID
    As user pi:
    echo $UID
    1000

    Get group ID
    cut -d: -f3 < <(getent group pi)
    1000

// --------------------------

    pi@raspberrypi:~ $ ls -la /dev/disk/by-uuid/
    insgesamt 0
    drwxr-xr-x 2 root root 100 Mai  1 17:53 .
    drwxr-xr-x 7 root root 140 Feb 13 17:09 ..
    lrwxrwxrwx 1 root root  10 Mai  1 17:53 40ae4c8f-77f9-4ce5-b2ce-3c00a930af59 -> ../../sda1
    lrwxrwxrwx 1 root root  15 Mai  1 17:44 45e99191-771b-4e12-a526-0779148892cb -> ../../mmcblk0p2
    lrwxrwxrwx 1 root root  15 Mai  1 17:44 4BBD-D3E7 -> ../../mmcblk0p1

// --------------------------

    ls -la /dev/disk/by-uuid/ | grep sda1
    
    pi@raspberrypi:~ $ ls -la /dev/disk/by-uuid/ | grep sda1
    lrwxrwxrwx 1 root root  10 Mai  1 17:53 40ae4c8f-77f9-4ce5-b2ce-3c00a930af59 -> ../../sda1

// --------------------------

nofail etc

nobootwait
nofail

source: https://www.raspberrypi.org/forums/viewtopic.php?t=207711
