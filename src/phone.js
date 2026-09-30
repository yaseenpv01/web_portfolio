import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export async function createPhone(container,stage){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.z=11.5;
 const phone=new THREE.Group();scene.add(phone);
 const body=new THREE.Mesh(new RoundedBoxGeometry(2.38,4.8,.25,4,.22),new THREE.MeshStandardMaterial({color:0x626b7c,metalness:.85,roughness:.27}));phone.add(body);
 const bezel=new THREE.Mesh(new RoundedBoxGeometry(2.28,4.7,.12,4,.2),new THREE.MeshStandardMaterial({color:0x090b10,metalness:.2,roughness:.4}));bezel.position.z=.15;phone.add(bezel);
 // This screen plane remains separate, so a replacement glTF can reuse it.
 const textureLoader=new THREE.TextureLoader();
 let textures;
 try{textures=await Promise.all([0,1,2].map(i=>textureLoader.loadAsync(`${import.meta.env.BASE_URL}screens/project-${i}.svg`)));}catch(error){renderer.dispose();body.geometry.dispose();body.material.dispose();bezel.geometry.dispose();bezel.material.dispose();throw error;}
 textures.forEach(t=>{t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());});
 let screen=new THREE.Mesh(new THREE.PlaneGeometry(2.12,4.24),new THREE.MeshBasicMaterial({map:textures[0],transparent:true}));screen.position.z=.218;phone.add(screen);
 const key=new THREE.Mesh(new RoundedBoxGeometry(.055,.52,.09,2,.02),body.material);key.position.set(1.2,.65,0);phone.add(key);
 // Optional custom model. Failure retains the fully functional procedural phone.
 if(import.meta.env.VITE_PHONE_MODEL_URL){
  try{
   const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');
   const asset=await new GLTFLoader().loadAsync(import.meta.env.VITE_PHONE_MODEL_URL);
   const model=asset.scene, modelScreen=model.getObjectByName('Screen');
   if(!modelScreen?.isMesh)throw new Error('The phone model needs a mesh named Screen.');
   const box=new THREE.Box3().setFromObject(model),height=box.getSize(new THREE.Vector3()).y;
   if(height<=0)throw new Error('Invalid model dimensions.');
   model.position.sub(box.getCenter(new THREE.Vector3()));
   const holder=new THREE.Group();holder.add(model);holder.scale.setScalar(4.8/height);
   modelScreen.material=screen.material;
   for(const part of [body,bezel,key,screen])part.visible=false;
   screen=modelScreen;phone.add(holder);
  }catch(error){console.info('Using procedural phone:',error.message);}
 }
 scene.add(new THREE.HemisphereLight(0xd2e3ff,0x1c2337,3));
 const light=new THREE.DirectionalLight(0xffffff,5);light.position.set(-3,4,6);scene.add(light);
 const rim=new THREE.DirectionalLight(0x729bff,4);rim.position.set(3,0,-1);scene.add(rim);
 const points=new Float32Array(65*3);for(let i=0;i<points.length;i+=3){points[i]=(Math.random()-.5)*12;points[i+1]=(Math.random()-.5)*12;points[i+2]=-2-Math.random()*3;}
 const particlesGeometry=new THREE.BufferGeometry();particlesGeometry.setAttribute('position',new THREE.BufferAttribute(points,3));
 const particles=new THREE.Points(particlesGeometry,new THREE.PointsMaterial({color:0x82a7ff,size:.022,transparent:true,opacity:.45}));scene.add(particles);
 container.append(renderer.domElement);stage.classList.add('has-webgl');
 let progress=0,visible=true,disposed=false,raf=0,pointerX=0,pointerY=0,current=-1,lastScreenTime=0,loopIndex=0;
 const titles=['INAXUS 2.0','SP PRODUCTIVITY TRACKER','CART AND COOK'];
 const caption=stage.querySelector('.scene-caption');
 function size(){const {width,height}=container.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}
 const resize=new ResizeObserver(size);resize.observe(container);size();
 function pointer(e){pointerX=e.clientX/innerWidth-.5;pointerY=e.clientY/innerHeight-.5;}
 window.addEventListener('pointermove',pointer,{passive:true});
 function render(time){raf=0;if(disposed||!visible||document.hidden)return;
 if(time-lastScreenTime>4300){loopIndex=(loopIndex+1)%3;lastScreenTime=time;}
 const index=progress<.06?loopIndex:progress<.3?0:progress<.7?1:2;
 if(index!==current){screen.material.map=textures[index];screen.material.needsUpdate=true;current=index;caption.textContent=`${titles[index]} / INTERFACE STUDY`;}
 const targetX=.06+pointerY*.12+progress*.14,targetY=-.34+pointerX*.24+Math.sin(time*.0004)*.055+progress*.65;
 phone.rotation.x+=(targetX-phone.rotation.x)*.045;phone.rotation.y+=(targetY-phone.rotation.y)*.045;
 phone.rotation.z=-.15+Math.sin(time*.0005)*.025+progress*.22;phone.position.y=Math.sin(time*.0007)*.09+progress*.18;phone.position.x=-Math.sin(progress*Math.PI)*.18;
 particles.rotation.z=time*.000012;renderer.render(scene,camera);raf=requestAnimationFrame(render);
 }
 function resume(){if(!raf&&!disposed&&visible&&!document.hidden)raf=requestAnimationFrame(render);}
 function visibility(){if(document.hidden){cancelAnimationFrame(raf);raf=0;}else resume();}
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)resume();else{cancelAnimationFrame(raf);raf=0;}});observer.observe(stage);
 document.addEventListener('visibilitychange',visibility);
 function lost(e){e.preventDefault();dispose();stage.classList.remove('has-webgl');}
 renderer.domElement.addEventListener('webglcontextlost',lost);
 function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);observer.disconnect();resize.disconnect();window.removeEventListener('pointermove',pointer);document.removeEventListener('visibilitychange',visibility);renderer.domElement.removeEventListener('webglcontextlost',lost);const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();stage.classList.remove('has-webgl');}
 resume();return {setProgress(value){progress=value;},dispose};
}
