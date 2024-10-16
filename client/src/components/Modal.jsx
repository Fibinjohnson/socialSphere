import React from 'react'
import "./Modal.css"
import { CancelOutlined ,Done} from "@mui/icons-material";
import { useDispatch , useSelector} from 'react-redux';
import config from 'config';
import { setFriends } from "state"

function Modal(props) {
  const { setOpenModal ,isFriend,name ,friendId}=props
  const dispatch=useDispatch()
  const {_id}=useSelector((state)=>state.user)
  const token=useSelector((state)=>state.token)
  const friends=useSelector((state)=>state.user.friends)

  const patchFriend=async()=>{
    setOpenModal(true)
    const response= await fetch(`${config.API_SERVER}/users/${_id}/${friendId}`,{
         method:"PATCH",
         headers:{Authorization:`Bearer ${token}`},
         "Content-Type":"application/json"
     })
     const data=await response.json();
     const isArray=data.length>0;
    const arrayOfFriends=isArray ?data[0].allFriends:data 
     dispatch(setFriends({friends:arrayOfFriends}))
 }
  return (
    <div className="modalBackground">
    <div className="modalContainer">
      <div className="title">
      {isFriend?<h4>Are You Sure You Want to unfriend {name}?</h4>:<h4>Are You Sure You Want to add {name} as your Friend?</h4>}
        
      </div>
      <div className="footer">
  <div className="leftButton">
    <CancelOutlined size='small'  color="error" onClick={() => {
      setOpenModal(false);
    }}>
      Cancel
    </CancelOutlined>
  </div>
  <div className="rightButton">
    <Done size='small'  color="success" onClick={() => {patchFriend(); setOpenModal(false)}}>
      Continue
    </Done>
  </div>
</div>

    </div>
  </div>
);
  
}

export default Modal
