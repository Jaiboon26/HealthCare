import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";

export function FirebaseApp() {
    const [imageUpload, setImageUpload] = useState<File | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [userid, setUserid] = useState<string>();

    const uploadFile = () => {
        if (imageUpload == null || !userid) return;
        const imageRef = ref(storage, `${userid}/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageUrls((prev) => [...prev, url]);
            });
        });
    };


    return (
        <div className="App">
            <input
                type="file"
                onChange={(event) => {
                    setImageUpload(event.target.files ? event.target.files[0] : null);
                }}
            />
            <button onClick={uploadFile}> Upload Image</button>
            {imageUrls.map((url, index) => {
                return <img key={index} src={url} alt={`Image ${index}`} />;
            })}
        </div>
    );
}
