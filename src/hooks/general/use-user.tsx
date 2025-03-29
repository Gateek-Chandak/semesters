import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const useUser = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    return {user};
}
 
export default useUser;