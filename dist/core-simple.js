"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubtManager = void 0;
/**
 * Simple doubt management class that works without external dependencies
 */
var DoubtManager = /** @class */ (function () {
    function DoubtManager(config) {
        if (config === void 0) { config = {}; }
        this.doubts = [];
        this.listeners = [];
        this.config = config;
    }
    /**
     * Create a new doubt
     */
    DoubtManager.prototype.createDoubt = function (about, question, actorOverride) {
        var actor = actorOverride || this.config.defaultActor || { name: "unknown" };
        // Simple UUID fallback
        var generateId = function () { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }); };
        var doubt = {
            id: generateId(),
            about: about,
            question: question.trim(),
            making: {
                actor: {
                    name: actor.name,
                    sameAs: actor.sameAs || [],
                },
            },
        };
        this.doubts.push(doubt);
        this.notifyListeners();
        return doubt;
    };
    /**
     * Get all doubts about a specific resource
     */
    DoubtManager.prototype.getDoubtsAbout = function (id) {
        return this.doubts.filter(function (d) { return d.about === id; });
    };
    /**
     * Get all doubts
     */
    DoubtManager.prototype.getAllDoubts = function () {
        return __spreadArray([], this.doubts, true);
    };
    /**
     * Subscribe to doubt changes
     */
    DoubtManager.prototype.subscribe = function (listener) {
        var _this = this;
        this.listeners.push(listener);
        return function () {
            var index = _this.listeners.indexOf(listener);
            if (index > -1) {
                _this.listeners.splice(index, 1);
            }
        };
    };
    DoubtManager.prototype.notifyListeners = function () {
        var _this = this;
        this.listeners.forEach(function (listener) { return listener(__spreadArray([], _this.doubts, true)); });
    };
    return DoubtManager;
}());
exports.DoubtManager = DoubtManager;
