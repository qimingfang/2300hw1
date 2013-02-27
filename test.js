/**
 * Test Harness for info2300 HW1
 * Qiming Fang (qf26)
 *
 * February 18, 2013
 */

var arguments = process.argv.splice(2);
if (arguments.length < 3){
  console.log("Format node test.js [test url] [browser_id] [netid to start from]");
  process.exit(1);
}

var webdriver = require('wd');
var assert = require('assert');
var fs = require('fs');
var sleep = require('sleep');
var util = require('util');

var test_url = arguments[0];
var netid = arguments[2];

var browser, version;
var response = [];  // this is where the test results will be kept
var test_id = 1;        // tests start with id = 1

var minus_points = 0;
var caps;
var result_file = "results.csv";

switch (arguments[1]){
  case "firefox":
    caps = {browserName: "firefox"};
    caps.version = "12";
    break;
  case "ie":
    caps = {browserName: "internet explorer"};
    caps.version = "9";
    break;
  case "chrome":
    caps = {browserName: "chrome"};
    break;
  default:
    console.log("You need to provide {firefox | ie | chrome} for browser field. case sensitive");
    process.exit(1);
}

caps.platform = 'Windows 2008';
caps.public = "true";

var browser = webdriver.remote(
  "ondemand.saucelabs.com"
  , 80
  , "qimingfang"
  , "9f13b601-9374-4764-8a39-c4074be2956b"
);

browser.on('status', function(info){
  //console.log('\x1b[36m%s\x1b[0m', info);
});

browser.on('command', function(meth, path){
  //console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
});

/**
 * 1 point for initial font = comic sans
 * 2 points for each font family change
 */
var test_font_color_points = new Array (3, 4);

/**
 * 2 point that text should initially be unbold and unitalic
 * 4 points that text is bold and not italic when bold checked
 * 4 points that text is bold and italic when both checked
 * 2 point that text is bold and not italic when italic unchecked
 * 2 point that text is unbold and unitalic when both unchecked
 */
var test_decoration_points = new Array(2, 1, 3, 1, 1, 3, 1, 1, 1, 1);

/**
 * 1 point that font is initially 15
 * 4 points for handling font size = 1
 * 4 points for handling font size = 19 (no error)
 * 4 points for handling font size = 190
 */
var test_font_size_points = new Array(1, 4);

/**
 * 2 points for color initially green
 * 5 points for color = red when red radio clicked
 * 5 points for color = blue when blue radio clicked
 */
var test_color_points = new Array(3,6,6);

/**
 * 8 points for correct replace
 * 6 points for handling input with '<'
 * 6 points for handling input with '>'
 */
var replace_points = new Array(13, 12);

/**
 * Main Test. Runs through tests in order:
 * test_color
 * test_font_family
 * test_text_decoration
 * test_replace
 * test_bonus
 */

main_test(netid, function(){
})

function main_test(netid, cb){
    var path = test_url; // + "/2300_test/submissions/" + netid + "/index.php";
    caps.name = netid;
   // response.push({})

    browser.init(caps, function(err,sessionID) {
        response.push({ "To Watch Grading and Detailed Results visit": "https://saucelabs.com/tests/"+sessionID});
        browser.get(path, function() {
            test_color(function(){
                test_font_family(function(){
                    test_font_size(function(){
                        test_text_decoration(function(){
                            test_replace(function(){
                                test_save(15, function(){
                                    browser.quit(function(){
                                        var resp = JSON.stringify(response) + "\n";
                                        var to_write = netid + "," + (100-minus_points) + "," + resp;
    				                    console.log(to_write);
    				                    cb();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        })
    })
}

var test_save = function(bonus_amount, cb){
    click_button("//input[@name='savebutton']", function(){
        handle_alert(function(popup){
            sleep.sleep(3);

            browser.get(test_url, function(){
                browser.elementByXPath("//div[@id='text']/*[1]", function(err, el){
                    browser.text(el, function(err, txt){
                        if (txt.match(/Qiming/)){
                            response.push({test: test_id++, msg: "bonus passed"});
                            minus_points = minus_points - bonus_amount;
                        } else {
                            response.push({test: test_id++, msg: "Extra Credit: refreshed page"
                                        + " and didn't find 'Qiming' anywhere."});
                        }

                        cb();
                    })   
                })  
            })
        })         
    })
}

/**
 * Test of replace functionality:
 * Replace text 'Lorem' with text 'Qiming' 
 * Verify that 'Qiming' exists
 * Replace ipsum with "Qiming<qiming>"
 * Verify that '<' does not exist
 * Verify that '>' doesnt exist
 */
var test_replace = function(cb){
  var idx = 0;
  insert_into_replace_text_boxes("Lorem", "Qiming", true, replace_points[idx++], function(){
    lots_of_backspace(function(){
        insert_into_replace_text_boxes("ipsum", "<sam>lester</sam>", false, replace_points[idx++], function(){
            cb();
        })
    })
  })
}

var insert_into_replace_text_boxes = function(original, replace, replace_will_appear_in_text, loss_amount, cb){
  insert_text_into_input_box("original", original, function(){
    insert_text_into_input_box("newtext", replace, function(){
      click_button("//input[@name='save' and @value='Replace']", function(){
        handle_alert(function(alert_popped_up){
            if (replace_will_appear_in_text){
                browser.elementByXPath("//div[@id='text']/*[1]", function(err, el){
                    browser.text(el, function(err, txt){
                        if (txt.match(/Qiming/)){
                            response.push({test: test_id++, msg: "passed"});
                        } else {
                            response.push({test: test_id++, msg: "After replacing Lorem with Qiming, cannot "
                                        + "find 'Qiming' in text.  Text Replace did not work. "
                                        + " Grade deduction " + loss_amount + " points"});
                            minus_points = minus_points + loss_amount;
                        }

                        cb();
                    });
                });
            } else {
                browser.elementByXPath("//div[@id='text']/p/sam", function(err, el){
                    browser.text(el, function(err, txt){
                        if (txt.match(/^lester$/)){
                            response.push({test: test_id++, msg: "Replacing should not tolerate '<' "
                                    + "and '>' characters.  Text Replace did not work. "
                                    + " Grade deduction " + loss_amount + " points"});
                            minus_points = minus_points + loss_amount;
                        } else {
                            response.push({test: test_id++, msg: "passed"});
                        }

                        cb();
                    })
                })
            }
        })
      })
    })
  })
}

var lots_of_backspace = function(cb){
    insert_text_into_input_box_by_xpath("//input[@id='original']", "\uE003\uE003\uE003\uE003\uE003", cb);
}

/**
 * Inserts @text into DOM item denoted by @elem_id
 */
var insert_text_into_input_box = function(elem_id, text, cb){
  browser.elementById(elem_id, function(err, el){
    el.type(text, cb);
  });
}

var insert_text_into_input_box_by_xpath = function(xpath, text, cb){
    browser.elementByXPath(xpath, function(err, el){
        el.type(text, cb);
    });
}

/**
 * Clicks the button given by XPATH @elem_xpath
 */
var click_button = function(elem_xpath, cb){
  browser.elementByXPath(elem_xpath, function(err, el){
    browser.clickElement(el, cb);
  });
}

/**
 * Presses backspace 3 times to remove any content in the input box
 */
var backspace = function(cb){
    insert_text_into_input_box_by_xpath("//input[@name='font']", "\uE003", cb);
}

var handle_alert = function(cb){
    browser.alertText(function(err, txt){
        if (txt != undefined){
            browser.acceptAlert(function(err){
                cb(true);
            })
        } else {
            cb(false);
        }
    })
}

var expect_alert = function(cb){
    handle_alert(function(has_popup){
        click_button("//input[@value='Red']", function(){
            handle_alert(function(has_popup_after_click_away){
                cb(has_popup || has_popup_after_click_away);
            })
        })
    })
}

/**
 * Tests that the text-decoration checkboxes do as they claim
 */
var test_text_decoration = function(cb){
    var ctr = 0;
    var loss_val = test_decoration_points;

    test_bold_italic(loss_val, ctr, false, false, function(){
        click_button("//input[@value='bold']", function(){
            test_bold_italic(loss_val, ctr, true, false, function(){
                click_button("//input[@value='italic']", function(){
                    test_bold_italic(loss_val, ctr, true, true, function(){
                        click_button("//input[@value='italic']", function(){
                            test_bold_italic(loss_val, ctr, true, false, function(){
                                click_button("//input[@value='bold']", function(){
                                    test_bold_italic(loss_val, ctr, false, false, cb);
                                })
                            })
                        })
                    })
                })
            })
        })
    })  
}

function test_bold_italic(loss_val, ctr, bold_expected, italic_expected, cb){
    test_font_weight(loss_val[ctr++], bold_expected, function(){
        test_italic(loss_val[ctr++], italic_expected, cb);
    })
}

/**
 * Tests whether #text become bold when @expected, and
 * when it remains non-bold when !@expected
 */
var test_font_weight = function(loss_amount, expected, cb){
    browser.elementByXPath("//div[@id='text']/*[1]", function(err, el){
        el.getComputedCss("font-weight", function(err, fw){
            
            if (expected){
                if (fw == "700" || fw == "bold"){
                    response.push({test: test_id++, msg: "passed"});
                } else {
                    minus_points = minus_points + loss_amount;
                    response.push({test: test_id++, msg: 
                        "Text should have been bolded but was not (" + fw + ")."
                        + " grade deduction " + loss_amount + " points"
                    });
                }
            } else {
                if (fw == "400" || fw == "normal" || fw == ""){
                    response.push({test: test_id++, msg: "passed"});
                } else {
                    minus_points = minus_points + loss_amount;
                    response.push({test: test_id++, msg: 
                        "Text (" + fw + ") should not have been bolded."
                        + " grade deduction " + loss_amount + " points"});
                }
            }

            cb();
        });
    });
}

/**
 * Tests whether #text become italic when @expected, and
 * when it remains non-italic when !@expected
 */
var test_italic = function(loss_amount, expected, cb){
    browser.elementByXPath("//div[@id='text']/*[1]", function(err, el){
        el.getComputedCss("font-style", function(err, fw){
            try{
                assert.equal(fw, expected?"italic":"normal");
                response.push({test: test_id++, msg: "passed"});
            } catch (err){
                minus_points = minus_points + loss_amount;
                response.push({test: test_id++, msg: 
                    (expected?"Text should have been italic but was not ("+fw+")"
                        :"Text should not have been italic was.")
                    + " grade deduction " + loss_amount + " points"
                });
            } finally{
                cb();
            }
        });
    });
}

/**
 * Tests whether the font family radio buttons do as they claim
 */
var test_font_family = function(cb){
    var idx = 0;
    var loss_val = test_font_color_points;
    browser.elementByXPath("//div[@id='text']/*[1]", function(err, el){
        el.getComputedCss("font-family", function(err, ff){
            if (ff.match(/comic/i))
                response.push({test: test_id++, msg: "passed"});
            else {
                minus_points = minus_points + loss_val[0];
                response.push({test: test_id++, msg: "Text should have been "
                    + "Comic Sans MS initially, but instead was " + ff
                    + " grade deduction " + loss_val[0] + " points"
                });
            }
            browser.elementsByXPath("//input[@name='family']", function(err, elems){
                recursively_test_all_font_options(loss_val[1],elems, 0, cb);
            });
        });
    });
}

/**
 * For each element in @elems
 * apply test, and move on to the next.
 * The reason why this is recursive is because of javascript's nature of
 * nested callbacks 
 */
function recursively_test_all_font_options(loss_val,elems, index, cb){
    if (index == elems.length)
        return cb();

    browser.clickElement(elems[index], function(err, c){
        browser.elementByXPath("//div[@id='text']/*[1]", function(err, el){
            el.getComputedCss("font-family", function(err, ff){

                var matched = false;
                expected = "";

                switch (index){
                    case 0:
                        matched = ff.match(/courier/i);
                        expected = "courier";
                        break;
                    case 1:
                        matched = ff.match(/times/i);
                        expected = "times";
                        break
                    case 2:
                        matched = ff.match(/arial/i);
                        expected = "arial";
                        break;
                }

                if (matched){
                    response.push({test: test_id++, msg: "passed"});
                } else {
                    minus_points = minus_points + loss_val;
                    response.push({test: test_id++, msg: 
                        "Expected font-family to contain '" + expected
                        + "' but font-family was actually '" + ff
                        + "' grade deduction " + loss_val + " points"
                    });
                }
               
                recursively_test_all_font_options(loss_val,elems, index+1, cb);
            });
        });
    });
}

/**
 * Tests to make sure that the font-size box does what it is supposed
 * to do (in that it handles errors correctly as well)
 */
var test_font_size = function(cb){
    var idx = 0
    test_font_size_error_exists(test_font_size_points[idx++], "15", false, false, function(){
        test_font_size_cornercases(test_font_size_points[idx++], cb);
    })
}

/**
 * Insert text of size 100 and 4
 * Expect error messages to trigger
 */
var test_font_size_cornercases = function(loss_amount, cb){
    backspace(function(){
        expect_alert(function(alert_popup){
            test_font_size_error_exists(loss_amount, "1", true, alert_popup, function(){
                insert_text_into_input_box_by_xpath("//input[@name='font']", "9", function(){
                    expect_alert(function(alert_popup){
                        test_font_size_error_exists(loss_amount, "19", false, alert_popup, function(){
                            insert_text_into_input_box_by_xpath("//input[@name='font']", "0", function(){
                                expect_alert(function(alert_popup){
                                    test_font_size_error_exists(loss_amount, "190", true, alert_popup, cb);
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}

/**
 * if @expected then we expect an error message at #sizeWarning
 * else, we expect no error message
 */
var test_font_size_error_exists = function(loss_amount, num_chars, expected, popup, cb){
    browser.elementByXPath("//div[@id='text']/*[1]", function(err, el){
        el.getComputedCss("font-size", function(err, fsize_string){

            // size should sitll be between 8 and 80
            var fsize = parseInt(fsize_string.substring(0, fsize_string.length-2));
            if (fsize < 8 || fsize > 80){
                minus_points = minus_points + loss_amount;
                response.push({test: test_id++, msg: "After changing to " + num_chars + ", font-size should "
                    + "still be between 8 and 80 characters."
                    +" font-size error"
                                + " grade deduction " + loss_amount + " points"
                });
            }

            // if we're expecting something between 8 and 80, then verify
            if (parseInt(num_chars) >= 8 && parseInt(num_chars) <= 80){
                try{
                    assert.equal(fsize_string, num_chars + "px");
                    response.push({test: test_id++, msg: "passed"});
                } catch (err){
                    minus_points = minus_points + loss_amount
                    response.push({test: test_id++, msg: 
                        "Expected font-size to be " + num_chars + ", but font-size was " + fsize_string
                        + " grade deduction " + loss_amount + " points"
                    });
                }
            }


            browser.elementById("sizeWarning", function(err, el){
                browser.text(el, function(err, txt){
                    if (expected){
                        if (txt.length == 0 && !popup){
                            minus_points = minus_points + loss_amount;
                            response.push({test: test_id++, msg: "Entering " + 
                                num_chars + " into font-size should have generated error"
                                + " grade deduction " + loss_amount + " points"
                            });
                        } else {
                            response.push({test: test_id++, msg: "passed"});
                        }
                    } else {
                        if (txt.length == 0 && !popup){
                            response.push({test: test_id++, msg: "passed"});
                        } else {
                            minus_points = minus_points + loss_amount;
                            response.push({test: test_id++, msg: "Entering " +
                                num_chars + " into font-size should not have generated error"
                                + " grade deduction " + loss_amount + " points"
                            });
                        }
                    }
                    
                    cb();
                });
            });
        });
    });
}

/**
 * Test of color change functionality
 * First verify that text is green, then click on red radio button
 * and verify that color is red. Then click on blue radio button and
 * verify that color is blue
 */
var test_color = function(cb){
    var idx = 0;

    // initially text should be green
    assert_color(test_color_points[idx++], "#008000", function() {

      // click on the red radio button
      test_color_radio(test_color_points[idx++],"//div[@id='color']/input[@value='Red']", "#ff0000", function(){

        // click on the blue radio button
        test_color_radio(test_color_points[idx++],"//div[@id='color']/input[@value='Blue']", "#0000ff", function(){

          //execute callback
          cb();

        });
      });
    });
}

/**
 * Given button at XPATH @xpath, tests whether DOM element with id 'text'
 * changes to color @expected after the radio button is selected
 */
var test_color_radio = function(loss_amount, xpath, expected, cb){
  browser.elementByXPath(xpath, function(err, el){
    browser.clickElement(el, function(err, c){
      assert_color(loss_amount, expected, cb);
    });
  });
}

/**
 * Given DOM element id @elem_id, and expected color,
 * verifies that the DOM element has that color
 */
var assert_color = function(loss_amount, expected, cb){
  browser.elementByXPath("//div[@id='text']/*[1]", function(err, el){
    el.getComputedCss("color", function(err, c){
        var actual_rgba = parseColor(c);
        var expected_rgba = parseColor(expected);

        try {
            assert.equal(actual_rgba[0], expected_rgba[0]);
            assert.equal(actual_rgba[1], expected_rgba[1]);
            assert.equal(actual_rgba[2], expected_rgba[2]);
            response.push({test: test_id++, msg: "passed"});
        } catch (err){
            minus_points = minus_points + loss_amount;
            response.push({test: test_id++, msg:
                "Color should be rgb(" 
                + expected_rgba 
                + ") but is actually rgb(" + actual_rgba
                + ") grade deduction " + loss_amount + " points"
            });
        } finally{
            cb();
        }
    });
  });
}

var parseColor = function(color) {
 
    var cache
      , p = parseInt // Use p as a byte saving reference to parseInt
      , color = color.replace(/\s\s*/g,'') // Remove all spaces
    ;//var
    
    // Checks for 6 digit hex and converts string to integer
    if (cache = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(color)) 
        cache = [p(cache[1], 16), p(cache[2], 16), p(cache[3], 16)];
        
    // Checks for 3 digit hex and converts string to integer
    else if (cache = /^#([\da-fA-F])([\da-fA-F])([\da-fA-F])/.exec(color))
        cache = [p(cache[1], 16) * 17, p(cache[2], 16) * 17, p(cache[3], 16) * 17];
        
    // Checks for rgba and converts string to
    // integer/float using unary + operator to save bytes
    else if (cache = /^rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*.[\d]+)\)/.exec(color))
        cache = [+cache[1], +cache[2], +cache[3], +cache[4]];
        
    // Checks for rgb and converts string to
    // integer/float using unary + operator to save bytes
    else if (cache = /^rgb\(([\d]+),([\d]+),([\d]+)\)/.exec(color))
        cache = [+cache[1], +cache[2], +cache[3]];
        
    // Otherwise throw an exception to make debugging easier
    else throw Error(color + ' is not supported by $.parseColor');
    
    // Performs RGBA conversion by default
    isNaN(cache[3]) && (cache[3] = 1);
    
    // Adds or removes 4th value based on rgba support
    // Support is flipped twice to prevent erros if
    // it's not defined
    return cache.slice(0,3);
}
