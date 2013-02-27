#!/usr/bin/python
import csv
import os
import string

f = csv.writer(open("grades.csv", "wb+"))
f.writerow(["NetID", "Grade", "Add Comments"])
lines1 = open("grading/output.txt").read().splitlines()
lines2 = open("grading2/output.txt").read().splitlines()
lines3 = open("grading3/output.txt").read().splitlines()
for idx, x in enumerate(lines1):
    if idx % 2 == 0:
        newStrin = string.split(x,",",2)
        netid = string.split(newStrin[0],"/")
        comments = newStrin[2].replace(",","\n")
        f.writerow([netid[1], newStrin[1],comments])

for idx, x in enumerate(lines2):
    if idx % 2 == 0:
        newStrin = string.split(x,",",2)
        netid = string.split(newStrin[0],"/")
        comments = newStrin[2].replace(",","\n")
        f.writerow([netid[1], newStrin[1],comments])

for idx, x in enumerate(lines3):
    if idx % 2 == 0:
        newStrin = string.split(x,",",2)
        netid = string.split(newStrin[0],"/")
        comments = newStrin[2].replace(",","\n")
        f.writerow([netid[1], newStrin[1],comments])


