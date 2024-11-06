import '../components/cssforcomponents.css'
import {Socket} from "../components/auth";
import {useState} from "react";
const User = ()=>{
    const [usersCount,setUsersCount]=useState(0);
    Socket.on("getCountOfAllUsers",data=>{
        setUsersCount(data)
    })
    return(
        <div className="udetials">
            <h4>{usersCount}</h4>
            <a href={"https://johnthefullstackdeveloper.github.io/john.apks.com/"}>John</a>
        </div>
    )
}
export default User;