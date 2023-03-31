$.component = function({ host, api = {}, css = {}, html, created } = {}) {
    const cmp = $(html);
    const element = cmp.first();
    for (const [key, value] of Object.entries(css)) {
        if (cmp.hasClass(key.substring(1))) {
            cmp.css(value);
        }
        cmp.find(key).css(value);
    }
    Object.assign(element, api);
    if (typeof created === "function") {
        created.call(element);
    }
    if (host) {
        $(host).append(cmp);
    }
    return cmp;
};
