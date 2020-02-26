

module.exports = class Utilities {
    constructor() {
    }


    /*
    Strip whitespace off of both ends of a string

    - FYI this can be accomplished as a one liner: str.trim()
    - if the browser doesnt support trim, a custom trim can be achieved using: str = str.replace(/^\s+|\s+$/gm,'')
    */
    strip(str) {
        var i, j;

        for (i=0; i<str.length && str[i] == " "; i++);
        for (j=str.length-1; i>=0 && str[j] == " "; j--);

        if (i < j)
            return str.substring(i, j+1);
        else  // the indexes passed eachother, so the whole thing must be blank spaces
            return "";
    }

    generateRange(min, max, step, precision=2) {
        let count = Math.ceil((max-min) / step) + 1; // + 1 to make inclusive/include endpoints
        return [...Array(count).keys()].map(value => {return ((value * step) + min).toFixed(precision)});
    }

    listToFilter(list) {
        let data = [""];

        list.forEach(value => {
            data.push(value);
        });

        return data;
    }

    array_content_equality(array1, array2) {
        if (array1.length != array2.length) {
            return false;
        }

        let set2 = new Set(array2);
        for (let i=0; i<array1.length; i++) {
            if (!set2.has(array1[i]))
                return false;
        }

        return true;
    }

    trim(string, length, extra="...") {
        if (string.length > length)
            return string.slice(0, length) + extra;
        else
            return string;
    }
}