"use client"
import React from 'react'
import { useSession } from 'next-auth/react'

const UserProfile = ({params}) => {
  const { data: session } = useSession()
  if (session) {
    return (
      <div>
      <h1 className={"text-xl text-cyan-50 justify-center w-full"}>{params.userId}</h1>

      </div>
    )
  }
  else {
    return <div> Unauthorized </div>
  }
  
}

export default UserProfile