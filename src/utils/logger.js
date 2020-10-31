const info = (message) => {
    console.info(message);
}

const error = (message) => {
    console.error(message);
}

const debug = (message) => {
    console.debug(message);
}

module.exports = {
    info,
    debug,
    error
};