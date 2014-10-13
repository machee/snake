require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

require(
    ['vendor/requirejs-domready/domReady', 'Dragon'],
    function (domReady, Dragon) { domReady(function () {
        console.log('running game', Dragon);
        new Dragon();
    })}
);
