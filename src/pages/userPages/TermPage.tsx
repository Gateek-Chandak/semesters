// Custom Components
import CompletedTermPage from "@/components/termPageComponents/CompletedTermPage";
import RegularTermPage from "@/components/termPageComponents/RegularTermPage";
import Footer from "@/components/sharedHooks/Footer";
// Hooks
import useData from '@/hooks/generalHooks/use-data';

const TermPage = () => {
    // Hooks
    const { termData } = useData();

    return ( 
        <div className="w-full min-h-dvh h-fit px-5 lg:px-10 pt-7 bg-[#f7f7f7] flex flex-col justify-start items-center gap-5 overflow-visible">
            {/* Incomplete Term */}
            {!termData?.isCompleted && <RegularTermPage />}
            {/* Completed Term */}
            {termData?.isCompleted && <CompletedTermPage />}
            <Footer />
        </div>
        );
}
 
export default TermPage;