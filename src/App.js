import './App.css';
import {Auth, getDeviceId} from './components/auth';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from "react-router-dom";
window.onbeforeunload = function(){
    localStorage.setItem("windows","0");
}
window.onload=function(){
    if("1" === localStorage.getItem('windows')){
        localStorage.setItem("login", "");
    }else{
        localStorage.setItem("windows","1");
    }
}

function App() {
  return (
    <div className="App">
        <Auth/>
    </div>
  );
}

export default App;
