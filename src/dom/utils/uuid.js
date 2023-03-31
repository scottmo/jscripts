$.uuid = function(length) {
    const prefix = "u";
    const uuidv4 = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
    if (length) {
        return prefix + uuidv4.substring(0, length);
    }
    return prefix + uuidv4;
}

$._guid = 0;
$.guid = function() {
    return $._guid++;
}
