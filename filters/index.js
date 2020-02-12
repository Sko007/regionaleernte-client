import Vue from 'vue'
import moment from 'moment'
import { currency as currencyConfig } from '@/config'
Vue.filter('currency', function (value, currency, decimals) {
    const digitsRE = /(\d{3})(?=\d)/g
    value = parseFloat(value)
    if (!isFinite(value) || (!value && value !== 0)) return ''
    currency = currency != null ? currency : currencyConfig.symbol
    decimals = decimals != null ? decimals : 2
    let stringified = Math.abs(value).toFixed(decimals)
    let _int = decimals
        ? stringified.slice(0, -1 - decimals)
        : stringified
    let i = _int.length % 3
    let head = i > 0
        ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
        : ''
    let _float = decimals
        ? stringified.slice(-1 - decimals)
        : ''
    let sign = value < 0 ? '-' : ''
    return sign + currency + ' ' + head +
        _int.slice(i).replace(digitsRE, '$1,') +
        _float
})
Vue.filter('ago', function (time) {
    const between = Date.now() / 1000 - Number(time)
    if (between < 3600) {
        return ~~(between / 60) + ' minutes'
    } else if (between < 86400) {
        return ~~(between / 3600) + ' hours'
    } else {
        return ~~(between / 86400) + ' days'
    }
})
Vue.filter('titlecase', function (str) {
    if (str) {
        return str.replace(/\w\S*/g, function (txt) {
            let t
            if (txt) {
                t = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            } else {
                t = str;
            }
            return t
        }
        )
    }
})
Vue.filter('uppercase', function (str) {
    return str.toUpperCase();
})
Vue.filter('pluralize', function (noun) {
    if (typeof noun !== 'string') { return noun; }

    let rules = [
        { regex: /octopus/gi, suffix: 'octopusses' },
        { regex: /person/gi, suffix: 'people' },
        { regex: /ox/gi, suffix: 'oxen' },
        { regex: /bison|buffalo|deer|duck|fish|moose|pike|plankton|salmon|sheep|squid|swine|trout|sheap|equipment|information|rice|money|species|series|news/i, suffix: '$&' }, // bison -> bison
        { regex: /(x|ch|ss|sh)$/gi, suffix: '$1es' }, // dish -> dishes, kiss -> kisses
        { regex: /(hetero|canto|photo|zero|piano|pro|kimono|portico|quarto)$/gi, suffix: '$1s' }, // kimono -> kimonos
        { regex: /(?:([^f])fe|([lr])f)$/, suffix: '$1$2ves' }, // knife -> knives, calf -> calves
        { regex: /o$/gi, suffix: 'oes' }, // hero -> heroes
        { regex: /([^aeiouy]|qu)y$/gi, suffix: '$1ies' }, // cherry -> cherries
        { regex: /s$/gi, suffix: 's' }, // cats -> cats
        { regex: /$/gi, suffix: 's' } // cat -> cats
    ];

    for (let i = 0; i < rules.length; i++) {
        let rule = rules[i];
        if (noun.match(rule.regex)) {
            noun = noun.replace(rule.regex, rule.suffix);
            break;
        }
    }

    return noun;
})
Vue.filter('date', function (value) {
    const date = new Date(value)
    return date.toLocaleString(['en-US'], { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
})
Vue.filter('datedm', function (value) {
    return moment(value).format('ddd, Do MMM')
})
Vue.filter('time', function (value) {
    return moment(value).format('hA')
})
// Vue.filter('truncate', function (text, length, clamp) {
//     clamp = clamp || '...';
//     let node = document.createElement('div');
//     node.innerHTML = text;
//     let content = node.textContent;
//     return content.length > length ? content.slice(0, length) + clamp : content;
// })
Vue.filter('truncate', function (text, stop, clamp) {
    return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
})
Vue.filter('nl2br', function (text, stop, clamp) {
    return text.replace(/(?:\r\n|\r|\n)/g, '<br />')
})