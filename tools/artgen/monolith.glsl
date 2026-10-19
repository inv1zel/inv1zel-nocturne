// Monolith in a lake, overcast. uVar: 0 = default
#define STEPS 200
#define STEPK 0.7
float rocks(vec3 p){
  vec3 q = p - vec3(0.,0.,-9.);
  float d = sdEllipsoid(q-vec3(.0,-.1,0.), vec3(1.6,.45,1.1));
  d = smin(d, sdEllipsoid(q-vec3(-1.4,-.1,.4), vec3(.9,.35,.7)), .3);
  d = smin(d, sdEllipsoid(q-vec3(1.3,-.2,.2), vec3(.8,.3,.6)), .3);
  d += .18*fbm(q*1.6) + .05*fbm(q*6.);
  return d;
}
float mono(vec3 p){ vec3 q = p - vec3(0.,1.9,-9.1); q.xz = rot(.35)*q.xz; return sdBox(q, vec3(.2,2.2,.07)); }
float map(vec3 p){ return min(mono(p), rocks(p)); }
#include march
vec3 sky(vec3 rd){
  float y = max(rd.y,0.);
  vec3 c = mix(vec3(.2), vec3(.012), pow(y,.35));
  float cl = fbm(vec3(rd.xz/(rd.y+.15)*1.2, uSeed));
  c *= .75 + .5*cl;
  c += vec3(.22)*exp(-40.*y);
  return c;
}
float mountains(vec3 rd, float scale, float base, float off){
  float a = atan(rd.x, -rd.z);
  return base + scale*(fbm(vec3(a*4.+off, off, 0.))-.4) + .02*noise(vec3(a*40.,off,1.));
}
vec3 env(vec3 ro, vec3 rd){
  vec3 c = sky(rd);
  float m1 = mountains(rd, .22, .035, 3.);
  float m2 = mountains(rd, .12, .01, 11.);
  if(rd.y < m1) c = mix(vec3(.045), sky(rd), .55);
  if(rd.y < m2) c = mix(vec3(.02), sky(rd), .35);
  return c;
}
vec3 shadeObj(vec3 ro, vec3 rd, float t){
  vec3 p = ro+rd*t; vec3 n = calcNormal(p);
  vec3 L = normalize(vec3(-.4,.8,-.6));
  float dif = max(dot(n,L),0.); float skyl = .5+.5*n.y;
  float ao = calcAO(p,n);
  bool isMono = mono(p) < .01;
  float alb = isMono ? .012 : .025 + .02*fbm(p*4.);
  vec3 c = vec3(alb)*(dif*1.2 + skyl*1.4)*ao;
  if(isMono){ vec3 r = reflect(rd,n); c += env(p,r)*.35*pow(1.-max(dot(n,-rd),0.),2.); c += vec3(.03)*pow(max(dot(r,L),0.),20.); }
  return mix(c, env(ro,rd), 1.-exp(-.0035*t*t));
}
vec3 render(vec3 ro, vec3 rd, vec2 uv){
  float t = march(ro, rd, 40.);
  float tw = rd.y < 0. ? -ro.y/rd.y : 1e9;
  if(t>0. && t<tw) return shadeObj(ro, rd, t);
  if(tw < 1e8){
    vec3 p = ro+rd*tw;
    vec3 n = normalize(vec3((fbm(vec3(p.xz*vec2(.6,2.),uSeed))-.5)*.04, 1., (fbm(vec3(p.xz*vec2(.6,2.)+7.,uSeed))-.5)*.12));
    vec3 r = reflect(rd, n);
    float t2 = march(p+n*.01, r, 40.);
    vec3 rc = t2>0. ? shadeObj(p, r, t2) : env(p, r);
    float fre = .04 + .96*pow(1.-max(dot(n,-rd),0.),5.);
    vec3 c = mix(vec3(.003), rc, clamp(fre*1.2+.12,0.,1.));
    return mix(c, env(ro,rd), 1.-exp(-.0015*tw*tw));
  }
  return env(ro, rd);
}
