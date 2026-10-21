// A locally rendered, original bottle. No external model or texture requests.
const art=document.querySelector('.hero-art');
const host=document.querySelector('.perfume-viewer');
const controls=document.querySelector('.perfume-controls');
const reset=document.querySelector('#reset-bottle');
async function createBottle(){
 const T=await import('./vendor/three.module.min.js');
 const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
 renderer.setClearColor(0x000000,0);
 renderer.toneMapping=T.ACESFilmicToneMapping;
 renderer.toneMappingExposure=.85;
 host.append(renderer.domElement);
 renderer.domElement.setAttribute('aria-hidden','true');
 const scene=new T.Scene();
 const camera=new T.PerspectiveCamera(35,1,.1,50);
 camera.position.set(0,.3,9.6);camera.lookAt(0,.2,0);
 scene.add(new T.HemisphereLight(0xfff1d2,0x30352b,1.1));
 const key=new T.DirectionalLight(0xffe5b0,1.8);key.position.set(-3,4,5);scene.add(key);
 const rim=new T.DirectionalLight(0xffc878,1.7);rim.position.set(4,2,-3);scene.add(rim);
 const fill=new T.DirectionalLight(0xe4e8dd,.7);fill.position.set(3,3,5);scene.add(fill);
 // A procedural studio environment gives the glass and metal real reflections.
 const environmentImages=Array.from({length:6},(_,i)=>{
  const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#726650');g.addColorStop(.48,'#393c33');g.addColorStop(1,'#11140f');x.fillStyle=g;x.fillRect(0,0,256,256);
  if(i!==3){x.fillStyle=i===2?'#fff2d7':'#c9c7ae';x.fillRect(i%2?160:38,16,32,210);x.fillStyle='#807453';x.fillRect(100,50,18,155);}return c;
 });
 const cube=new T.CubeTexture(environmentImages);cube.needsUpdate=true;
 const pmrem=new T.PMREMGenerator(renderer);const environment=pmrem.fromCubemap(cube);scene.environment=environment.texture;cube.dispose();pmrem.dispose();
 const bottle=new T.Group();scene.add(bottle);
 function roundedBox(w,h,d,r=.1){
  const s=new T.Shape(),x=-w/2,y=-h/2;
  s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
  const bevel=.045;const g=new T.ExtrudeGeometry(s,{depth:d-2*bevel,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:10});g.translate(0,0,-d/2+bevel);g.computeVertexNormals();return g;
 }
 const glass=new T.MeshPhysicalMaterial({color:0xad7c36,metalness:0,roughness:.1,transmission:.93,thickness:.55,attenuationColor:0xd29b4a,attenuationDistance:1.2,ior:1.5,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:.9});
 const body=new T.Mesh(roundedBox(1.86,2.35,.86,.21),glass);body.position.y=-.43;bottle.add(body);
 const liquid=new T.Mesh(roundedBox(1.57,1.8,.59,.13),new T.MeshPhysicalMaterial({color:0x713908,roughness:.13,metalness:0,transmission:.5,thickness:.5,ior:1.33,envMapIntensity:.65}));liquid.position.y=-.58;bottle.add(liquid);
 const gold=new T.MeshStandardMaterial({color:0xc7a05c,metalness:.88,roughness:.23});
 const base=new T.Mesh(roundedBox(1.76,.12,.77,.08),glass);base.position.y=-1.55;bottle.add(base);
 const collar=new T.Mesh(new T.CylinderGeometry(.36,.36,.29,48),gold);collar.position.y=.91;bottle.add(collar);
 const cap=new T.Mesh(roundedBox(.95,.73,.73,.055),new T.MeshStandardMaterial({color:0x252b23,metalness:.58,roughness:.29}));cap.position.y=1.38;bottle.add(cap);
 const capTrim=new T.Mesh(roundedBox(.96,.028,.74,.05),gold);capTrim.position.y=1.02;bottle.add(capTrim);
 const labelCanvas=document.createElement('canvas');labelCanvas.width=768;labelCanvas.height=640;const ctx=labelCanvas.getContext('2d');
 ctx.fillStyle='#20281f';ctx.fillRect(0,0,768,640);ctx.strokeStyle='#cfaf70';ctx.lineWidth=6;ctx.strokeRect(8,8,752,624);ctx.textAlign='center';ctx.fillStyle='#e0c997';ctx.font='86px Georgia';ctx.fillText('B R I X',384,276);ctx.font='19px Georgia';ctx.fillText('E A U   D E   M É M O I R E',384,358);ctx.font='italic 23px Georgia';ctx.fillText('the fragrance journal',384,445);
 const labelTexture=new T.CanvasTexture(labelCanvas);labelTexture.colorSpace=T.SRGBColorSpace;labelTexture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
 const label=new T.Mesh(new T.PlaneGeometry(1.34,1.14),new T.MeshStandardMaterial({map:labelTexture,roughness:.52,metalness:.08}));label.position.set(0,-.42,.447);bottle.add(label);
 const backLabel=new T.Mesh(new T.PlaneGeometry(.7,.4),new T.MeshStandardMaterial({color:0x263023,roughness:.6}));backLabel.position.set(0,-.85,-.448);backLabel.rotation.y=Math.PI;bottle.add(backLabel);
 const floorCanvas=document.createElement('canvas');floorCanvas.width=floorCanvas.height=128;const shadowCtx=floorCanvas.getContext('2d');const shadowGradient=shadowCtx.createRadialGradient(64,64,3,64,64,63);shadowGradient.addColorStop(0,'rgba(0,0,0,.55)');shadowGradient.addColorStop(1,'rgba(0,0,0,0)');shadowCtx.fillStyle=shadowGradient;shadowCtx.fillRect(0,0,128,128);
 const shadowTexture=new T.CanvasTexture(floorCanvas);const shadow=new T.Mesh(new T.PlaneGeometry(3.3,1.15),new T.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-1.82;scene.add(shadow);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let yaw=-.34,pitch=.035,targetYaw=yaw,targetPitch=pitch,dragging=false,interacted=false,visible=true,frame=0,lastTime=0,elapsed=0,lastX=0,lastY=0;
 bottle.rotation.set(pitch,yaw,-.09);
 function draw(time){frame=0;if(!visible||document.hidden)return;const delta=Math.min((time-(lastTime||time))/1000,.05);lastTime=time;elapsed+=delta;
  if(reduced.matches){yaw=targetYaw;pitch=targetPitch;}else{const ease=1-Math.exp(-9*delta);yaw+=(targetYaw-yaw)*ease;pitch+=(targetPitch-pitch)*ease;}
  bottle.rotation.set(pitch,yaw+(!interacted&&!reduced.matches?Math.sin(elapsed*.38)*.12:0),-.09);
  renderer.render(scene,camera);
  if(!reduced.matches&&(!interacted||Math.abs(targetYaw-yaw)>.0001||Math.abs(targetPitch-pitch)>.0001))start();
 }
 function start(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(draw);}
 function resize(){const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();start();}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
 const visibilityObserver=new IntersectionObserver(items=>{visible=items[0].isIntersecting;if(visible){lastTime=0;start();}else{cancelAnimationFrame(frame);frame=0;}},{threshold:0});visibilityObserver.observe(art);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{lastTime=0;start();}});
 reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;start();});
 const canvas=renderer.domElement;
 canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;dragging=true;interacted=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);host.focus({preventScroll:true});});
 canvas.addEventListener('pointermove',e=>{if(!dragging)return;targetYaw+=(e.clientX-lastX)*.009;targetPitch=T.MathUtils.clamp(targetPitch+(e.clientY-lastY)*.005,-.35,.35);lastX=e.clientX;lastY=e.clientY;start();});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>{dragging=false;});
 host.addEventListener('keydown',e=>{const movement={ArrowLeft:[-.18,0],ArrowRight:[.18,0],ArrowUp:[0,-.08],ArrowDown:[0,.08]}[e.key];if(!movement)return;e.preventDefault();interacted=true;targetYaw+=movement[0];targetPitch=T.MathUtils.clamp(targetPitch+movement[1],-.35,.35);start();});
 reset.addEventListener('click',()=>{interacted=false;elapsed=0;targetYaw=-.34;targetPitch=.035;start();});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();art.classList.remove('has-3d');controls.hidden=true;host.hidden=true;cancelAnimationFrame(frame);frame=0;});
 canvas.addEventListener('webglcontextrestored',()=>{art.classList.add('has-3d');controls.hidden=false;host.hidden=false;resize();});
 resize();renderer.render(scene,camera);art.classList.add('has-3d');controls.hidden=false;host.hidden=false;start();
}
createBottle().catch(()=>{host.hidden=true;controls.hidden=true;art.classList.remove('has-3d');});
