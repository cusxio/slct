const slct = () => {
    /**
     * Cache Object
     * @type {Object}
     */
    const cache = {};

    /**
     * DOM Methods
     * @type {Object}
     */
    const dom = {
        '.': 'getElementsByClassName',
        '#': 'getElementById',
        '%': 'getElementsByTagName',
        '@': 'getElementsByName',
        '?': 'querySelector',
        '*': 'querySelectorAll',
    };

    const select = (query) => {
        try {
            const ret = document[dom[query[0]]](query.substring(1));

            if (ret instanceof Node) {
                return ret;
            }

            if (ret === null) {
                return [];
            }

            /**
             * Only Chrome 51 supports Array-like NodeList.
             * https://www.chromestatus.com/feature/5750902036103168
             *
             * Therefore, the following is needed to convert
             * NodeList into Array-like.
             */
            return [].map.call(ret, (x) => x);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                if (e.name === 'TypeError') {
                    console.error('Are you using a right identifier? Refer to https://github.com/cusxio/slct for more information.');
                }
            }

            throw e;
        }
    };

    /**
     * Select
     * @param  {String} query       Any string selector accetable by
     *                              `document.getElementById` or
     *                              `document.querySelectorAll`.
     * @param  {Boolean} recache    Invalide Cache, and Re-cache
     * @return {Node}
     */
    return (query, recache) => {
        if (recache) {
            delete cache[query];
            return (cache[query] = select(query));
        }

        if (cache[query]) {
            return cache[query];
        }
        return (cache[query] = select(query));
    };
};

export default slct();
