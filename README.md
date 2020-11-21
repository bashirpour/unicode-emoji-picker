# Unicode Emoji Picker

:heart_eyes: :stuck_out_tongue_winking_eye: :joy: :stuck_out_tongue: Instantly get Emoji `shortcode` adn `unicode` from Emoji menu :boom: :sparkles: :thumbsup: :metal:

**Live Demo:** https://bashirpour.github.io/unicode-emoji-picker/demo/

# Installation & Usage:

1. In your `<head>` section, add the following *stylesheet* links. Adjust the `lib/css` path to match yours.

      ```
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet">
        <link href="lib/css/emoji.css" rel="stylesheet">
      ```

2. Before the end of your `<body>` section, add the following *JavaScript* links. This library depends on jQuery, so jQuery must also be included, before these scripts are run. Once again, adjust the `lib/js` path to match yours.

      ```
        <!-- ** Don't forget to Add jQuery here ** -->
        <script src="../lib/js/config.js"></script>
        <script src="../lib/js/emoji-picker.js"></script>
      ```

3. finally

      ```javascript
        $(function () {
            window.emojiPicker = new EmojiPicker({
                assetsPath: '../lib/img/',
                triggerButton: $("#open_emoji_box"),
                emojiMenuPlace: $("#emojiMenuPlaceSelector"),
                dontHideOnClick: 'emoji-picker', //class name
                emojiResult: function (res) {
                    // alert(JSON.stringify(res, null, 4));
                    console.log(res);
                }
            });
            window.emojiPicker.discover();
        });
      ```


# Configuring Options
coming soon
... 