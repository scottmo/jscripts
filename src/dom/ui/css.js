$.css = function(node, styles) {
    node = $(node);

    let stylesStr;
    if (/^[\w-]+$/.test(styles)) {
        const cssProp = styles;
        return getComputedStyle(node).getPropertyValue(cssProp);
    }

    if (typeof styles === "string") {
        stylesStr = styles.split("\n").map(s => s.trim()).join("");
    } else {
        stylesStr = Object.keys(styles).reduce((acc, key) => (
            acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + styles[key] + ';'
        ), '');
    }

    const existingStyles = node.getAttribute("style");
    if (existingStyles) {
        stylesStr = existingStyles + ";" + stylesStr;
    }

    node.setAttribute("style", stylesStr);
}

$.injectCSS = function(css) {
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
}
