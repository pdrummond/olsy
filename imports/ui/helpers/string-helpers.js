
/**
 For a given string, returns true if the string is null or if its length
 is 0 after being trimmed.
 */
export function isEmpty(str) {
    var empty = (str == null);
    if(!empty) {
        empty = str.trim().length == 0;
    }
    return empty;
}

/**
 For a given string, returns false if the string is null or if its length
 is 0 after being trimmed.
 */
export function notEmpty(str) {
    return !isEmpty(str);
}
