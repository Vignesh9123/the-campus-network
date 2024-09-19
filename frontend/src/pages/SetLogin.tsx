import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const SetLogin = () => {
  const navigate = useNavigate()
  const { getGoogleSignedInUser } = useAuth()
  const queryParameters = new URLSearchParams(window.location.search)
  const refreshToken = queryParameters.get('refresh-token')
  const accessToken = queryParameters.get('access-token')
  useEffect(() => {
    console.log(refreshToken)
    if (accessToken) {
      getGoogleSignedInUser({accessToken})
      navigate('/')
    }
  }, [])
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (
    <div>
      
    </div>
  )
}

export default SetLogin
