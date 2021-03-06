/*! @name @videojs-ad-markers/videojs-ad-markers @version 2.0.0 @license MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
  typeof define === 'function' && define.amd ? define(['video.js'], factory) :
  (global = global || self, global.videojsAdMarkers = factory(global.videojs));
}(this, function (videojs) { 'use strict';

  videojs = videojs && videojs.hasOwnProperty('default') ? videojs['default'] : videojs;

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  var version = "2.0.0";

  var Plugin = videojs.getPlugin('plugin');
  /**
   * An advanced Video.js plugin. For more information on the API
   *
   * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
   */

  var AdMarkers =
  /*#__PURE__*/
  function (_Plugin) {
    _inheritsLoose(AdMarkers, _Plugin);

    /**
     * Create a AdMarkers plugin instance.
     *
     * @param  {Player} player
     *         A Video.js Player instance.
     */
    function AdMarkers(player) {
      var _this;

      // the parent class will add player under this.player
      _this = _Plugin.call(this, player) || this;
      _this.options = {};
      _this.markersMap = {};
      _this.markersList = [];
      _this.isInitialized = false;

      _this.player.ready(function () {
        _this.player.addClass('vjs-ad-markers');
      });

      return _this;
    }

    var _proto = AdMarkers.prototype;

    _proto.setMarkers = function setMarkers(options) {
      this.options = videojs.mergeOptions(this.options, options);
      this.markersMap = {};
      this.markersList = [];
      this.isInitialized = false;
      this.initialize();
    };

    _proto.generateUUID = function generateUUID() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
      });
      return uuid;
    };

    _proto.stylizeMarker = function stylizeMarker(jMarkerDiv, position) {
      jMarkerDiv.style.left = position + '%';
    };

    _proto.getMarkerTime = function getMarkerTime(marker) {
      return marker.time;
    };

    _proto.sortMarkersList = function sortMarkersList() {
      var _this2 = this;

      // sort the list by time in asc order
      this.markersList.sort(function (a, b) {
        return _this2.getMarkerTime(a) - _this2.getMarkerTime(b);
      });
    };

    _proto.addMarkers = function addMarkers(newMarkers) {
      var _this3 = this;

      if (!newMarkers || newMarkers.length === 0) {
        return;
      } // create the adMarkers


      newMarkers.forEach(function (marker, index) {
        marker.key = _this3.generateUUID();

        _this3.player.$('.vjs-progress-control').appendChild(_this3.createMarkerDiv(marker)); // store marker in an internal hash map


        _this3.markersMap[marker.key] = marker;

        _this3.markersList.push(marker);
      });
      this.sortMarkersList();
    };

    _proto.getPosition = function getPosition(marker) {
      return this.getMarkerTime(marker) / this.player.duration() * 100;
    };

    _proto.createMarkerDiv = function createMarkerDiv(marker) {
      /* eslint-disable no-undef */
      var markerDiv = document.createElement('div');
      markerDiv.className += 'vjs-admarker';

      if (marker.loader !== false) {
        markerDiv.className += ' vjs-admarker-announcer';
      } // stylize (and position) the marker


      this.stylizeMarker(markerDiv, this.getPosition(marker));
      markerDiv.dataset.markerKey = marker.key;
      markerDiv.dataset.markerTime = this.getMarkerTime(marker);
      return markerDiv;
    };

    _proto.removeAll = function removeAll() {
      var indexArray = [];

      for (var i = 0; i < this.markersList.length; i++) {
        indexArray.push(i);
      }

      this.removeMarkers(indexArray);
      this.isInitialized = false;
    };

    _proto.removeMarkers = function removeMarkers(indexArray) {
      for (var i = 0; i < indexArray.length; i++) {
        var index = indexArray[i];
        var marker = this.markersList[index];

        if (marker) {
          // delete from memory
          delete this.markersMap[marker.key];
          this.markersList[index] = null; // delete from dom

          this.player.$(".vjs-admarker[data-marker-key='" + marker.key + "']").remove();
        }
      } // clean up array


      for (var _i = this.markersList.length - 1; _i >= 0; _i--) {
        if (this.markersList[_i] === null) {
          this.markersList.splice(_i, 1);
        }
      } // sort again


      this.sortMarkersList();
    };

    _proto.initialize = function initialize() {
      if (this.isInitialized === false) {
        this.isInitialized = true;
        this.addMarkers(this.options.markers);
      }
    };

    return AdMarkers;
  }(Plugin); // Define default values for the plugin's `state` object here.


  AdMarkers.defaultState = {}; // Include the version number.

  AdMarkers.VERSION = version; // Register the plugin with video.js.

  videojs.registerPlugin('adMarkers', AdMarkers);

  return AdMarkers;

}));
