"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubtsUI = void 0;
var core_simple_1 = require("../core-simple");
/**
 * Framework-agnostic doubt UI that works with vanilla JavaScript
 */
var DoubtsUI = /** @class */ (function () {
    function DoubtsUI(container, about, config, onDoubtAdded) {
        var _this = this;
        this.container = container;
        this.about = about;
        this.manager = new core_simple_1.DoubtManager(config);
        this.onDoubtAdded = onDoubtAdded;
        // Subscribe to changes
        this.manager.subscribe(function () { return _this.render(); });
        // Initial render
        this.render();
    }
    DoubtsUI.prototype.render = function () {
        var _this = this;
        var doubts = this.manager.getDoubtsAbout(this.about);
        var hasDoubts = doubts.length > 0;
        this.container.innerHTML = "\n      <div style=\"margin: 8px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;\">\n        <div style=\"display: flex; align-items: center; margin-bottom: 8px;\">\n          <span style=\"font-weight: bold; color: ".concat(hasDoubts ? '#ff9800' : '#666', ";\">\n            \u2753 Doubts (").concat(doubts.length, ")\n          </span>\n          <button id=\"add-doubt-btn\" style=\"\n            margin-left: 8px; \n            padding: 4px 8px; \n            border: none; \n            border-radius: 4px;\n            background-color: #2196f3;\n            color: white;\n            cursor: pointer;\n          \">\n            Add Doubt\n          </button>\n        </div>\n\n        ").concat(doubts.length > 0 ? "\n          <div style=\"margin-bottom: 8px;\">\n            ".concat(doubts.map(function (doubt) {
            var _a;
            return "\n              <div style=\"\n                padding: 8px; \n                margin-bottom: 4px; \n                background-color: #f5f5f5; \n                border-radius: 4px;\n              \">\n                <div style=\"font-weight: bold;\">".concat(_this.escapeHtml(doubt.question), "</div>\n                <div style=\"font-size: 0.8em; color: #666;\">\n                  by ").concat(_this.escapeHtml(((_a = doubt.making.actor) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown'), "\n                </div>\n              </div>\n            ");
        }).join(''), "\n          </div>\n        ") : "\n          <div style=\"color: #666; font-style: italic;\">\n            No doubts raised yet.\n          </div>\n        ", "\n\n        <div id=\"doubt-form\" style=\"display: none; margin-top: 8px;\">\n          <textarea id=\"doubt-question\" placeholder=\"Describe your doubt in form of a question...\" style=\"\n            width: 100%; \n            min-height: 60px; \n            padding: 8px; \n            border: 1px solid #ccc; \n            border-radius: 4px;\n            resize: vertical;\n            box-sizing: border-box;\n          \"></textarea>\n          <div style=\"margin-top: 8px;\">\n            <button id=\"submit-doubt-btn\" style=\"\n              padding: 8px 16px; \n              border: none; \n              border-radius: 4px;\n              background-color: #4caf50;\n              color: white;\n              cursor: pointer;\n              margin-right: 8px;\n            \">\n              Add Doubt\n            </button>\n            <button id=\"cancel-doubt-btn\" style=\"\n              padding: 8px 16px; \n              border: none; \n              border-radius: 4px;\n              background-color: #f44336;\n              color: white;\n              cursor: pointer;\n            \">\n              Cancel\n            </button>\n          </div>\n        </div>\n      </div>\n    ");
        this.attachEventListeners();
    };
    DoubtsUI.prototype.attachEventListeners = function () {
        var _this = this;
        var addBtn = this.container.querySelector('#add-doubt-btn');
        var form = this.container.querySelector('#doubt-form');
        var textarea = this.container.querySelector('#doubt-question');
        var submitBtn = this.container.querySelector('#submit-doubt-btn');
        var cancelBtn = this.container.querySelector('#cancel-doubt-btn');
        addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener('click', function () {
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
            if (form.style.display === 'block') {
                textarea.focus();
            }
        });
        submitBtn === null || submitBtn === void 0 ? void 0 : submitBtn.addEventListener('click', function () {
            var _a;
            var question = textarea.value.trim();
            if (question) {
                var doubt = _this.manager.createDoubt(_this.about, question);
                textarea.value = '';
                form.style.display = 'none';
                (_a = _this.onDoubtAdded) === null || _a === void 0 ? void 0 : _a.call(_this, doubt);
            }
        });
        cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', function () {
            textarea.value = '';
            form.style.display = 'none';
        });
        textarea === null || textarea === void 0 ? void 0 : textarea.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                submitBtn.click();
            }
        });
    };
    DoubtsUI.prototype.escapeHtml = function (text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    /**
     * Get the doubt manager instance
     */
    DoubtsUI.prototype.getManager = function () {
        return this.manager;
    };
    /**
     * Destroy the UI and clean up event listeners
     */
    DoubtsUI.prototype.destroy = function () {
        this.container.innerHTML = '';
    };
    return DoubtsUI;
}());
exports.DoubtsUI = DoubtsUI;
