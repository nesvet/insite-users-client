/** @this UsersSubscriptionGroup */
export function handleRoles(updated) {
	if (updated) {
		const { roles } = this.values;
		
		for (const role of updated) {
			role.ownInvolves = roles.getAll(role.ownInvolves);
			role.involves = roles.getAll(role.involves);
			role._l = 0;
		}
		
		for (const role of roles.sorted)
			for (const involvedRole of role.ownInvolves)
				involvedRole._l = role._l + 1;
		
		if (this.isLoaded)
			this.items.users.emitUpdate(updated);
	}
	
}
