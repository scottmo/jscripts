function $(selectors) {
    if (typeof selectors === 'string') {
        selectors = [selectors];
    }
    if (Array.isArray(selectors)) {
        for (let sel of selectors) {
            const elm = document.querySelector(sel);
            if (elm) {
                return elm;
            }
        }
        return null;
    }
    if (selectors.nodeType === 1) {
        return selectors; // already an element;
    }
    return null;
}
