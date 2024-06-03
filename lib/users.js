/** @this UsersSubscriptionGroup */
export function handleUsers(updated) {
	if (updated) {
		const { users, user: currentUser, orgs } = this.values;
		
		if (users.get(currentUser._id) !== currentUser) {
			users.set(currentUser._id, currentUser);
			users.sorted[users.sorted.findIndex(user => user._id === currentUser._id)] = currentUser;
		}
		const updatedUserIndex = updated.findIndex(user => user._id === currentUser._id);
		
		if (~updatedUserIndex)
			updated[updatedUserIndex] = currentUser;
		
		const addedUserIndex = updated.added.findIndex(user => user._id === currentUser._id);
		
		if (~addedUserIndex)
			updated.added[updatedUserIndex] = currentUser;
		
		for (const user of updated.added)
			user.isUser = true;
		
		let shouldUpdateUser;
		const orgsToSortUsers = new Set();
		
		for (const user of updated) {
			const org = orgs.get(user.orgId) ?? orgs.null;
			
			if (user.org !== org) {
				if (user.org) {
					user.org.users.delete(user);
					user.org.users.sorted.remove(user);
				}
				user.org = org;
				user.org.users.add(user);
				user.org.users.sorted.push(user);
				
				orgsToSortUsers.add(user.org);
			}
			
			if (user === currentUser)
				shouldUpdateUser = true;
			
		}
		
		for (const org of orgsToSortUsers)
			org.users.sorted.sort(users.sortCompareFunction);
		
		if (updated.deleted.length)
			for (const org of [ ...orgs.sorted, orgs.null ])
				for (const user of org.users)
					if (!users.has(user._id)) {
						org.users.delete(user);
						org.users.sorted.remove(user);
					}
		
		if (this.isLoaded) {
			if (shouldUpdateUser)
				this.items.user.emitUpdate();
			this.items.orgs.emitUpdate();
		}
	}
	
}

/** @this UsersSubscriptionGroup */
export function handleExtendedUsers(updated) {
	
	const { users } = this.values;
	
	if (updated) {
		const { roles } = this.values;
		
		for (const userDoc of updated) {
			const user = users.get(userDoc._id);
			
			user.roles = roles.getAll(userDoc.roleIds);
		}
	} else
		for (const user of users.sorted)
			delete user.roles;
	
}
