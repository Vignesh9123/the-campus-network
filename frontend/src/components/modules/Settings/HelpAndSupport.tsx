import { Card,
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    CardFooter
 } from "@/components/ui/card"
 import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
function HelpAndSupport() {
  return (
    <div className="grid gap-5">

      <Card>
        <CardHeader>
          <CardTitle>Help and Support</CardTitle>
          <CardDescription>
            Get help with any of our features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We're here to help. If you have any questions, please reach out
            to us via email at vignesh.d9123@gmail.com
          </p>
        </CardContent>
        <CardFooter>
           <Link to={"https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=vignesh.d9123@gmail.com&su=Requesting%20Support"} target="_blank"> <Button >Mail us</Button></Link>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>
            Share your feedback with us
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We're always looking for ways to improve our product. Please let us
            know what you think. We appreciate your feedback!
          </p>
        </CardContent>
        
        <CardFooter>
           <Link to={"https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=vignesh.d9123@gmail.com&su=Feedback%20For%20The%20Campus%20Network"} target="_blank"> <Button >Mail us</Button></Link>
        </CardFooter>
      </Card>
      {/*TODO:Add a FAQ section */}
    </div>
  )
}

export default HelpAndSupport
