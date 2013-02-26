#!/bin/sh

list=`ls -d submissions/*/`

for D in $list
do
    rm ../html/$1/script.js
    rm ../html/$1/savePage.php
   
    #default savePage (in case student didn't submit one)
    cp ../html/savePage.php ../html/$1/savePage.php
 
    cp $D/script.js ../html/$1/script.js
    cp $D/savePage.php ../html/$1/savePage.php
    cp ../html/lorem.txt ../html/$1/lorem.txt

    chomd 777 ../html/$1/savePage.php
    chmod 777 ../html/$1/lorem.txt

    node test.js $2/$1/index.php chrome $D
done
