Test Harness
==========
This is the test harness for HW1. Currently supports firefox v10 and ie9 on win7 platform.

Installation
===
All of the necessary dependencies are defined in package.json. Run the following to install dependencies.
    $ sudo npm install

How to Run
===
Need to start localtunnel. For gem lovers (http://progrium.com/localtunnel/). For nodejs lovers (https://github.com/shtylman/localtunnel)
    
    $ npm install -g localtunnel

Start apache server

    $ lt --port 80 #will return a url. Let's call this testurl
    $ node test.js [testurl] [browser = {firefox | chrome | ie}]
    
An example of this may be

    $ node test.js http://dpsh.localtunnel.me/2300/hw1_sol/indexAns.php firefox
  
Results
===
Results should be displayed as JSON array

    [ { test: 1, msg: 'passed' },
    { test: 2, msg: 'passed' },
    { test: 3, msg: 'passed' },
    { test: 4, msg: 'passed' },
    { test: 5, msg: 'passed' },
    { test: 6, msg: 'passed' },
    { test: 7, msg: 'passed' },
    { test: 8, msg: 'passed' },
    { test: 9, msg: 'passed' },
    { test: 10, msg: 'passed' },
    { test: 11, msg: 'passed' },
    { test: 12, msg: 'passed' },
    { test: 13, msg: 'passed' },
    { test: 14, msg: 'passed' },
    { test: 15, msg: 'passed' } ]
    
Contents of the test should be viewable on sauce labs. Simply change my account credentials to yours to view test video
