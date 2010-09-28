var detectBrowserType = exports.detectBrowserType = function (options) {

    var opts = merge({

        'order': ['tablet', 'touch', 'mobile', 'desktop'],
        'default': 'unknown',

        'tablet': {
            'user-agent': new RegExp('ipad', 'i')
        },

        'touch': {
            'user-agent': new RegExp('iphone|android', 'i')
        },

        'mobile': {
            'order':['x-wap-profile', 'profile', 'accept', 'user-agent'],
            'x-wap-profile': new RegExp('.+'),
            'profile': new RegExp('.+'),
            'accept': new RegExp('wap', 'i'),
            'user-agent': new RegExp('^(' + [
                'w3c ', 'w3c-', 'acs-', 'alav', 'alca', 'amoi', 'audi', 'avan', 'benq', 'bird', 'blac',
                'blaz', 'brew', 'cell', 'cldc', 'cmd-', 'dang', 'doco', 'eric', 'hipt', 'htc_', 'inno',
                'ipaq', 'ipod', 'jigs', 'kddi', 'keji', 'leno', 'lg-c', 'lg-d', 'lg-g', 'lge-', 'lg/u',
                'maui', 'maxo', 'midp', 'mits', 'mmef', 'mobi', 'mot-', 'moto', 'mwbp', 'nec-', 'newt',
                'noki', 'palm', 'pana', 'pant', 'phil', 'play', 'port', 'prox', 'qwap', 'sage', 'sams',
                'sany', 'sch-', 'sec-', 'send', 'seri', 'sgh-', 'shar', 'sie-', 'siem', 'smal', 'smar',
                'sony', 'sph-', 'symb', 't-mo', 'teli', 'tim-', 'tosh', 'tsm-', 'upg1', 'upsi', 'vk-v',
                'voda', 'wap-', 'wapa', 'wapi', 'wapp', 'wapr', 'webc', 'winw', 'winw', 'xda ', 'xda-'
            ].join('|') + ')|(' + [
                'android', 'hiptop', 'ipod', 'lge vx', 'midp', 'mmp', 'netfront', 'palm', 'psp',
                'openweb', 'opera mobi', 'opera mini', 'phone', 'smartphone', 'symbian', 'up.browser',
                'up.link', 'wap', 'windows ce'
            ].join('|') + ')' , 'i')
        },

        'desktop': function () {
            return true;
        }

    }, options);


    return function(request, response, next) {

        var userAgent = getHeader(request, 'user-agent'); //oft-used
        var browserType = opts['default'];

        for (var t in opts['order']) {
            var type = opts['order'][t];
            var options = opts[type];
            if (options && (
                typeof(options)==='function' && options(request, userAgent))
                ||
                detect(request, userAgent, options)
            ) {
                browserType = type;
                break;
            }
        }
        
        request.monomi = {
            'browserType' : browserType
        };
        
        next();

    }
}


function detect(request, userAgent, options) {

    var opts = merge({
        'order':['user-agent']
    }, options);

    for (var h in opts['order']) {
        var header = opts['order'][h].toLowerCase();
        if (opts[header]) {
            var value = (header==='user-agent') ? userAgent : getHeader(request, header);
            if (value.match(opts[header])!=null) {
                return true;
            }
        }
    }

    return false;
}


var getHeader = exports.getHeader = function(request, header, tryPrefix, defaultValue) {

    tryPrefix = typeof(tryPrefix) != 'undefined' ? tryPrefix : 'x-device-';

    var value = request.headers[tryPrefix + header];
    if (value) { return value; }

    value = request.headers[header];
    if (value) { return value; }

    return typeof(defaultValue) != 'undefined' ? defaultValue : '';
}


function merge() {
    var merged = {};
    for (a in arguments) {
        for (f in arguments[a]) {
            merged[f] = arguments[a][f];
        }
    }
    return merged;
};