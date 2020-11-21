//ConfigStorage
(function (window) {
    var keyPrefix = '';
    var noPrefix = false;
    var cache = {};
    var useCs = !!(window.chrome && chrome.storage && chrome.storage.local);
    var useLs = !useCs && !!window.localStorage;

    function storageSetPrefix(newPrefix) {
        keyPrefix = newPrefix;
    }

    function storageSetNoPrefix() {
        noPrefix = true;
    }

    function storageGetPrefix() {
        if (noPrefix) {
            noPrefix = false;
            return '';
        }
        return keyPrefix;
    }

    function storageGetValue() {
        var keys = Array.prototype.slice.call(arguments),
            callback = keys.pop(),
            result = [],
            single = keys.length == 1,
            value,
            allFound = true,
            prefix = storageGetPrefix(),
            i, key;

        for (i = 0; i < keys.length; i++) {
            key = keys[i] = prefix + keys[i];
            if (key.substr(0, 3) != 'xt_' && cache[key] !== undefined) {
                result.push(cache[key]);
            } else if (useLs) {
                try {
                    value = localStorage.getItem(key);
                } catch (e) {
                    useLs = false;
                }
                try {
                    value = (value === undefined || value === null) ? false : JSON.parse(value);
                } catch (e) {
                    value = false;
                }
                result.push(cache[key] = value);
            } else if (!useCs) {
                result.push(cache[key] = false);
            } else {
                allFound = false;
            }
        }

        if (allFound) {
            return callback(single ? result[0] : result);
        }

        chrome.storage.local.get(keys, function (resultObj) {
            var value;
            result = [];
            for (i = 0; i < keys.length; i++) {
                key = keys[i];
                value = resultObj[key];
                value = value === undefined || value === null ? false : JSON.parse(value);
                result.push(cache[key] = value);
            }

            callback(single ? result[0] : result);
        });
    }

    function storageSetValue(obj, callback) {
        var keyValues = {},
            prefix = storageGetPrefix(),
            key, value;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                value = obj[key];
                key = prefix + key;
                cache[key] = value;
                value = JSON.stringify(value);
                if (useLs) {
                    try {
                        localStorage.setItem(key, value);
                    } catch (e) {
                        useLs = false;
                    }
                } else {
                    keyValues[key] = value;
                }
            }
        }

        if (useLs || !useCs) {
            if (callback) {
                callback();
            }
            return;
        }

        chrome.storage.local.set(keyValues, callback);
    }

    function storageRemoveValue() {
        var keys = Array.prototype.slice.call(arguments),
            prefix = storageGetPrefix(),
            i, key, callback;

        if (typeof keys[keys.length - 1] === 'function') {
            callback = keys.pop();
        }

        for (i = 0; i < keys.length; i++) {
            key = keys[i] = prefix + keys[i];
            delete cache[key];
            if (useLs) {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    useLs = false;
                }
            }
        }
        if (useCs) {
            chrome.storage.local.remove(keys, callback);
        } else if (callback) {
            callback();
        }
    }

    window.ConfigStorage = {
        prefix: storageSetPrefix,
        noPrefix: storageSetNoPrefix,
        get: storageGetValue,
        set: storageSetValue,
        remove: storageRemoveValue
    };
})(this);

// Pollyfill for IE 9 support of CustomEvent
(function () {

    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || {bubbles: false, cancelable: false, detail: undefined};
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

//EmojiPicker
(function () {
    this.EmojiPicker = (function () {
        function EmojiPicker(options) {
            var ref, ref1;
            if (options == null) {
                options = {};
            }
            $.emojiarea.iconSize = (ref = options.iconSize) != null ? ref : 25;
            $.emojiarea.assetsPath = (ref1 = options.assetsPath) != null ? ref1 : '';
            this.generateEmojiIconSets(options);
            this.options = options;
        }

        EmojiPicker.prototype.discover = function () {
            var isiOS;
            isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isiOS) {
                return;
            }
            return $.emojiarea($.extend({
                emojiPopup: this,
                norealTime: true
            }, this.options));
        };

        EmojiPicker.prototype.generateEmojiIconSets = function (options) {
            var column, dataItem, hex, i, icons, j, name, reverseIcons, row, totalColumns;
            icons = {};
            reverseIcons = {};
            i = void 0;
            j = void 0;
            hex = void 0;
            name = void 0;
            dataItem = void 0;
            row = void 0;
            column = void 0;
            totalColumns = void 0;
            j = 0;
            while (j < Config.EmojiCategories.length) {
                totalColumns = Config.EmojiCategorySpritesheetDimens[j][1];
                i = 0;
                while (i < Config.EmojiCategories[j].length) {
                    dataItem = Config.Emoji[Config.EmojiCategories[j][i]];
                    name = dataItem[1][0];
                    row = Math.floor(i / totalColumns);
                    column = i % totalColumns;
                    icons[':' + name + ':'] = [j, row, column, ':' + name + ':'];
                    reverseIcons[name] = dataItem[0];
                    i++;
                }
                j++;
            }
            $.emojiarea.icons = icons;
            return $.emojiarea.reverseIcons = reverseIcons;
        };

        return EmojiPicker;

    })();
}).call(this);

//EmojiMenu
(function ($, window, document) {
    var KEY_ESC = 27;
    var KEY_TAB = 9;

    $.emojiarea = {
        assetsPath: '',
        spriteSheetPath: '',
        blankGifPath: '',
        iconSize: 25,
        icons: {}
    };
    var defaultRecentEmojis = ':joy:,:kissing_heart:,:heart:,:heart_eyes:,:blush:,:grin:,:+1:,:relaxed:,:pensive:,:smile:,:sob:,:kiss:,:unamused:,:flushed:,:stuck_out_tongue_winking_eye:,:see_no_evil:,:wink:,:smiley:,:cry:,:stuck_out_tongue_closed_eyes:,:scream:,:rage:,:smirk:,:disappointed:,:sweat_smile:,:kissing_closed_eyes:,:speak_no_evil:,:relieved:,:grinning:,:yum:,:laughing:,:ok_hand:,:neutral_face:,:confused:'.split(',');

    $.emojiarea = function (options) {
        this.options = options;
        var self = this;
        self.emojiMenu = new EmojiMenu(self);
        var $button = options.triggerButton;

        $button.on('click', function (e) {
            self.emojiMenu.show();
        });
        this.$button = $button;
        this.$dontHideOnClick = options.dontHideOnClick;
    };

    $.triggerEmojiMenu = function () {
        this.emojiMenu.show();
    };

    var EmojiMenu = function (emojiarea) {
        var self = this;
        self.id = emojiarea.id;
        var $body = $(document.body);
        var $window = $(window);

        this.visible = false;
        this.emojiarea = emojiarea;
        EmojiMenu.menuZIndex = 5000;
        this.$menu = $('<div>');
        this.$menu.addClass('emoji-menu');
        this.$menu.attr('data-id', self.id);
        this.$menu.attr('data-type', 'menu');
        this.$menu.hide();

        this.$itemsTailWrap = $('<div class="emoji-items-wrap1"></div>')
            .appendTo(this.$menu);
        this.$categoryTabs = $(
            '<table class="emoji-menu-tabs"><tr>'
            + '<td><a class="emoji-menu-tab icon-recent" ></a></td>'
            + '<td><a class="emoji-menu-tab icon-smile" ></a></td>'
            + '<td><a class="emoji-menu-tab icon-flower"></a></td>'
            + '<td><a class="emoji-menu-tab icon-bell"></a></td>'
            + '<td><a class="emoji-menu-tab icon-car"></a></td>'
            + '<td><a class="emoji-menu-tab icon-grid"></a></td>'
            + '</tr></table>').appendTo(this.$itemsTailWrap);
        this.$itemsWrap = $(
            '<div class="emoji-items-wrap mobile_scrollable_wrap"></div>')
            .appendTo(this.$itemsTailWrap);
        this.$items = $('<div class="emoji-items">').appendTo(
            this.$itemsWrap);


        this.$menu.appendTo(this.emojiarea.options.emojiMenuPlace);

        $body.on('keydown', function (e) {
            if (e.keyCode === KEY_ESC || e.keyCode === KEY_TAB) {
                self.hide();
            }
        });


        $body.on('mouseup', function (e) {
            e = e.originalEvent || e;
            var target = e.target || window;

            if ($(target).hasClass(self.emojiarea.$dontHideOnClick))
                return;

            self.hide();
        });

        this.$menu.on('mouseup', 'a', function (e) {
            e.stopPropagation();
            return false;
        });

        this.$menu.on('click', 'a', function (e) {

            if ($(this).hasClass('emoji-menu-tab')) {
                if (self.getTabIndex(this) !== self.currentCategory) {
                    self.selectCategory(self.getTabIndex(this));
                }
                return false;
            }

            var emoji = $('.label', $(this)).text();
            window.setTimeout(function () {
                self.onItemSelected(emoji);
                if (e.ctrlKey || e.metaKey) {
                    self.hide();
                }
            }, 0);
            e.stopPropagation();
            return false;
        });

        this.selectCategory(0);
    };

    EmojiMenu.prototype.createIcon = function (emoji, menu) {
        var category = emoji[0];
        var row = emoji[1];
        var column = emoji[2];
        var name = emoji[3];
        var filename = $.emojiarea.spriteSheetPath ? $.emojiarea.spriteSheetPath : $.emojiarea.assetsPath + '/emoji_spritesheet_!.png';
        var blankGifPath = $.emojiarea.blankGifPath ? $.emojiarea.blankGifPath : $.emojiarea.assetsPath + '/blank.gif';
        var iconSize = menu && Config.Mobile ? 26 : $.emojiarea.iconSize
        var xoffset = -(iconSize * column);
        var yoffset = -(iconSize * row);
        var scaledWidth = (Config.EmojiCategorySpritesheetDimens[category][1] * iconSize);
        var scaledHeight = (Config.EmojiCategorySpritesheetDimens[category][0] * iconSize);

        var style = 'display:inline-block;';
        style += 'width:' + iconSize + 'px;';
        style += 'height:' + iconSize + 'px;';
        style += 'background:url(\'' + filename.replace('!', category) + '\') '
            + xoffset + 'px ' + yoffset + 'px no-repeat;';
        style += 'background-size:' + scaledWidth + 'px ' + scaledHeight
            + 'px;';
        return '<img src="' + blankGifPath + '" class="img" style="'
            + style + '" alt="' + this.htmlEntities(name) + '">';
    };

    EmojiMenu.prototype.htmlEntities = function (str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    EmojiMenu.prototype.getTabIndex = function (tab) {
        return this.$categoryTabs.find('.emoji-menu-tab').index(tab);
    };

    EmojiMenu.prototype.selectCategory = function (category) {
        var self = this;
        this.$categoryTabs.find('.emoji-menu-tab').each(function (index) {
            if (index === category) {
                this.className += '-selected';
            } else {
                this.className = this.className.replace('-selected', '');
            }
        });
        this.currentCategory = category;
        this.load(category);
    };

    // return unicode emoji such as 😄
    EmojiMenu.prototype.colonToUnicode = function (input) {
        if (!input) {
            return '';
        }
        if (!Config.rx_colons) {
            Config.init_unified();
        }
        return input.replace(Config.rx_colons, function (m) {
            var val;
            val = Config.mapcolon[m];
            if (val) {
                return val;
            } else {
                return '';
            }
        });
    };

    // return result
    EmojiMenu.prototype.onItemSelected = function (shortcode) {
        this.saveRecentEmoji(shortcode);
        this.emojiarea.options.emojiResult({
            'shortcode': shortcode,
            'unicode': this.colonToUnicode(shortcode)
        })
    };

    // save recent used emojis.
    EmojiMenu.prototype.saveRecentEmoji = function (emojiKey) {
        ConfigStorage.get('emojis_recent', function (curEmojis) {
            curEmojis = curEmojis || defaultRecentEmojis || [];

            var pos = curEmojis.indexOf(emojiKey);
            if (!pos) {
                return false;
            }
            if (pos != -1) {
                curEmojis.splice(pos, 1);
            }
            curEmojis.unshift(emojiKey);
            if (curEmojis.length > 42) {
                curEmojis = curEmojis.slice(42);
            }

            ConfigStorage.set({
                emojis_recent: curEmojis
            });
        })
    };

    EmojiMenu.prototype.load = function (category) {
        var html = [];
        var options = $.emojiarea.icons;
        var path = $.emojiarea.assetsPath;
        var self = this;
        if (path.length && path.charAt(path.length - 1) !== '/') {
            path += '/';
        }

        // add scrollbars to EmojiMenu
        var updateItems = function () {
            self.$items.html(html.join(''));
        };

        if (category > 0) {
            for (var key in options) {
                if (options.hasOwnProperty(key)
                    && options[key][0] === (category - 1)) {
                    html.push('<a href="javascript:void(0)" title="'
                        + self.htmlEntities(key) + '">'
                        + self.createIcon(options[key], true)
                        + '<span class="label">' + self.htmlEntities(key)
                        + '</span></a>');
                }
            }
            updateItems();
        } else {
            ConfigStorage.get('emojis_recent', function (curEmojis) {
                curEmojis = curEmojis || defaultRecentEmojis || [];
                var key, i;
                for (i = 0; i < curEmojis.length; i++) {
                    key = curEmojis[i];
                    if (options[key]) {
                        html.push('<a href="javascript:void(0)" title="'
                            + self.htmlEntities(key) + '">'
                            + self.createIcon(options[key], true)
                            + '<span class="label">'
                            + self.htmlEntities(key) + '</span></a>');
                    }
                }
                updateItems();
            });
        }
    };

    EmojiMenu.prototype.hide = function (callback) {
        this.visible = false;
        this.$menu.hide("fast");
    };

    EmojiMenu.prototype.show = function () {

        if (this.visible)
            return this.hide();

        $(this.$menu).css('z-index', ++EmojiMenu.menuZIndex);
        this.$menu.show("fast");

        this.visible = true;
    };

})(jQuery, window, document);
