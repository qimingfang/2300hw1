/**
 * Test Harness for info2300 HW1
 * Qiming Fang (qf26)
 *
 * February 18, 2013
 */

var arguments = process.argv.splice(2);
if (arguments.length < 2){
  console.log("Format node test.js [test url] [browser_id]");
  process.exit(1);
}

var webdriver = require('wd');
var assert = require('assert');

var test_url = arguments[0]; 
var browser, version;
var response = [];  // this is where the test results will be kept
var test_id = 1;        // tests start with id = 1

var expected_fonts = ["courier,monospace", "times new roman,serif", "arial,sans-serif"];
var minus_points = 0;
var caps;

switch (arguments[1]){
  case "firefox":
    caps = {browserName: "firefox"};
    caps.version = "9";
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

caps.platform = 'Mac 10.6';

var browser = webdriver.remote(
  "ondemand.saucelabs.com"
  , 80
  , "qimingfang"
  , "9f13b601-9374-4764-8a39-c4074be2956b"
);

browser.on('status', function(info){
  console.log('\x1b[36m%s\x1b[0m', info);
});

browser.on('command', function(meth, path){
  console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
});

/** 
 * Main Test. Runs through tests in order:
 * test_color
 * test_font_family
 * test_text_decoration
 * test_replace
 */
browser.init(caps, function() {
  browser.get(test_url, function() {
    test_color(function(){
      test_font_family(function(){
        test_font_size(function(){
            test_text_decoration(function(){
              test_replace(function(){
                response.push({test: test_id++, msg: 
                    "Tests Completed: Total Score: "+(100-minus_points) });
                browser.quit();
                console.log(response);
              });
            });
          });
        });
    });
  });
});

/**
 * Test of replace functionality:
 * Replace text 'Lorem' with text 'Qiming' 
 * Verify that 'Qiming' exists once and is highlighted
 */
var test_replace = function(cb){
    var loss_amount = 10;
  insert_text_into_input_box("original", "Lorem", function(){
    insert_text_into_input_box("newtext", "Qiming", function(){
      click_button("//input[@name='save' and @value='Replace']", function(){
        browser.elementsByClassName("matched", function(err, elems){
            try{
                assert.equal(elems.length, 1, "After replacing Lorem with Qiming, there should be 1 match. Found "
                + elems.length + " matches");
            } 
            catch(err) {
                minus_points = minus_points + loss_amount;
                response.push({test: test_id++, msg: 
                    "Text Replace did not work. "
                    + " Grade deduction " + loss_amount + " points"});
            } 
            finally {
                cb();
            }     
        });
      });
    });
  });
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
 * Tests that the text-decoration checkboxes do as they claim
 */
var test_text_decoration = function(cb){
    var loss_val = new Array(3,3,4,4);
    test_font_weight(loss_val[0],false, function(){        
        test_italic(loss_val[1], false, function(){
            click_button("//input[@value='bold']", function(){
                test_font_weight(loss_val[2],true, function(){
                    click_button("//input[@value='italic']", function(){
                        test_italic(loss_val[3],true, cb);
                    })
                })
            })
        })
    })
}

/**
 * Tests whether #text become bold when @expected, and
 * when it remains non-bold when !@expected
 */
var test_font_weight = function(loss_amount,expected, cb){
    browser.elementById("text", function(err, el){
        el.getComputedCss("font-weight", function(err, fw){
            try{
                assert.equal(fw, expected?"700":"400");
                response.push({test: test_id++, msg: "passed"});
            } catch (err){
                minus_points = minus_points + loss_amount;
                response.push({test: test_id++, msg: 
                    (expected?"Text should have been bolded but was not ("+fw+")"
                        :"Text should not have been bolded was was")
                    + " grade deduction " + loss_amount + " points"
                });
            } finally{
                cb();
            }
        });
    });
}

/**
 * Tests whether #text become italic when @expected, and
 * when it remains non-italic when !@expected
 */
var test_italic = function(loss_amount,expected, cb){
    browser.elementById("text", function(err, el){
        el.getComputedCss("font-style", function(err, fw){
            try{
                assert.equal(fw, expected?"italic":"normal");
                response.push({test: test_id++, msg: "passed"});
            } catch (err){
                minus_points = minus_points + loss_amount;
                response.push({test: test_id++, msg: 
                    (expected?"Text should have been italic but was not ("+fw+")"
                        :"Text should not have been italic was was")
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
    var loss_val = new Array(2,3);
    browser.elementById("text", function(err, el){
        el.getComputedCss("font-family", function(err, ff){
            try {
                assert.equal(ff, '"Comic Sans MS"');
                response.push({test: test_id++, msg: "passed"});
            } catch(err){
                minus_points = minus_points + loss_val[0];
                response.push({test: test_id++, msg: "Text should have started "
                    + "with font family Comic Sans MS, but instead was " + ff
                    + " grade deduction " + loss_val[0] + " points"
                });
            } finally {
                browser.elementsByXPath("//input[@name='family']", function(err, elems){
                    recursively_test_all_font_options(loss_val[1],elems, 0, cb);
                });
            }
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
        browser.elementById("text", function(err, el){
            el.getComputedCss("font-family", function(err, ff){
                try{
                    assert.equal(ff, expected_fonts[index]);
                    response.push({test: test_id++, msg: "passed"});
                } catch (err){
                    minus_points = minus_points + loss_val;
                    response.push({test: test_id++, msg: 
                        "Expected font-family to be " + expected_fonts[index]
                        + " but font-family was actually " + ff
                        + " grade deduction " + loss_val + " points"
                    });
                } finally{
                    recursively_test_all_font_options(loss_val,elems, index+1, cb);
                }
            });
        });
    });
}

/**
 * Tests to make sure that the font-size box does what it is supposed
 * to do (in that it handles errors correctly as well)
 */
var test_font_size = function(cb){
    var loss_val = new Array(2,3,4);
    clear_textbox(function(){
        insert_text_into_input_box_by_xpath("//input[@name='font']", "45", function(){
            browser.elementById("text", function(err, el){
                el.getComputedCss("font-size", function(err, fsize){
                    try{
                        assert.equal(fsize, "45px");
                        response.push({test: test_id++, msg: "passed"});
                    } catch (err){
                        minus_points = minus_points + loss_val[0];
                        response.push({test: test_id++, msg: 
                            "Expected font-size to be 45, but font-size was " + fsize
                            + " grade deduction " + loss_val[0] + " points"
                        });
                    } finally{
                        test_font_size_error_exists(loss_val[1],"45", false, function(){
                            test_font_size_cornercases(loss_val[2],cb);
                        })
                    }


                });
            });
        });
    });
}

/**
 * Presses backspace 3 times to remove any content in the input box
 */
var clear_textbox = function(cb){
    insert_text_into_input_box_by_xpath("//input[@name='font']", "\uE003\uE003\uE003", cb);
}

/**
 * Insert text of size 100 and 4
 * Expect error messages to trigger
 */
var test_font_size_cornercases = function(loss_amount, cb){
    clear_textbox(function(){
        insert_text_into_input_box_by_xpath("//input[@name='font']", "100", function(){
            test_font_size_error_exists(loss_amount, "100", true, function(){
                clear_textbox(function(){
                    insert_text_into_input_box_by_xpath("//input[@name='font']", "4", function(){
                        test_font_size_error_exists(loss_amount, "4", true, cb);
                    });
                });
            });
        });
    });
}

/**
 * if @expected then we expect an error message at #sizeWarning
 * else, we expect no error message
 */
var test_font_size_error_exists = function(loss_amount,num_chars, expected, cb){
    browser.elementById("sizeWarning", function(err, el){
        browser.text(el, function(err, txt){
            if (expected){
                if (txt.length == 0){
                    minus_points = minus_points + loss_amount;
                    response.push({test: test_id++, msg: 
                        num_chars + " into font-size should have generated error"
                        + " grade deduction " + loss_amount + " points"
                    });
                } else {
                    response.push({test: test_id++, msg: "passed"});
                }
            } else {
                if (txt.length == 0){
                    response.push({test: test_id++, msg: "passed"});
                } else {
                    minus_points = minus_points + loss_amount;
                    response.push({test: test_id++, msg: 
                        num_chars + " into font-size should not have generated error"
                        + " grade deduction " + loss_amount + " points"
                    });
                }
            }

            cb();
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
    var loss_val = new Array(2,5,5);
    // initially text should be green
    assert_color(loss_val[0],"text", "#008000", function() {

      // click on the red radio button
      test_color_radio(loss_val[1],"//div[@id='color']/input[@value='Red']", "#ff0000", function(){

        // click on the blue radio button
        test_color_radio(loss_val[2],"//div[@id='color']/input[@value='Blue']", "#0000ff", function(){

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
      assert_color(loss_amount, "text", expected, cb);
    });
  });
}

/**
 * Given DOM element id @elem_id, and expected color,
 * verifies that the DOM element has that color
 */
var assert_color = function(loss_amount, elem_id, expected, cb){
  browser.elementById(elem_id, function(err, el){
    el.getComputedCss("color", function(err, c){
        var actual_color = new RGBColor(c).toHex();
        try {
            assert.equal(actual_color, expected);
            response.push({test: test_id++, msg: "passed"});
        } catch (err){
            minus_points = minus_points + loss_amount;
            response.push({test: test_id++, msg:
                "Color should be " 
                + expected 
                + " but is actually " + actual_color
                + " grade deduction " + loss_amount + " points"
            });
        } finally{
            cb();
        }
    });
  });
}

/**
 * A color manipulation class
 * The student can represent the color of red as "#ff0000", 
 * 'red' or rgb(255,0,0). This class is here to translate the colors
 * from one color to another.
 *
 * Credits: http://www.phpied.com/files/rgbcolor/rgbcolor.js
 */
function RGBColor(color_string) {
    this.ok = false;

    // strip any leading #
    if (color_string.charAt(0) == '#') { // remove # if any
        color_string = color_string.substr(1,6);
    }

    color_string = color_string.replace(/ /g,'');
    color_string = color_string.toLowerCase();

    // before getting into regexps, try simple matches
    // and overwrite the input
    var simple_colors = {
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '00ffff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000000',
        blanchedalmond: 'ffebcd',
        blue: '0000ff',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '00ffff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgreen: '006400',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dodgerblue: '1e90ff',
        feldspar: 'd19275',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'ff00ff',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred : 'cd5c5c',
        indigo : '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgrey: 'd3d3d3',
        lightgreen: '90ee90',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslateblue: '8470ff',
        lightslategray: '778899',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '00ff00',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'ff00ff',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370d8',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'd87093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        red: 'ff0000',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        thistle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        violetred: 'd02090',
        wheat: 'f5deb3',
        white: 'ffffff',
        whitesmoke: 'f5f5f5',
        yellow: 'ffff00',
        yellowgreen: '9acd32'
    };
    for (var key in simple_colors) {
        if (color_string == key) {
            color_string = simple_colors[key];
        }
    }
    // emd of simple type-in colors

    // array of color definition objects
    var color_defs = [
        {
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3])
                ];
            }
        },
        {
            re: /^(\w{2})(\w{2})(\w{2})$/,
            example: ['#00ff00', '336699'],
            process: function (bits){
                return [
                    parseInt(bits[1], 16),
                    parseInt(bits[2], 16),
                    parseInt(bits[3], 16)
                ];
            }
        },
        {
            re: /^(\w{1})(\w{1})(\w{1})$/,
            example: ['#fb0', 'f0f'],
            process: function (bits){
                return [
                    parseInt(bits[1] + bits[1], 16),
                    parseInt(bits[2] + bits[2], 16),
                    parseInt(bits[3] + bits[3], 16)
                ];
            }
        }
    ];

    // search through the definitions to find a match
    for (var i = 0; i < color_defs.length; i++) {
        var re = color_defs[i].re;
        var processor = color_defs[i].process;
        var bits = re.exec(color_string);
        if (bits) {
            channels = processor(bits);
            this.r = channels[0];
            this.g = channels[1];
            this.b = channels[2];
            this.ok = true;
        }

    }

    // validate/cleanup values
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);

    // some getters
    this.toRGB = function () {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    }
    this.toHex = function () {
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r.length == 1) r = '0' + r;
        if (g.length == 1) g = '0' + g;
        if (b.length == 1) b = '0' + b;
        return '#' + r + g + b;
    }

    // help
    this.getHelpXML = function () {

        var examples = new Array();
        // add regexps
        for (var i = 0; i < color_defs.length; i++) {
            var example = color_defs[i].example;
            for (var j = 0; j < example.length; j++) {
                examples[examples.length] = example[j];
            }
        }
        // add type-in colors
        for (var sc in simple_colors) {
            examples[examples.length] = sc;
        }

        var xml = document.createElement('ul');
        xml.setAttribute('id', 'rgbcolor-examples');
        for (var i = 0; i < examples.length; i++) {
            try {
                var list_item = document.createElement('li');
                var list_color = new RGBColor(examples[i]);
                var example_div = document.createElement('div');
                example_div.style.cssText =
                        'margin: 3px; '
                        + 'border: 1px solid black; '
                        + 'background:' + list_color.toHex() + '; '
                        + 'color:' + list_color.toHex()
                ;
                example_div.appendChild(document.createTextNode('test'));
                var list_item_value = document.createTextNode(
                    ' ' + examples[i] + ' -> ' + list_color.toRGB() + ' -> ' + list_color.toHex()
                );
                list_item.appendChild(example_div);
                list_item.appendChild(list_item_value);
                xml.appendChild(list_item);

            } catch(e){}
        }
        return xml;

    }
}