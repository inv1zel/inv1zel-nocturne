vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }
void main(){
  vec3 col = vec3(0.);
  vec3 fw = normalize(uTa-uRo);
  vec3 rt = normalize(cross(fw, vec3(0,1,0)));
  vec3 up = cross(rt, fw);
  for(int j=0;j<AA;j++) for(int i=0;i<AA;i++){
    vec2 o = (vec2(float(i),float(j))+.5)/float(AA)-.5;
    vec2 uv = (gl_FragCoord.xy+o-.5*uRes)/uRes.y;
    vec3 rd = normalize(uv.x*rt + uv.y*up + uFov*fw);
    col += render(uRo, rd, uv);
  }
  col /= float(AA*AA);
  col *= uExp;
  float l = dot(col, vec3(.2126,.7152,.0722));
  col = mix(vec3(l), col, .15) * uTint;
  col = aces(col);
  vec2 q = gl_FragCoord.xy/uRes;
  col *= 0.35 + 0.65*pow(16.0*q.x*q.y*(1.-q.x)*(1.-q.y), 0.22);
  col = pow(col, vec3(1./2.2));
  col = mix(col, col*col*(3.-2.*col), .55);
  col += (hash1(gl_FragCoord.xy+uSeed)-.5)/255.*2.;
  fragColor = vec4(col,1.);
}
