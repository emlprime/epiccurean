import React from "react"
import styled from "styled-components"

export default function Profile({className, children}) {
  return ( 
  <Style className = {className}>
  {children}
  </Style>
  )
}

const Style = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`


  