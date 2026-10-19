// Colonnade with a figure and volumetric light. uVar: figure on/off
#define STEPS 200
#define STEPK 0.9
float fig(vec3 p){
  vec3 q = p - vec3(0.,0.,-16.);
  float d = sdCapsule(q, vec3(0.,.3,0.), vec3(0.,1.35,0.), .2);
  d = smin(d, sdSphere(q-vec3(0.,1.68,0.), .13), .08);
  d = smin(d, sdCapsule(q, vec3(-.08,0.,0.), vec3(-.1,.6,0.), .08), .05);
  d = smin(d, sdCapsule(q, vec3(.1,0.,0.), vec3(.1,.6,0.), .08), .05);
  return uVar > .5 ? d : 1e3;
}
float map(vec3 p){
  vec3 q = p; q.z = mod(q.z+1.5, 3.) - 1.5;
  vec3 c = vec3(abs(q.x)-2.2, q.y-3., q.z);
  float col = sdBox(c, vec3(.35,3.,.35));
  float walls = 3.2 - abs(p.x);
  float ceil_ = 6. - p.y;
  float flo = p.y;
  float back = p.z + 22.;
  float door = sdBox(p-vec3(0.,1.6,-22.), vec3(.9,1.6,.6));
  back = max(back, -door);
  float d = min(min(col, walls), min(ceil_, flo));
  d = min(d, back);
  return min(d, fig(p));
}
#include march
vec3 render(vec3 ro, vec3 rd, vec2 uv){
  vec3 Ldir = normalize(vec3(-.55,.55,-.35));
  float t = march(ro, rd, 40.);
  float tt = t>0. ? t : 40.;
  vec3 c = vec3(0.);
  if(t>0.){
    vec3 p = ro+rd*t; vec3 n = calcNormal(p);
    float sh = softShadow(p+n*.01, Ldir, .02, 20., 40.);
    float ao = calcAO(p,n);
    float alb = .08 + .04*fbm(p*3.);
    c = vec3(alb)*(max(dot(n,Ldir),0.)*sh*2.5 + .03*ao);
    if(p.z < -21.9 && abs(p.x)<.9 && p.y<3.2) c = vec3(1.4);
    float dl = length(p - vec3(0.,1.6,-22.));
    c += vec3(alb)*1.8/(1.+dl*dl*.08)*ao;
    if(fig(p) < .01) c = vec3(.002);
  }
  vec3 acc = vec3(0.);
  const int N = 56;
  float j = hash1(gl_FragCoord.xy);
  for(int i=0;i<N;i++){
    float s = (float(i)+j)/float(N)*tt;
    vec3 sp = ro+rd*s;
    float sh = softShadow(sp, Ldir, .02, 20., 60.);
    float den = .012*(.6+.8*fbm3(sp*.4+uSeed));
    float dl = length(sp - vec3(0.,1.6,-22.));
    acc += (vec3(sh)*.9*(.5+.5*pow(max(dot(rd,Ldir),0.),6.)) + vec3(1.8)/(1.+dl*dl*.3))*den*(tt/float(N));
  }
  return c*exp(-.02*tt) + acc;
}
