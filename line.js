// Returns coordinates of pixels between two coordinates (draws a line)
function calcLine(x0, y0, x1, y1, f) {
	let coords = [];
    let ix = x0 < x1 ? 1 : -1, dx = Math.abs(x1 - x0);
    let iy = y0 < y1 ? 1 : -1, dy = Math.abs(y1 - y0);
    let m = Math.max(dx, dy), cx = m >> 1, cy = m >> 1;

    for (var i=0; i<m; i++) {
        coords.push([x0, y0]);
        if ((cx += dx) >= m) { cx -= m; x0 += ix; }
        if ((cy += dy) >= m) { cy -= m; y0 += iy; }
    }

	return coords;
}

console.log(calcLine(-2,0,0,10));