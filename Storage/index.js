'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Storage = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by tycho on 14/02/2017.
 */
var Storage = exports.Storage = (_temp = _class = function Storage() {
  (0, _classCallCheck3.default)(this, Storage);
}, _class.get = function (storageType, name) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (storageType === 'cookie') {
    if (global.hasOwnProperty('cookie')) {
      return global.cookie.get(name, options);
    }
  }

  if (Storage.supportsStorage() && window.hasOwnProperty(storageType + 'Storage')) {
    return window[storageType + 'Storage'][name];
  }

  return null;
}, _class.set = function (storageType, name, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (storageType === 'cookie') {
    if (global.hasOwnProperty('cookie')) {
      return global.cookie.set(name, value, options);
    }
  }

  if (Storage.supportsStorage() && window.hasOwnProperty(storageType + 'Storage')) {
    window[storageType + 'Storage'][name] = (0, _stringify2.default)(value);
  }
}, _class.supportsStorage = function () {
  return typeof Storage !== 'undefined';
}, _temp);
exports.default = Storage;