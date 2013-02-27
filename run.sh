cd grading
git pull origin master
sh bash.sh grading http://216.121.62.130:505/ > output.txt &
cd ..

cd grading2
git pull origin master
sh bash.sh grading2 http://216.121.62.130:505/ > output.txt &
cd ..

cd grading3
git pull origin master
sh bash.sh grading3 http://216.121.62.130:505/ > output.txt &
cd ..
