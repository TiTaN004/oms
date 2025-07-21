import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export default function Test() {
      // Navigation hook
  const nav = useNavigate();
  const location = useLocation();
    const goBack = () => {
        nav('/dashboard/casting-orders', {state: {page: "casting"}})
    }
  return (
    <button onClick={goBack}>go back</button>
  )
}
