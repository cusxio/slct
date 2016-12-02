/* eslint no-irregular-whitespace: off */

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
            const method = dom[query[0]];
            query = query.substring(1);

            let ret = document[method](query);

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
            ret = [].map.call(ret, (x) => x);

            return ret;
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
     * @return {Node}               Array with a custom `do` function that
     *                              accepts a callback.
     */
    return (query, recache) => {
        if (recache) {
            delete cache[query];
            cache[query] = select(query);
            return cache[query];
        }

        if (cache[query]) {
            return cache[query];
        }
        cache[query] = select(query);
        return cache[query];
    };
};

export default slct();
