var Ory = (function () {
    var Service = function (config) {
        var that = this,
            defaults;

        defaults = {
            host: "api.ory.com",
            port: 443,
            protocol: "https",
            app: {
                token: "1234567890"
            }
        };

        this.config = $.extend({}, defaults, config);

        /**
         * Assembles an url from the instantiated parameters.
         *
         * @param path
         * @returns string
         */
        function assembleUrl(path) {
            // Remove leading slash from path
            path = path.replace(/^\//g, '');
            return that.config.protocol + '://' + that.config.host + ':' + that.config.port + '/' + path;
        }

        /**
         * Creates a post request
         *
         * @param path
         * @param data
         * @param options
         * @returns $.ajax
         */
        function post(path, data, options) {
            var url = assembleUrl(path),
                defaults = {
                    url: url,
                    method: 'POST',
                    headers: {
                        "App-Token": that.appToken
                    },
                    dataType: "json",
                    data: JSON.stringify(data)
                };

            options = $.extend({}, defaults, options);
            return $.ajax(options);
        }

        /**
         * Creates a get request
         *
         * @param path
         * @param options
         * @returns {*}
         */
        function get(path, options) {
            var url = assembleUrl(path),
                defaults = {
                    url: url,
                    method: 'GET',
                    headers: {
                        "App-Token": that.appToken
                    },
                    dataType: "json"
                };

            options = $.extend({}, defaults, options);
            return $.ajax(options);
        }

        /* ######################
         *
         * Translation Resource
         *
         * ######################
         */
        this.translation = function (locale) {
            var that = this;
            this.locale = locale;

            return {
                message: function (message, success, error) {
                    post('/translation/search?locale=' + that.locale, {message: message})
                        .success(success)
                        .fail(error);
                },
                id: function (id, success, error) {
                    get('/translation/' + id + '?locale=' + that.locale)
                        .success(success)
                        .error(error);
                }
            };
        };
    };

    return function (appToken, host) {
        return new Service(appToken, host);
    };
})();