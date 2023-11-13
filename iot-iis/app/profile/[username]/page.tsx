"use client"
import React from 'react'
import { useSession } from 'next-auth/react'

const UserProfile = ({params}) => {
  const { data: session } = useSession()
  if (session && (session.user?.username == params.username)) {
    return (
      <div>
      <h1 className={"text-xl text-cyan-50 justify-center w-full"}>{session.user?.username}</h1>

      </div>
    )
  }
  else {
    return <div> Unauthorized </div>
  }
  
}

export default UserProfile