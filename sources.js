const DRM_TYPE = {
  WIDEVINE: 'drm.widewine',
  PLAYREADY: 'drm.playready',
  FAIRPLAY: 'drm.fairplay',
};

class DRM {
  constructor(type, licence, headers) {
    this.type = type;
    this.licence = licence;
    this.headers = headers;
  }
}

class Manifest {
  constructor(url, drm) {
    this.url = url;
    this.drm = drm;
  }
}

Manifest.sources = [
  new Manifest(
      'https://ncdn-ba-kairos.pfd.sfr.net/dashcenc/onlytxt4/manifest.mpd'),
  new Manifest(
      'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd'),
  new Manifest(
      'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd'),
  new Manifest(
      'http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-onDemand/mp4-onDemand-mpd-AV.mpd'),
  new Manifest(
      'http://www.bok.net/dash/tears_of_steel/cleartext/stream.mpd'),
  new Manifest(
      'https://otto-stream.cdn.vodfactory.com/stream/6/dash/B001115Loiseauetlecureuil_hd_vf_feature/B001115Loiseauetlecureuil_hd_vf_feature.mpd',
      new DRM(DRM_TYPE.WIDEVINE, 'https://ut.service.expressplay.com/hms/ut/rights/?ExpressPlayToken=DAAAAAgVKcAAJDc3ZjkyNjMxLTQzMjEtNGJhOC1iYTliLTAyNjgyNTA1ZTQwNQAAATBE7wj0ocj-At41_MMcED6mQtIJwx7UTnddscwwBjmPtzbEj2TRttPLW0Qj6wHa3xBEeOW1F7kGKY-lUl8j6d13q8jVHQo5T5mj-38jQGiZsgZSio8nlXOxyUTUFpEa_FefvOlk-IaQ1BaDQztn7kDX4iRMjdGWRGT6u8u0eaNS5xNcOTIvVwJqk8zrkAP_aoI-nIEjOsCMhKGwrIaxDAdOIy1JBVDPa_K09lq55Z9pRrmV1uONM3zsLSIpEeKXycoTFlGN-wsEQ89Rr8gwfKneYtrMfIAa5uKUZBgx0KPH6z0QQBeoRqeaG_SePhfLFQ1VU6v8NqVfkY8Jr5n0MNXSBFUjKUVttJdwW56-_n7aiTQhYYEcNEKYLWWNHhW5sk-Q6f0g0E5vDO88iXU0h-k2-5AXS4f94ThbsSsfms0uSDyogHM')),
  new Manifest(
      'https://storage.googleapis.com/shaka-demo-assets/angel-one-widevine/dash.mpd',
      new DRM(DRM_TYPE.WIDEVINE, 'https://cwip-shaka-proxy.appspot.com/no_auth')),
];
