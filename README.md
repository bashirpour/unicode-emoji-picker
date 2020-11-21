# Unicode Emoji Picker

:heart_eyes: :stuck_out_tongue_winking_eye: :joy: :stuck_out_tongue: Instantly get Emoji `shortcode` and `unicode` from Emoji menu :boom: :sparkles: :thumbsup: :metal:

**Live Demo:** https://bashirpour.github.io/unicode-emoji-picker/demo/

# Installation & Usage:

1. In your `<head>` section, add the following *stylesheet* links. Adjust the `lib/css` path to match yours.

    ```html
    <link href="lib/css/emoji.css" rel="stylesheet">
    ```
   
2. Add style `position: relative;` to your emoji menu location.

3. Before the end of your `<body>` section, add the following *JavaScript* links. This library depends on jQuery, so jQuery must also be included, before these scripts are run. Once again, adjust the `lib/js` path to match yours.

    ```html
    <!-- ** Don't forget to Add jQuery here ** -->
    <script src="lib/js/config.js"></script>
    <script src="lib/js/emoji-picker.js"></script>
    ```

4. finally

    ```javascript
    $(function () {
        window.emojiPicker = new EmojiPicker({
            assetsPath: 'lib/img/', 
            triggerButton: $("#__"), // Emoji Trigger Button Selector
            emojiMenuPlace: $("#__"), // Emoji Menu location Selector
            dontHideOnClick: 'emoji-picker', //avoid to hide on click that (`class name`)
            emojiResult: function (res) {
                // alert(JSON.stringify(res, null, 4));
                console.log(res);
            }
        });
        window.emojiPicker.discover();
    });
    ```


# Options

1. Use `$.triggerEmojiMenu()` for trigger emoji menu.



It will be updated soon
...