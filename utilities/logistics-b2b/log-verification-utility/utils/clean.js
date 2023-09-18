const clean = (log) => {
    Object
        .entries(log)
        .forEach(([key, value]) => {
            if (value && typeof value === 'object') {
                clean(value);
            }
            if (value && typeof value === 'object' && !Object.keys(value).length || value === null || value === undefined) {
                if (Array.isArray(log)) {
                    log.splice(key, 1);
                } else {
                    delete log[key];
                }
            }
        });
    return log;
}

module.exports = clean