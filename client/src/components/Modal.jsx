import React from 'react'
import "./Modal.css"
import { CancelOutlined ,Done} from "@mui/icons-material";

function Modal({ setOpenModal ,patchFriend,isFriend,name }) {
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
