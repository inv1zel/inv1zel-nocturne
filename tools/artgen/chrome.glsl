// Liquid black-chrome sculpture. uVar: 0 = twisted ring, 1 = helmet bloom
#define STEPS 200
#define STEPK 0.6
float map(vec3 p){
  vec3 q = p - vec3(0.,1.,0.);
  q.xz = rot(.4)*q.xz;
  q.yz = rot(.35)*q.yz;
  vec3 tq = q; tq.xz = rot(tq.y*2.4)*tq.xz;
  float tor = sdTorus(tq.xzy, vec2(.85, .16 + .07*sin(atan(q.y,q.x)*3.)));
  float core = length(q) - .38 - .045*sin(q.x*9.+uSeed)*sin(q.y*8.)*sin(q.z*7.);
  float d = smin(tor, core, .32);
  if(uVar > .5){
    float s = sdEllipsoid(q-vec3(0.,.15,0.), vec3(.8,.62,.75));
    s = smax(s, -sdEllipsoid(q-vec3(0.,-.15,.45), vec3(.55,.35,.5)), .1);
    s += .03*sin(q.y*18. + atan(q.z,q.x)*4.);
    d = smin(d*1.4, s, .25);
  }
  float drop = sdSphere(q-vec3(.95,-.55,.3), .11);
  d = smin(d, drop, .25);
  return d;
}
#include march
vec3 studio(vec3 r){
  vec3 c = vec3(.002);
  c += vec3(2.2)*smoothstep(.12,.0,abs(r.x+.55))*smoothstep(-.1,.5,r.y)*smoothstep(1.,.2,r.z);
  c += vec3(1.2)*smoothstep(.05,.0,abs(r.x-.62))*smoothstep(-.3,.4,r.y);
  c += vec3(.9)*smoothstep(.75,.95,r.y);
  c += vec3(.05)*smoothstep(0.,-.6,r.y);
  return c;
}
vec3 render(vec3 ro, vec3 rd, vec2 uv){
  vec3 bgc = vec3(.002) + vec3(.03)*exp(-4.*length(uv-vec2(0.,.1)));
  float t = march(ro, rd, 12.);
  if(t<0.){
    float tf = rd.y<0. ? -ro.y/rd.y : -1.;
    if(tf>0.){ vec3 p = ro+rd*tf; float sh = softShadow(p, vec3(0,1,0), .02, 3., 4.); return bgc*(.2+.8*sh); }
    return bgc;
  }
  vec3 p = ro+rd*t; vec3 n = calcNormal(p);
  vec3 r = reflect(rd,n);
  float t2 = march(p+n*.005, r, 6.);
  vec3 rc = studio(r);
  if(t2>0.){ vec3 p2 = p+r*t2; vec3 n2 = calcNormal(p2); rc = studio(reflect(r,n2))*.35; }
  float fre = .35 + .65*pow(1.-max(dot(n,-rd),0.),4.);
  float ao = calcAO(p,n);
  return rc*fre*(.4+.6*ao) + vec3(.004);
}
