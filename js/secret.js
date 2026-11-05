(function () {
    const canvas = document.getElementById("gl");
    const errBox = document.getElementById("err");
    function fail(msg) { errBox.style.display = "block"; errBox.textContent = msg; console.error(msg); }

    const gl = canvas.getContext("webgl2", { antialias: false, depth: false, stencil: false, alpha: false });
    if (!gl) { fail("WebGL2 is not available in this browser / Wallpaper Engine build."); return; }

    // ── vertex: one fullscreen triangle ──
    const VERT = `#version 300 es
    in vec2 p;
    void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

    // ── fragment: the pattern shader (exported #version 300 es WebGL2) ──
    const FRAG = `#version 300 es
    precision highp float;
    precision highp int;
    uniform vec2  iResolution;
    uniform float iTime;
    out vec4 oColor;

    #define uResolution iResolution.xy
    #define uTime iTime

    #define time uTime
    const float noiseScale = 3.0;
    #define screenSize uResolution
    #define sampleOffset vec2(0.0)
    const float cellSize = 1.0;
    const float octaves = 5.0;
    const float gain = 0.7;

    #define morphPhase (uTime*0.04)
    #define scrollSpeed vec2(-0.05, -0.1)
    const vec2 loopD = vec2(0.0, 0.0);
    const float loopZ = 0.0;

    const vec4 PALETTE[110] = vec4[110](
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0219354,0.0163153,0.0274784,1.0),
    vec4(0.0438708,0.0326307,0.0549569,1.0),
    vec4(0.0658061,0.048946,0.0824353,1.0),
    vec4(0.0877415,0.0652614,0.109914,1.0),
    vec4(0.109677,0.0815767,0.137392,1.0),
    vec4(0.129765,0.0965181,0.162557,1.0),
    vec4(0.149853,0.11146,0.187721,1.0),
    vec4(0.169941,0.126401,0.212886,1.0),
    vec4(0.19003,0.141342,0.23805,1.0),
    vec4(0.210118,0.156284,0.263215,1.0),
    vec4(0.230206,0.171225,0.288379,1.0),
    vec4(0.250294,0.186167,0.313544,1.0),
    vec4(0.270382,0.201108,0.338708,1.0),
    vec4(0.290471,0.21605,0.363873,1.0),
    vec4(0.310559,0.230991,0.389037,1.0),
    vec4(0.330647,0.245932,0.414201,1.0),
    vec4(0.350735,0.260874,0.439366,1.0),
    vec4(0.370823,0.275815,0.46453,1.0),
    vec4(0.387864,0.28849,0.485877,1.0),
    vec4(0.404904,0.301164,0.507223,1.0),
    vec4(0.421944,0.313839,0.52857,1.0),
    vec4(0.438985,0.326513,0.549916,1.0),
    vec4(0.456025,0.339187,0.571262,1.0),
    vec4(0.471033,0.350351,0.590064,1.0),
    vec4(0.486042,0.361514,0.608865,1.0),
    vec4(0.50105,0.372677,0.627666,1.0),
    vec4(0.516059,0.38384,0.646467,1.0),
    vec4(0.531067,0.395003,0.665268,1.0),
    vec4(0.546075,0.406166,0.684069,1.0),
    vec4(0.561084,0.417329,0.70287,1.0),
    vec4(0.576092,0.428492,0.721671,1.0),
    vec4(0.591101,0.439656,0.740472,1.0),
    vec4(0.606109,0.450819,0.759273,1.0),
    vec4(0.621118,0.461982,0.778074,1.0),
    vec4(0.636126,0.473145,0.796875,1.0),
    vec4(0.636126,0.473145,0.796875,1.0),
    vec4(0.636126,0.473145,0.796875,1.0),
    vec4(0.636126,0.473145,0.796875,1.0),
    vec4(0.636126,0.473145,0.796875,1.0),
    vec4(0.636126,0.473145,0.796875,1.0),
    vec4(0.636126,0.473145,0.796875,1.0),
    vec4(0.636126,0.473145,0.796875,1.0)
    );
    vec4 paletteLookup(float x){
    int i = clamp(int(clamp(x,0.0,1.0)*256.0),0,255);
    return PALETTE[clamp(int(float(i)/255.0*110.0),0,109)];
    }

    #define MAX_OCTAVES 10
    #define MORPH_DESYNC_AMP   1.6
    #define MORPH_DESYNC_SCALE 2.5

    vec3 hash33(vec3 p) {
        p = fract(p * vec3(0.1031, 0.1030, 0.0973));
        p += dot(p, p.yxz + 33.33);
        return -1.0 + 2.0 * fract((p.xxy + p.yxx) * p.zyx);
    }

    float gnoise3(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(
            mix(mix(dot(hash33(i + vec3(0,0,0)), f - vec3(0,0,0)),
                    dot(hash33(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
                mix(dot(hash33(i + vec3(0,1,0)), f - vec3(0,1,0)),
                    dot(hash33(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
            mix(mix(dot(hash33(i + vec3(0,0,1)), f - vec3(0,0,1)),
                    dot(hash33(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
                mix(dot(hash33(i + vec3(0,1,1)), f - vec3(0,1,1)),
                    dot(hash33(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y),
            u.z);
    }

    float basisSample(vec3 p, vec2 d, float pz) {
        
        return gnoise3(p);
    }

    float fbm3(vec3 p) {
        float v = 0.0, a = 0.5, norm = 0.0;
        vec2  d  = loopD;
        float pz = loopZ;
        int oct = int(octaves + 0.5);
        for (int i = 0; i < MAX_OCTAVES; i++) {
            if (i >= oct) break;
            float sn = basisSample(p, d, pz);
            float t;
            {
                t = 1.0 - abs(sn);
                t = t * t;
            }
            v    += a * t;
            norm += a;
            p     = p * 2.0 + vec3(5.3, 1.7, 3.1);
            d    *= 2.0;
            pz   *= 2.0;
            a    *= gain;
        }
        return v / norm;
    }

    float whash2(vec2 p) {
        p = fract(p * vec2(127.1, 311.7));
        p += dot(p, p.yx + 19.19);
        return fract((p.x + p.y) * 43.32);
    }
    float wnoise2(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(whash2(i + vec2(0.0, 0.0)), whash2(i + vec2(1.0, 0.0)), u.x),
                mix(whash2(i + vec2(0.0, 1.0)), whash2(i + vec2(1.0, 1.0)), u.x), u.y);
    }





    vec2 warpUV(vec2 uv) {
        return uv;
    }

    vec2 rotateUV(vec2 uv) {
        return uv;
    }

    float fieldN(vec2 uv, float mzExtra) {
        float mz = morphPhase + mzExtra;

        mz += MORPH_DESYNC_AMP * (wnoise2(uv * MORPH_DESYNC_SCALE) - 0.5);
        
        vec2 nsv = vec2(noiseScale);
        return fbm3(vec3(uv * nsv + time * scrollSpeed, mz));
    }

    vec4 shade(vec2 screen_coords) {
        vec2 block = floor((screen_coords + sampleOffset) / cellSize) * cellSize;
        vec2 uv0   = warpUV(block / screenSize);
        float mzAdd = 0.0, valAdd = 0.0;
        vec2 uvDisp = vec2(0.0);

        float n = fieldN(rotateUV(uv0 + uvDisp), mzAdd);
        n = clamp(n + valAdd, 0.0, 1.0);
        return paletteLookup(n);
    }


    void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec4 c = shade(vec2(fragCoord.x, iResolution.y - fragCoord.y));
    fragColor = vec4(c.rgb * c.a, 1.0);
    }

    void main() {
    vec4 c;
    mainImage(c, gl_FragCoord.xy);
    oColor = c;
    }`;

    // ── compile + link ──
    function compile(type, src) {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        throw new Error("Shader compile error:\n" + gl.getShaderInfoLog(sh));
        }
        return sh;
    }
    let prog;
    try {
        prog = gl.createProgram();
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error("Program link error:\n" + gl.getProgramInfoLog(prog));
        }
    } catch (e) { fail(String(e.message || e)); return; }

    gl.useProgram(prog);

    // fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes  = gl.getUniformLocation(prog, "iResolution");
    const uTime = gl.getUniformLocation(prog, "iTime");
    const uMouse = gl.getUniformLocation(prog, "iMouse");

    // buffer tracks the display size for crisp full-res; re-sized on window resize
    function resize() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width  = Math.max(1, Math.round(window.innerWidth  * dpr));
        canvas.height = Math.max(1, Math.round(window.innerHeight * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uRes, canvas.width, canvas.height);
    }

    window.addEventListener("resize", resize);
    resize();

    // feed the cursor into iMouse (Shadertoy-style bottom-left origin, in buffer pixels)
    function setMouse(e) {
        const mx = e.clientX / window.innerWidth  * canvas.width;
        const my = canvas.height - e.clientY / window.innerHeight * canvas.height;
        gl.uniform2f(uMouse, mx, my);
    }
    window.addEventListener("pointermove", setMouse);
    gl.uniform2f(uMouse, canvas.width * 0.5, canvas.height * 0.5);

    const start = performance.now();
    function frame(now) {
        gl.uniform1f(uTime, (now - start) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
})();