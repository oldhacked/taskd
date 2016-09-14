
import registerKcdHello from './kcd-hello';


export default ngModule => {
 registerKcdHello(ngModule);


 $(document).ready(function() {
 	console.log("derp test");
 });


 
}









