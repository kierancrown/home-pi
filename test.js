var lgtv = require('lgtv2')({
    url: 'ws://192.168.10.66:3000',
});

lgtv.on('error', function (err) {
    console.log(err);
});

lgtv.on('connect', function () {
    console.log('connected');

    lgtv.request('ssap://system.notifications/createToast', {message: 'Hello World!'});

    lgtv.request('ssap://system.launcher/launch', {id: 'com.disney.disneyplus-prod'});

    // lgtv.subscribe('ssap://audio/getVolume', function (err, res) {
    //     if (res && res.changed) {
    //         if (res.changed.indexOf('volume') !== -1) console.log('volume changed', res.volume);
    //         if (res.changed.indexOf('muted') !== -1) console.log('mute changed', res.muted);
    //     }
    // });
});
