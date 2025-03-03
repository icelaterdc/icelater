const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const distube = new DisTube(new Client(), {
    emitNewSongOnly: false,
    leaveOnFinish: false,
    leaveOnStop: false,
    plugins: [new YtDlpPlugin()],
});

module.exports = { distube };
