const functions = require("firebase-functions");
const axios = require("axios")


const admin = require('firebase-admin');
admin.initializeApp();


// "http://localhost:5001/freetrade-fc705/us-central1/notifyUsersWhoLikeNewlyAddedItem-0"
exports.notifyUsersWhoLikeNewlyAddedItem = functions.firestore.document('/Post/{documentId}')
	.onCreate(async (snap, context) => {
		const newItemAddedData = snap.data();
		const categoryForNewItem = newItemAddedData.Category
		const subCategoryForNewItem = newItemAddedData.SubCategory
		functions.logger.log(context.params.documentId, newItemAddedData);

		// Finding all favourites
		let allPromises = []
		var noFavouritesOrUsersFoundResponse = await admin.firestore()
			.collection('Favourite')
			.where('category', '==', categoryForNewItem)
			.where('subCategory', '==', subCategoryForNewItem)
			.get()
			.then(querySnapshot => {
				if (querySnapshot.empty){
					functions.logger.log('NO FAVOURITES FOUND');
					return
				}
				querySnapshot.forEach((doc) => {
					// console.log(doc.id, doc.data());
					let favouriteItemData = doc.data()
					let itemId = doc.id // favouriteItemData.productId
					let users = favouriteItemData.users
					functions.logger.log('USERS LIKING IT ARE ', users.length)
					if (!users){
						functions.logger.log('NO USERS FOUND IN FAVOURITE');
						return
					}
					users.forEach(async (userId) => {
						await admin
							.firestore()
							.collection('Users')
							.doc(userId)
							.get()
							.then(documentSnapshot => {
								if (documentSnapshot.exists) {
									
									let userData = documentSnapshot.data()								
									
									let message = userData.name + ' added an Item you might be interested in'
									
									let notificationDatabasePromise = admin.firestore()
										.collection('Notification')
										.doc()
										.set({
											userID: userId,
											text: message,
											newlyAddedItemId: itemId,
										})
										.then(async () => {
											functions.logger.log('Notification added to DB');
											var data = JSON.stringify({
												data: {},
												notification: {
													body: 'Someone posted something you might be interested in',
													title: message,
												},
												to: userData.NotificationToken,
												// to: JSON.parse(userData.NotificationToken),
											});
											var config = {
												method: 'post',
												url: 'https://fcm.googleapis.com/fcm/send',
												headers: {
													Authorization:
														'key=AAAAwssoW30:APA91bGw2zSndcTuY4Q_o_L9x6up-8tCzIe0QjNLOs-bTtZQQJk--iAVrGU_60Vl1Q41LmUU8MekVjH_bHowDK4RC-mzDaJyjr9ma21gxSqNYrQFNTzG7vfy537eA_ogt1IORC12B5Ls',
													'Content-Type': 'application/json',
												},
												data: data,
											};
											let notificationSendingPromise = axios(config)
												.then(function (response) {
													functions.logger.log('Notification sent TO EMAIL for adding item with id ');
													console.log(JSON.stringify(response.data));
												})
												.catch(function (error) {
													console.warn(error);
												});
											
											allPromises.push(notificationSendingPromise)
										})
										.catch(err => console.warn(err));

										allPromises.push(notificationDatabasePromise)
									}
								})
								.catch(err => {
									setloading(false);
									console.warn(err);
								});
					})
        });

		return noFavouritesOrUsersFoundResponse
    
	});

	return allPromises
});



exports.progagateCategoryNameChangesOnAllItems = functions.firestore.document('/Category/{title}')
	.onUpdate(async (change, context) => {

		const categoryId = context.params.title
		const categoryNewData = change.after.data()
		const categoryOldData = change.before.data()
		const categoryOldTitle = categoryOldData.title
		const categoryNewTitle = categoryNewData.title
		
		if (categoryOldTitle == categoryNewTitle){
			functions.logger.log(`Nothing to change in Category`);
			return
		}

		let allPromises = []
		var noItemsWithEditedCategoryFoundResponse = await admin.firestore()
			.collection('Post')
			.where('Category', '==', categoryOldTitle)
			.get()
			.then(querySnapshot => {
				if (querySnapshot.empty){
					functions.logger.log('NO ITEM FOUND');
					return
				}
				querySnapshot.forEach((doc) => {
					// console.log(doc.id, doc.data());
					let itemData = doc.data()
					let itemId = doc.id
					allPromises.push(
						admin.firestore()
							.collection('Post')
							.doc(itemId)
							.update({
								Category: categoryNewTitle
							})
							.then(async () => {
								functions.logger.log(`Category for item ${itemId} changed from ${categoryOldTitle} to ${categoryNewTitle}`);
							})
							.catch(err => {
								functions.logger.log(`Failed to edit Category for item ${itemId} changed from ${categoryOldTitle} to ${categoryNewTitle}`);
							})
					)

				})
			})
		
		return noItemsWithEditedCategoryFoundResponse
})


exports.progagateSubCategoryNameChangesOnAllItems = functions.firestore.document('/SubCategory/{subCategory}')
	.onUpdate(async (change, context) => {

		const subCategoryId = context.params.title
		const subCategoryNewData = change.after.data()
		const subCategoryOldData = change.before.data()
		const oldSubCategoryName = subCategoryOldData.subCategory
		const newSubCategoryName = subCategoryNewData.subCategory

		if (oldSubCategoryName == newSubCategoryName){
			functions.logger.log(`Nothing to change in Sub Category`);
			return
		}

		let allPromises = []
		var noItemsWithEditedSubCategoryFoundResponse = await admin.firestore()
			.collection('Post')
			.where('SubCategory', '==', oldSubCategoryName)
			.get()
			.then(querySnapshot => {
				if (querySnapshot.empty){
					functions.logger.log('NO ITEM FOUND');
					return
				}
				querySnapshot.forEach((doc) => {
					// console.log(doc.id, doc.data());
					let itemData = doc.data()
					let itemId = doc.id
					allPromises.push(
						admin.firestore()
							.collection('Post')
							.doc(itemId)
							.update({
								SubCategory: newSubCategoryName
							})
							.then(async () => {
								functions.logger.log(`Category for item ${itemId} changed from ${oldSubCategoryName} to ${newSubCategoryName}`);
							})
							.catch(err => {
								functions.logger.log(`Failed to edit Category for item ${itemId} changed from ${oldSubCategoryName} to ${newSubCategoryName}`);
							})
					)

				})
			})
		
		return noItemsWithEditedSubCategoryFoundResponse
})

