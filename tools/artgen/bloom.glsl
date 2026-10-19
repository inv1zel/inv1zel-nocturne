// Black metal flower. uVar: rotation offset
#define STEPS 320
#define STEPK 0.4
float petalLayer(vec3 p, float n, float R, float tilt, float len, float wid, float off){
  float a0 = atan(p.z,p.x) + off;
  float sec = 2.*PI/n;
  float ia = floor(a0/sec + .5);
  float r = length(p.xz);
  float d = 1e3;
  for(int k=-1;k<=1;k++){
    float a = a0 - (ia+float(k))*sec;
    vec3 q = vec3(r*cos(a), p.y, r*sin(a));
    q.x -= R;
    q.xy = rot(-tilt)*q.xy;
    q.y += .45*q.z*q.z/wid;
    q.y -= .5*q.x*q.x;
    d = min(d, sdEllipsoid(q-vec3(len*.8,0.,0.), vec3(len, .014, wid*1.15)));
  }
  return d;
}
float map(vec3 p){
  vec3 q = p - vec3(0.,.3,0.);
  float d = sdEllipsoid(q-vec3(0.,.02,0.), vec3(.09,.12,.09));
  d = smin(d, petalLayer(q, 5., .04, 1.2, .16, .12, .0+uVar), .03);
  d = min(d, petalLayer(q, 6., .07, .9, .26, .17, .45+uVar));
  d = min(d, petalLayer(q, 7., .1, .6, .36, .22, .2+uVar));
  d = min(d, petalLayer(q-vec3(0.,-.05,0.), 8., .14, .32, .48, .27, .65+uVar));
  vec3 l = q - vec3(0.,-.16,0.);
  d = min(d, petalLayer(l, 6., .22, .08, .66, .3, 1.1+uVar) + .01);
  return d*.9;
}
#include march
vec3 render(vec3 ro, vec3 rd, vec2 uv){
  vec3 bgc = vec3(.0015) + vec3(.018)*fbm(vec3(uv*3.,uSeed));
  float t = march(ro, rd, 10.);
  if(t<0.) return bgc;
  vec3 p = ro+rd*t; vec3 n = calcNormal(p);
  vec3 L1 = normalize(vec3(-.6,.9,.4)); vec3 L2 = normalize(vec3(.7,.3,-.8));
  float s1 = softShadow(p+n*.003, L1, .01, 3., 16.);
  float ao = calcAO(p,n);
  vec3 hh = normalize(L1-rd);
  float alb = .008;
  vec3 c = vec3(alb)*(max(dot(n,L1),0.)*s1*2. + .1*ao);
  c += vec3(1.)*(pow(max(dot(n,hh),0.),90.)*1.8 + pow(max(dot(n,hh),0.),14.)*.04)*s1;
  c += vec3(.5)*pow(max(dot(n,normalize(L2-rd)),0.),50.)*ao;
  c += vec3(.05)*pow(1.-max(dot(n,-rd),0.),4.)*ao;
  return c*ao;
}
