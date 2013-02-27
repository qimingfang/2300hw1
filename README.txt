//FANG-LESTER Test Suite for HW1 Javascript HW

This is a very easy to use test suite for the HW1 for INFO 2300

look at our github page  https://github.com/qimingfang/2300hw1

checkout a copy 

1. in your linux server please have this setup and have node installed and an apache webserver

for apapche web

/var/www/html/(web folders)

if not.. you will have to modify the bash.sh script to pointto the correct location


1. in /var/www/   create three folders "grading"  "grading1"  "grading2"

2. in each folder do a git init and make sure tha tthe bash.sh file, test.js  and a folder called "submissions" is in each of the "grading" folders

3. in each grading folder have a ln s to npm and to node  

4. in each grading folder run the command "npm install"

5. then in each submissions folder drag the folders of the netid's (provided by professor) and stuff them in the submissions folders (so a third of the class in grading/submissions    a third in grading2/submissions etc...)

so it would look like grading/submissions/skl83/

where skl83 is the netid of the user

in each netid folder there should be a file called "script.js" and "savePage.php" if not that is ok... the user wil get a default score of 44 (min score)

6. back in var/www/ copy the run.sh script and leave it there along with the calgrades.py file

7. then navigate to /var/www/html/

8. there create another set of folders called "grading"  "grading1" "grading2"  just as before

9. in each of these folders add the index.php the lorem.txt and the stylesheet.css


***NOTE*** 
whenever u make a change to the test.js or bash.sh do not make the changes in the other test.js or bash.sh in the other files in the other grading folder. Just do a git commit and git push as the run.sh bash script will do a git pull before the tests start automatically (updating all the other directories)


10. you will need to edit the test.js file in /var/www/grading/ to change the saucelabs username and key to match to your saucelabs account (for the video outputs) also edit the bash.sh for any changes 


12 to run the test do

./run.sh &

note :: it will take anywhere from 40 mins to 1 hr to run for the entire classs

if you need to kill the process at anytime do

ps aux | grep bash 

this will find the bash processes and you can do

kill -9 pid (pid for processid) to kill the process

13.  When done go to /var/www/

14. then run ./calgrades.py

15. this will create a grades.csv file that is ready to upload to CMS


16. NOTE::: you may have a few students who the tests case did not work (probably someone with nested checkboxes (a checkbox that fires another checkbox).. this will not create an error. instead they will be blank on CMS u neede to grade manually)....

17. everyone that has a grade on CMS is graded correctly.. anyone blank needs to be graded manually.. should be no more than 2-3 people on average each year.

18.. take of points for late submission accordingly on cms

19. for people who did submit a file might recieve a 44 not a 0.. go ahead and manually change that to 0...

20. All good to go! enjoy



