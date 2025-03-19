// Hooks
import useData from "./use-data";
import { useEffect } from "react";
import { useToast } from "./use-toast";
// Services
import { APIService } from "@/services/apiService";

const _apiService = new APIService();

const useSyncTermData = () => {
    const { data } = useData();
    const { toast } = useToast();

    useEffect(() => {
        const syncData = async () => {
            try {
                _apiService.syncTermDataWithDatabase(data); 
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error Syncing Data",
                    description: "Reload the page and try again.",
                    duration: 2000,
                });
            }
        }

        if (data) {
            syncData();
        }
    }, [data])
}
 
export default useSyncTermData;