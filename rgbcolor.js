// convert RGB color data to hex
function rgb2hex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
 
// convert RGBA color data to hex
function rgba2hex(r, g, b, a) {
    if (r > 255 || g > 255 || b > 255 || a > 255)
        throw "Invalid color component";
    return ((r << 32) | (g << 16) | (b << 8) | a).toString(16);
}

console.log(rgb2hex(0,128,0));