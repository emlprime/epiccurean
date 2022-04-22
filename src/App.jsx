import React, {useState} from "react";
import styled from "styled-components"
import "./style.css";
import Fight from "./Fight"

export default function App() {
  return (
    <Style>
      <Fight />
      
    </Style>
  );
}

const Style = styled.div`
.left {
  color: blue;
} 
.right {
  color: red;
}
`
