// require ./dist/shaka-player.js
// require ./sources.js

/* eslint-disable max-len */

let SourceIndex = 0;


document.addEventListener('keydown', (event) => {
  // console.warn(`KEYDOWN -> code: ${event.code}, keyCode: ${event.keyCode}`);
  const video = window.player.a === undefined ? window.player.video_ : window.player.a;

  switch (event.keyCode) {
    case 37:// 'ArrowLeft'
      SourceIndex -= 1;
      if (SourceIndex < 0) {
        SourceIndex = Manifest.sources.length - 1;
      }
      changeChannel();
      break;
    case 39: // 'ArrowRight'
      SourceIndex += 1;
      if (SourceIndex > Manifest.sources.length - 1) {
        SourceIndex = 0;
      }
      changeChannel();
      break;
    case 13: // 'Enter'
      if (video.paused) {
        console.log('Pressed play');
        video.play();
      } else {
        console.log('Pressed pause');
        video.pause();
      }
      break;
    default:
      break;
  }
});

function changeChannel() {
  const source = Manifest.sources[SourceIndex];
  console.warn(`set source ${SourceIndex}, url: ${source.url}`);
  setSource(window.player, source);
}

function initApp() {
  console.info(`shaka.Player.version: ${shaka.Player.version}`);

  shaka.log.setLevel(shaka.log.Level.V2);

  shaka.polyfill.installAll();

  if (shaka.Player.isBrowserSupported()) {
    initPlayer();
  } else {
    console.error('Browser not supported!');
  }
}

function configureLicenceHeaders(headers) {
  player.getNetworkingEngine().registerRequestFilter((type, request) => {
    if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
      for (const [key, value] of Object.entries(headers)) {
        request.headers[key] = value;
      }
    }
  });
}

function initPlayer() {
  const video = document.getElementById('video');
  const player = new shaka.Player(video);

  window.player = player;

  player.addEventListener('error', onErrorEvent);

  changeChannel();
}

function configureDRM(player, source) {
  if (source.drm && source.drm.headers) {
    configureLicenceHeaders(source.drm.headers);
  }

  if (!source.drm) {
    player.configure({
      drm: {},
    });
    return;
  }

  const drmKey = source.drm.type === DRM_TYPE.WIDEVINE ? 'com.widevine.alpha' : 'com.microsoft.playready';
  const servers = {};
  servers[`${drmKey}`] = source.drm.licence;
  player.configure({
    drm: {
      servers: servers,
    },
  });
}

function setSource(player, source) {
  configureDRM(player, source);

  const isVersion3 = parseInt(shaka.Player.version.slice(1)[0], 10);
  const parserArgument = isVersion3 ? 'application/dash+xml' : shaka.dash.DashParser;

  player.load(source.url, /* startTime= */ 0, parserArgument).catch(onError);
}

function onErrorEvent(event) {
  onError(event.detail);
}

function onError(error) {
  console.error('Error code', error.code, 'object', error);
}

window.addEventListener('load', initApp);
