import React, { useEffect, useState } from "react";


import circularImage from '../../assets/brikoinFav.gif';
export default function LoadingCircular(props) {
  if (props.open) {
    return <img style={{ width: 80, height: 80 }} src={circularImage} />;
  }
  return <div></div>;
}
