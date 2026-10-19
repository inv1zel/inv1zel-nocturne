// Sleeping head, after the modernist ovoid portraits. uVar: 0 = pale marble, 1 = black bronze, 2 = fractured marble
#define STEPS 220
#define STEPK 0.8
vec3 toHead(vec3 p){
  p -= vec3(0.,.36,0.);
  p.xy = rot(1.25)*p.xy;
  p.xz = rot(-.25)*p.xz;
  return p;
}
float mapHead(vec3 q){
  float d = sdEllipsoid(q, vec3(.34,.47,.38));
  d = smax(d, q.z-.33, .12);
  d = smin(d, sdEllipsoid(q-vec3(0.,.11,.27), vec3(.24,.05,.08)), .06);
  d = smin(d, sdCapsule(q, vec3(0.,.1,.32), vec3(0.,-.07,.385), .028), .05);
  d = smin(d, sdEllipsoid(q-vec3(0.,-.07,.36), vec3(.05,.03,.04)), .03);
  vec3 e = vec3(abs(q.x),q.yz);
  d = smax(d, -sdEllipsoid(e-vec3(.11,.05,.37), vec3(.07,.022,.04)), .03);
  d = smin(d, sdEllipsoid(e-vec3(.11,.045,.335), vec3(.065,.018,.025)), .02);
  d = smax(d, -sdCapsule(e, vec3(.05,.036,.348), vec3(.17,.04,.336), .004), .006);
  d = smin(d, sdEllipsoid(q-vec3(0.,-.17,.325), vec3(.07,.026,.035)), .03);
  d = smax(d, -sdCapsule(q, vec3(-.06,-.172,.36), vec3(.06,-.172,.36), .003), .005);
  d = smin(d, sdEllipsoid(q-vec3(0.,-.29,.27), vec3(.1,.08,.07)), .08);
  return d;
}
float map(vec3 p){
  float h = mapHead(toHead(p));
  float plinth = p.y;
  return min(h, plinth);
}
#include march
float veins(vec3 p){
  float n = fbm(p*2.5+uSeed);
  return pow(1.-abs(sin(p.x*3.+p.y*5.+n*9.)), 18.);
}
float voronoi(vec3 p){
  vec3 i = floor(p), f = fract(p); float d1=8., d2=8.;
  for(int z=-1;z<=1;z++) for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec3 g = vec3(x,y,z); vec3 o = vec3(hash(i+g), hash(i+g+19.1), hash(i+g+47.3));
    float d = length(g+o-f); if(d<d1){ d2=d1; d1=d; } else if(d<d2) d2=d;
  }
  return d2-d1;
}
vec3 render(vec3 ro, vec3 rd, vec2 uv){
  vec3 col = vec3(.0015) + vec3(.02)*exp(-3.*length(uv-vec2(.35,.25)));
  float t = march(ro, rd, 12.);
  if(t>0.){
    vec3 p = ro+rd*t; vec3 n = calcNormal(p);
    bool floor_ = mapHead(toHead(p)) > p.y + .001;
    vec3 L1 = normalize(vec3(-1.,.45,.15));
    vec3 L2 = normalize(vec3(.8,.4,-.6));
    float s1 = softShadow(p+n*.003, L1, .01, 5., 14.);
    float ao = calcAO(p,n);
    float dif = max(dot(n,L1),0.)*s1;
    float bk = max(dot(n,L2),0.);
    vec3 hh = normalize(L1-rd);
    float fre = pow(1.-max(dot(n,-rd),0.),5.);
    vec3 q = toHead(p);
    if(floor_){
      col = (vec3(.012)*dif + vec3(.002)*ao)*exp(-1.2*length(p.xz));
      col += vec3(.04)*pow(max(dot(n,hh),0.),40.)*s1;
    } else if(uVar < .5 || uVar > 1.5){
      float alb = .5 - .12*veins(q) - .1*fbm(q*8.);
      if(uVar > 1.5){ float c = smoothstep(.0,.025,voronoi(q*3.2+uSeed)); alb *= mix(.08,1.,c); }
      float sss = pow(clamp(dot(-n,L1)*.5+.5,0.,1.),3.)*.05;
      col = vec3(alb)*(dif*2.4 + bk*.25 + .03*ao) + vec3(sss);
      col += vec3(.35)*pow(max(dot(n,hh),0.),60.)*s1;
      col += vec3(.06)*fre*ao;
    } else {
      float alb = .03 + .01*fbm(q*12.);
      col = vec3(alb)*(dif*2.5 + bk*.4 + .05*ao);
      col += vec3(1.,.93,.82)*(pow(max(dot(n,hh),0.),90.)*2.4 + pow(max(dot(n,hh),0.),12.)*.15)*s1;
      col += vec3(1.)*pow(max(dot(n,normalize(L2-rd)),0.),40.)*.6;
      col += vec3(.1)*fre*ao;
    }
    col = mix(col, vec3(.0015), 1.-exp(-.01*t*t));
  }
  return col;
}
