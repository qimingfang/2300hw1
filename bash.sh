#!/bin/sh

list=`ls -d submissions/*/`

for D in $list
do
    rm ../html/$1/script.js
    rm ../html/$1/saveFile.php
   
    #default savePage (in case student didn't submit one)
    cp ../html/saveFile.php ../html/$1/saveFile.php
 
    cp $D/script.js ../html/$1/script.js
    cp $D/savePage.php ../html/$1/saveFile.php
    cp ../html/lorem.txt ../html/$1/lorem.txt

    chmod 777 ../html/$1/saveFile.php
    chmod 777 ../html/$1/lorem.txt

    node test.js $2/$1/index.php chrome $D
done
