import { Separator } from "../ui/separator";

const Footer = () => {
    return ( 
        <div className="w-full">
            <Separator className=""/>
            <div className="bg-[#f7f7f7] flex flex-col md:flex-row items-center justify-around pt-6 pb-6 w-[100%] gap-4 md:gap-10">
                <div onClick={() => document.getElementById("top")?.scrollIntoView({ behavior: "smooth" })} className="flex justify-start gap-2 hover:cursor-pointer">
                    <img src="/Objects/SemesterLogo.svg" alt="Semesters Logo" className="w-5 md:w-6 h-auto"/>
                    <h1 className="text-lg md:text-xl font-medium">Semesters</h1>
                </div>
                <a href="/privacy-policy-and-terms-conditions" className="text-xs md:text-md text-muted-foreground">Privacy Policy</a>
                <a href="/privacy-policy-and-terms-conditions" className="text-xs md:text-md text-muted-foreground">Terms & Conditions</a>
                <h1 className="text-xs md:text-md">
                    Made by <a href="https://www.linkedin.com/in/gateek-chandak/" target="_blank" className="underline">Gateek Chandak</a> & <a href="https://www.davidstirling.me/" target="_blank" className="underline">David Stirling</a>
                </h1>
            </div>
        </div>

     );
}
 
export default Footer;