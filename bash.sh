#!/bin/sh

list=`ls -d submissions/*/`


for D in $list
do
    rm ../html/$1/script.js
    rm ../html/$1/savePage.php
    #cp -a $D. ../html/$1/
    
    cp $D/script.js ../html/$1/
    cp $D/savePage.php ../html/$1/

    node test.js $2/$1/index.php chrome $D
done
