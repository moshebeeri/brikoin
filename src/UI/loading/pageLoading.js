import React, { useEffect, useState } from "react";


import circularImage from '../../assets/brikoinFav.gif';
export default function PageLoading(props) {
    return <div style={{height: 800, alignItems:'center', justifyContent:'center', width: '100%' ,backgroundColor:'#ECF0F3'}}>
                    <img style={{ marginTop: 200, width: 80, height: 80 }} src={circularImage} />
             
          </div>
}
