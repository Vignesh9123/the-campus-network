import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter
} from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { RefObject } from "react"
function Appearance({scrollableDiv}:{scrollableDiv:RefObject<HTMLDivElement>}) {
  return (
    <div ref={scrollableDiv}>
        <Card>
            <CardHeader>
                <CardTitle>
                    Theme
                </CardTitle>
                <CardDescription>
                    Choose the theme of the app
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <ModeToggle/>
                </CardContent>
                <CardFooter>
                    <p>Choose the theme of the app</p>
                </CardFooter>
            
        </Card>
    </div>
  )
}

export default Appearance
