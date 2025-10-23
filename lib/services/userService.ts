import { useAuth } from "../providers/AuthProvider";

export function getUserStats(){
    const {user} = useAuth();
}