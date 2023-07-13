/*properties
    appendChild, createDocument, createElement, dockOpen, hOffset, opacity,
    setAttribute, setDockItem, src, vOffset
*/

function buildVitality(bg, wkdy,hr, mn) {
	var d, v, dock_bg, dock_icon, u, t, w;

	if (!widget.dockOpen) { return; }

	d = XMLDOM.createDocument();
	v = d.createElement("dock-item");
	v.setAttribute("version", "1.0");
	d.appendChild(v);

	dock_bg = d.createElement("image");
	dock_bg.setAttribute("src", bg);
	dock_bg.setAttribute("hOffset", 0);
	dock_bg.setAttribute("vOffset", 0);
	v.appendChild(dock_bg);

	w = d.createElement("text");
	w.setAttribute("hOffset", "33");
	w.setAttribute("vOffset", "36");
	w.setAttribute("hAlign", "right");
	w.setAttribute("style", "text-align: right;font-family: 'times new roman'; font-stretch: condensed; font-size: 30px; color: #ffffff; -kon-shadow: 0px -1px rgba( 0, 0, 0, 0.7 )");
        w.setAttribute("data",  hr);
	v.appendChild(w);

	t = d.createElement("text");
	t.setAttribute("hOffset", "78");
	t.setAttribute("vOffset", "36");
	t.setAttribute("hAlign", "right");
	t.setAttribute("style", "text-align: right;font-family: 'times new roman'; font-stretch: condensed; font-size: 30px; color: #ffffff; -kon-shadow: 0px -1px rgba( 0, 0, 0, 0.7 )");
        t.setAttribute("data",  ":" + mn);
	v.appendChild(t);

	u = d.createElement("text");
	u.setAttribute("hOffset", "75");
	u.setAttribute("vOffset", "60");
	u.setAttribute("hAlign", "right");
	u.setAttribute("style", "text-align: right;font-family: 'times new roman'; font-stretch: condensed; font-size: 20px; color: #ffffff; -kon-shadow: 0px -1px rgba( 0, 0, 0, 0.7 )");
        u.setAttribute("data", wkdy);
	v.appendChild(u);

	widget.setDockItem(d, "fade");
}
