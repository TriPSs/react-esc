'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CookieStorage = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class, _temp, _initialiseProps;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by tycho on 14/02/2017.
 */
var CookieStorage = exports.CookieStorage = (_temp = _class = function CookieStorage(cookies) {
  var isString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  (0, _classCallCheck3.default)(this, CookieStorage);

  _initialiseProps.call(this);

  if (!isString) {
    this.cookies = cookies;
    this.isString = isString;
  } else {
    this.cookies = this.parseCookieString(cookies);
  }
}, _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.cookies = null;
  this.isString = false;
  this.defaultOptions = {
    path: '/',
    secure: true,
    httpOnly: false,
    domain: null,
    expires: null
  };

  this.get = function (name, options) {
    if (!_this.isString) {
      _this.cookies.get(name, options);
    } else {
      return _this.cookies[name];
    }
  };

  this.set = function (name, value) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!_this.isString) {
      _this.cookies.set(name, value, (0, _extends3.default)({}, _this.defaultOptions, options));
    } else if (typeof document !== 'undefined') {
      var _options = (0, _extends3.default)({}, _this.defaultOptions, _options);
      var cookie = name + '=' + value;

      if (_options.path) cookie += '; path=' + _this.path;

      if (_options.expires) cookie += '; expires=' + _this.expires.toUTCString();

      if (_options.domain) cookie += '; domain=' + _this.domain;

      if (_options.secure) cookie += '; secure';

      if (_options.httpOnly) cookie += '; httponly';

      document.cookie = cookie;
    }
  };

  this.parseCookieString = function (cookieString) {
    var cookies = cookieString.split(';');

    var cookieObject = {};

    cookies.forEach(function (cookie) {
      var getNameValue = cookie.split('=');
      var name = getNameValue[0].trim();

      cookieObject[name] = getNameValue[1].trim();
    });

    return cookieObject;
  };
}, _temp);
exports.default = CookieStorage;