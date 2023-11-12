import React from 'react'

const UserProfile = ({params}) => {
  return (
    <div>
    <h1 className={"text-xl text-cyan-50 justify-center w-full"}>{params.username}</h1>

    </div>
  )
}

export default UserProfile