let registerWebDevice = function(registerWebDeviceKeys) {
  registerWebDeviceKeys.workerUrl = "/assets/js/push-worker.js";
 // console.log('you called registerWebDeviceKeys', registerWebDeviceKeys)
  !function(n,t,c,e,u){function r(n){try{f=n(u)}catch(n){return h=n,void i(p,n)}i(s,f)}function i(n,t){for(var c=0;c<n.length;c++)d(n[c],t);
  }function o(n,t){return n&&(f?d(n,f):s.push(n)),t&&(h?d(t,h):p.push(t)),l}function a(n){return o(!1,n)}function d(t,c){
  n.setTimeout(function(){t(c)},0)}var f,h,s=[],p=[],l={then:o,catch:a,_setup:r};n[e]=l;var v=t.createElement("script");
  v.src=c,v.async=!0,v.id="_uasdk",v.rel=e,t.head.appendChild(v)}(window,document,'assets/js/ua-sdk.min.js',
    'UA', registerWebDeviceKeys);
}