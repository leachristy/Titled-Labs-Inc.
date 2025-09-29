import { useState } from "react"; 
import { collection, getDocs } from "firebase/firestore"
import { db } from "../src/firebase"

export default function ShowUsersButton() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false); 

    
}