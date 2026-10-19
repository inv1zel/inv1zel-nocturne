#define STEPS 260
#define STEPK 0.55
float mapFig(vec3 p){
  vec3 q = p;
  float w = fbm3(q*vec3(1.4,.55,1.4)+uSeed);
  float head = sdEllipsoid(q-vec3(0.,1.66,0.02), vec3(.2,.25,.22));
  float sh = sdEllipsoid(q-vec3(0.,1.27,0.), vec3(.47,.2,.28));
  float body = sdCappedCone(q-vec3(0.,.64,0.), .64, .82, .38);
  float d = smin(head, sh, .2);
  d = smin(d, body, .32);
  float ang = atan(q.z,q.x);
  float h = smoothstep(1.95, .9, q.y);
  float folds = 1.-abs(sin(ang*4. + w*6.5 + q.y*1.6 + 2.*sin(q.y*2.3+ang)));
  float fine  = 1.-abs(sin(ang*11. + w*9. - q.y*2.4));
  float sweep = sin(dot(q, normalize(vec3(1.,1.2,.4)))*5. + w*5.)*smoothstep(1.5,.3,q.y);
  d -= (.07*folds*folds + .014*fine + .07*sweep)*h;
  d -= .012*smoothstep(1.4,2.,q.y)*sin(ang*7.+w*5.);
  return d;
}
float map(vec3 p){
  float fig = mapFig(p);
  float gr = p.y + .02*fbm3(p*2.);
  return smin(fig, gr, .12);
}
#include march
vec3 bg(vec3 rd, vec2 uv){
  float smoke = fbm(vec3(uv*2.2, uSeed*.3) + vec3(0,0,fbm3(vec3(uv*3.,1.))));
  float glow = exp(-2.2*length(uv-vec2(-.25+uVar*.1,.22)));
  return vec3(.0015) + vec3(.035)*smoke*smoke*glow*1.6 + vec3(.012)*glow;
}
vec3 render(vec3 ro, vec3 rd, vec2 uv){
  float t = march(ro, rd, 14.);
  vec3 col = bg(rd, uv);
  if(t>0.){
    vec3 p = ro+rd*t; vec3 n = calcNormal(p);
    bool ground = p.y < .05 && mapFig(p) > .03;
    vec3 L1 = normalize(vec3(-.75,.85,.55));
    vec3 L2 = normalize(vec3(.9,.35,-.75));
    vec3 L3 = normalize(vec3(.2,.2,1.));
    float ao = calcAO(p,n);
    float s1 = softShadow(p+n*.004, L1, .02, 6., 10.);
    float dif1 = max(dot(n,L1),0.)*s1;
    float dif2 = max(dot(n,L2),0.);
    float fre = pow(1.-max(dot(n,-rd),0.), 4.);
    vec3 hh = normalize(L1-rd);
    float spec = pow(max(dot(n,hh),0.), 70.)*s1;
    float sheen = pow(max(dot(n,hh),0.), 9.)*s1;
    float spec2 = pow(max(dot(n,normalize(L2-rd)),0.), 30.);
    float alb = ground ? .006 : .014;
    col = vec3(alb*(dif1*3.2 + dif2*.9 + .05*ao + .25*max(dot(n,L3),0.)*ao));
    if(!ground){ col += vec3(1.)*(spec*2.2 + sheen*.07 + spec2*.6 + fre*.05*ao); }
    else { col += vec3(.4)*spec*.3; }
    float fog = 1.-exp(-.018*t*t);
    col = mix(col, bg(rd,uv), fog*.5);
    col *= smoothstep(-.4, .3, p.y + .5);
  }
  return col;
}
