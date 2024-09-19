import {useState} from 'react'
import { Button } from '../ui/button'
import { useAuth } from '@/context/AuthContext'
const FollowButton = ({className, userIdToFollow, following}:{className?:string, userIdToFollow:string, following?:boolean}) => {
  const [isFollowing] = useState(following)
  const [isHovered, setIsHovered] = useState(false)
  const {followOrUnfollowUser} = useAuth()
  const handleMouseEnter = () => {
    setIsHovered(true)
  }
  const handleMouseLeave = () => {
    setIsHovered(false)
  }
  const handleFollow = () => {
    try {
      followOrUnfollowUser(userIdToFollow)
    } catch (error) {
      console.log(error);
      
    }
  }
  const handleUnfollow = () => {
    try {
      followOrUnfollowUser(userIdToFollow)
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div>
      {isFollowing ? (
        <Button className={className +'min-w-28'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleUnfollow}>
          {isHovered ? "Unfollow" : "Following"}
        </Button>
      ) : (
        <Button className={className} onClick={handleFollow}>
          Follow
        </Button>
      )}
    </div>
  )
}

export default FollowButton
