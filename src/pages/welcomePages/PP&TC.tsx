import { Separator } from "@/components/ui/separator";

const PrivacyPolicyTermsConditions = () => {
    return ( 
        <div className="lg:bg-[#f1f0f0] w-full h-dvh">
            {/* Top Left Logo */}
            <a className="bg-[#f1f0f0] w-[100%] p-4 fixed top-0 left-0 flex justify-start gap-2 z-50" href="/">
                <img src="/Objects/SemesterLogo.svg" alt="Semesters Logo" className="w-5 h-auto"/>
                <h1 className="text-xl font-medium">Semesters</h1>
            </a>
            <div className="flex flex-col items-start justify-start h-dvh overflow-auto pt-24 px-10">
                {/* Privacy Policy */}
                <div className="mb-16 flex flex-col gap-10">
                    <h1 className="text-2xl font-medium">Privacy Policy</h1>
                    <p className="mx-10">
                    At Semesters, accessible from semesters.ca, one of our main priorities is the privacy of our users. This Privacy Policy document outlines the types of information we collect, how we use it, and the steps we take to 
                    protect your data. If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact either of us through the links in the footer of this application.
                    </p>
                    <p className="mx-10">
                    <b>Information We Collect and Use</b> <br></br>
                    When you upload a syllabus or transcript to Semesters, we temporarily process the document to extract relevant data, such as course schedules, deadlines, and academic records. We do not store any documents or sensitive data other than term and course names, 
                    along with their respective grades. If you choose to create a schedule based on your uploaded syllabus or transcript, we store the schedule data to provide the functionality of exporting to Google Calendar or 
                    managing your calendar events within the application. Semesters allows you to export schedules and events to your Google Calendar. This requires access to your Google account, granted via third-party authentication. We do not store your Google account credentials.
                    Our integration with Google Calendar is restricted to only the necessary permissions required to create and manage calendar events. We do not access or store other data from your Google account.
                    {/* </p>
                    <p className="mx-10"> */}
                    {/* Semesters follows standard procedures for using log files. These files log visitors when they use the application. The information collected may include internet protocol (IP) addresses, browser type, Internet Service 
                    Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. This information is not linked to any personally identifiable information. It is used to analyze trends, administer the site, 
                    and gather demographic information. */}
                    </p>
                    <p className="mx-10">
                    <b>Cookies and Web Beacons</b> <br></br>
                    Like many applications, Semesters uses cookies to enhance your user experience. These cookies store information such as your name, email, and Google Calendar access tokens. 
                    These tokens expire every hour and can be renewed by logging in again. We do not store any Google access token in our database. This data helps us customize your experience 
                    and improve our services. You can manage or disable cookies through your browser settings. However, this will result in you being unable to use the application.
                    </p>
                    <p className="mx-10">
                    <b>Third-Party Services</b> <br></br>
                    At Semesters, we utilize trusted third-party services, including: 
                    {/* <ul> */}
                        <li>
                        Google APIs for authentication and calendar integration. For more information on their privacy practices, refer to Google's Privacy Policy.
                        </li>
                        <li>
                        External Libraries and Open Source Technologies used for data processing. These services may process your data but do not store it.
                        </li>
                        <li>
                        Semesters does not share your personal data with third-party advertisers or services beyond what is necessary to provide our core functionality.
                        </li>
                    {/* </ul> */}
                    </p>
                    <p className="mx-10">
                    <b>Third-Party Privacy policies</b> <br></br>
                    Semesters' Privacy Policy does not apply to other websites, applications, or services that may be linked within our platform. We encourage you to review the privacy policies of these third parties for detailed information 
                    about their practices.
                    </p>
                    <p className="mx-10">
                    <b>Third-Party Privacy policies</b> <br></br>
                    {/* You can delete your account and associated data directly through your profile page in the Semesters app.  */}
                    For inquiries or data deletion requests, please email us via the LinkedIn links left in the application footer. 
                    </p>
                    <p className="mx-10">
                    <b>Online Privacy Policy Only</b> <br></br>
                    This Privacy Policy applies only to our online activities and is valid for users of Semesters with regard to the information shared and/or collected within the application. This policy does not apply to any information 
                    collected offline or through other channels.                    
                    </p>
                    <p className="mx-10">
                    <b>Consent</b> <br></br>
                    By using Semesters, you hereby consent to our Privacy Policy and agree to its terms and conditions.           
                    </p>
                </div>
                <Separator />
                {/* Terms and Conditions */}
                <div className="mb-16 mt-16 flex flex-col gap-10">
                    <h1 className="text-2xl font-medium">Terms and Conditions</h1>
                    <p className="mx-10">
                        Welcome to Semesters! These Terms and Conditions outline the rules and regulations for using our application and services. By accessing or using Semesters, you agree to comply with and be bound by these terms. If you disagree with any part of these terms, please do not use our application.
                    </p>

                    <p className="mx-10">
                        <b>1. Use of the Application</b> <br />
                        {/* <b>1.1 Eligibility:</b> You must be at least 13 years old to use Semesters. By using the application, you confirm that you meet this age requirement. <br /> */}
                        <b>1.1 Purpose:</b> Semesters is designed to help students manage their academic schedules by parsing syllabi and transcripts, creating Google Calendar events, and exporting schedules. Use the application only for its intended purpose. <br />
                        <b>1.2 Account Security:</b> You are responsible for maintaining the confidentiality of your account login information and are fully responsible for all activities under your account. Notify us immediately if you suspect unauthorized use of your account.
                    </p>

                    <p className="mx-10">
                        <b>2. User-Provided Content</b> <br />
                        <b>2.1 Uploaded Documents:</b> By uploading documents such as syllabi or transcripts, you grant Semesters permission to process the files for the purpose of generating schedules or other application features. Semesters does not claim ownership of your uploaded documents. <br />
                        <b>2.2 Prohibited Content:</b> You agree not to upload content that is unlawful, harmful, offensive, or infringes on the intellectual property rights of others. Semesters reserves the right to remove any such content.
                    </p>

                    <p className="mx-10">
                        <b>3. Data and Privacy</b> <br />
                        <b>3.1 Data Use:</b> All data provided to or generated by Semesters is handled in accordance with our <a href="#">Privacy Policy</a>. By using Semesters, you agree to the collection and use of your data as described in the Privacy Policy. <br />
                        <b>3.2 Google Integration:</b> Semesters uses Google APIs to integrate with Google Calendar. By connecting your Google account, you agree to comply with Google’s terms of service and grant Semesters the necessary permissions to create and manage 
                        secondary calendars and events.
                    </p>

                    <p className="mx-10">
                        <b>4. Limitation of Liability</b> <br />
                        Semesters is provided "as is" and "as available." We do not guarantee that the application will be error-free, secure, or uninterrupted. <br />
                        Semesters is not responsible for any loss or damage resulting from your reliance on the application, including errors in scheduling or data loss. <br />
                        To the maximum extent permitted by law, Semesters and its team are not liable for indirect, incidental, or consequential damages arising from your use of the application.
                    </p>

                    <p className="mx-10">
                        <b>5. Termination</b> <br />
                        {/* <b>5.1 Termination by User:</b> You may stop using Semesters at any time. If you wish to delete your account, you can do so via the profile page or by contacting us. <br /> */}
                        <b>5.1 Termination by Semesters:</b> We reserve the right to suspend or terminate your account if you violate these Terms and Conditions or engage in prohibited activities.
                    </p>

                    <p className="mx-10">
                        <b>6. Changes to Terms</b> <br />
                        Semesters reserves the right to modify these Terms and Conditions at any time. We will notify users of significant changes through the application or by email. Continued use of the application after changes are made constitutes acceptance of the updated terms.
                    </p>

                    <p className="mx-10">
                        <b>7. Governing Law</b> <br />
                        These Terms and Conditions are governed by and construed in accordance with the laws of Waterloo, Ontario. Any disputes arising under these terms will be subject to the exclusive jurisdiction of the courts in Waterloo, Ontario.
                    </p>

                    <p className="mx-10">
                        <b>8. Contact Us</b> <br />
                        If you have any questions or concerns about these Terms and Conditions, please contact us via the links below in our footer.
                    </p>
                    </div>
            </div>
            {/* Footer */}
            <div className="bg-[#f1f0f0] w-[100%] border-t border-gray-200 flex flex-row justify-center z-50">
                <div className="w-[90%] flex flex-col md:flex-row items-center justify-around pt-10 pb-14 gap-4 md:gap-10">
                    <a href="/" className="flex justify-start gap-2">
                        <img src="/Objects/SemesterLogo.svg" alt="Semesters Logo" className="w-5 md:w-6 h-auto"/>
                        <h1 className="text-lg md:text-xl font-medium">Semesters</h1>
                    </a>
                    <a href="/privacy-policy-and-terms-conditions" className="text-xs md:text-md text-muted-foreground">Privacy Policy</a>
                    <a href="/privacy-policy-and-terms-conditions" className="text-xs md:text-md text-muted-foreground">Terms & Conditions</a>
                    <h1 className="text-xs md:text-md">
                        Made by <a href="https://www.linkedin.com/in/gateek-chandak/" target="_blank" className="underline">Gateek Chandak</a> & <a href="https://www.davidstirling.me/" target="_blank" className="underline">David Stirling</a>
                    </h1>
                </div>
            </div>
        </div>
     );
}
 
export default PrivacyPolicyTermsConditions;

