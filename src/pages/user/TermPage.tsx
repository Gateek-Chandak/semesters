// Custom Components
import CompletedTermPage from "@/components/term/CompletedTermPage";
import RegularTermPage from "@/components/term/RegularTermPage";
import Footer from "@/components/shared/Footer";
// Hooks
import useData from '@/hooks/general/use-data';

const TermPage = () => {
    // Hooks
    const { termData } = useData();

    return ( 
        <div className="w-full min-h-dvh h-fit px-5 lg:px-10 pt-7 bg-[#f7f7f7] flex flex-col justify-start items-center gap-5 overflow-visible">
            {/* Incomplete Term */}
            {!termData?.is_completed && <RegularTermPage />}
            {/* Completed Term */}
            {termData?.is_completed && <CompletedTermPage />}
            <Footer />
        </div>
        );
}
 
export default TermPage;