var fs = require('fs');
var util = require('util');

var dir = "/Applications/MAMP/htdocs/2300_test/";

fs.readdir(dir + "submissions", function(err, files){
	copy_file_for_students_who_didnt_submit(0, files, "savePage.php", function(){
		copy_file_for_students_who_didnt_submit(0, files, "script.js", function(){
			copy_file_for_students_who_didnt_submit(0, files, "index.php", function(){
				copy_file_for_students_who_didnt_submit(0, files, "stylesheet.css", function(){
					copy_file_for_students_who_didnt_submit(0, files, "lorem.txt", function(){
						console.log("done");
					})
				})
			})
		})
	})
})

var copy_file_for_students_who_didnt_submit = function(idx, files, filename, cb){
	if (idx == files.length)
		cb();

	else {
		var path = dir + "submissions/" + files[idx] + "/";
		
		fs.readdir(path, function(err, f){
			var matched = false;

			for (var i in f){
				if (f[i] == filename){
					matched = true;
					break;
				}
			}

			if (matched){
				copy_file_for_students_who_didnt_submit(idx+1, files, filename, cb);
			} else {
				fs.copy(dir + filename, path + filename, function(){
					console.log("copied " + filename + " for " + files[idx]);
					copy_file_for_students_who_didnt_submit(idx+1, files, filename, cb);
				});
			}

			
		});
	}
}
 
fs.copy = function (src, dst, cb) {
  function copy(err) {
    var is
      , os
      ;

    if (!err) {
      return cb(new Error("File " + dst + " exists."));
    }

    fs.stat(src, function (err) {
      if (err) {
        return cb(err);
      }
      is = fs.createReadStream(src);
      os = fs.createWriteStream(dst);
      util.pump(is, os, cb);
    });
  }

  fs.stat(dst, copy);
}

fs.move = function (src, dst, cb) {
  function copyIfFailed(err) {
    if (!err) {
      return cb(null);
    }
    fs.copy(src, dst, function(err) {
      if (!err) {
        // TODO 
        // should we revert the copy if the unlink fails?
        fs.unlink(src, cb);
      } else {
        cb(err);
      }
    });
  }
}