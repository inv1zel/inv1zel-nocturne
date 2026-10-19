float march(vec3 ro, vec3 rd, float tmax){
  float t = 0.01;
  for(int i=0;i<STEPS;i++){
    float d = map(ro+rd*t);
    if(abs(d)<0.0004*t) return t;
    t += d*STEPK;
    if(t>tmax) break;
  }
  return -1.;
}
vec3 calcNormal(vec3 p){
  const float h = 0.0008; const vec2 k = vec2(1,-1);
  return normalize(k.xyy*map(p+k.xyy*h)+k.yyx*map(p+k.yyx*h)+k.yxy*map(p+k.yxy*h)+k.xxx*map(p+k.xxx*h));
}
float softShadow(vec3 ro, vec3 rd, float mint, float tmax, float k){
  float res = 1.; float t = mint;
  for(int i=0;i<64;i++){
    float h = map(ro+rd*t);
    res = min(res, k*h/t);
    t += clamp(h, 0.01, 0.2);
    if(res<0.002 || t>tmax) break;
  }
  return clamp(res,0.,1.);
}
float calcAO(vec3 p, vec3 n){
  float occ = 0., sca = 1.;
  for(int i=0;i<5;i++){ float h = .01+.12*float(i)/4.; occ += (h-map(p+h*n))*sca; sca *= .95; }
  return clamp(1.-3.*occ,0.,1.);
}
