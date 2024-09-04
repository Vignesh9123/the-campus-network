import React from 'react'
import { Button } from '../ui/button'
const FollowButton = ({className}:{className?:string}) => {
  return (
    <div>
      <Button className={className}>Follow</Button>
    </div>
  )
}

export default FollowButton
