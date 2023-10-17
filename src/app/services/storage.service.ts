import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, StringFormat, uploadString } from '@angular/fire/storage';

export interface StorageRequest {
	/**
    * Should include the file name and extention
    */
	fullPath: string;
	content: string;
	type: StringFormat;
}

@Injectable({
	providedIn: 'root'
})
export class StorageService {
	constructor(private storage: Storage) {}

	async upload(file: StorageRequest) {
		const storageRef = ref(this.storage, file.fullPath);
		console.log('💡 storageRef::: ', storageRef)

		try {
			const u = await uploadString(storageRef, file.content, 'base64');
			console.log('💡 u::: ', u)
			const imageUrl = await getDownloadURL(storageRef);
			return imageUrl;
		} catch (e) {
			console.error(e)
			return null;
		}
	}
}