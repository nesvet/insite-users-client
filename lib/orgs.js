export function handleOrgsBeforeSubscribe(orgs) {
	
	orgs.null = {
		_id: null,
		title: "",
		isOrg: true,
		users: Object.assign(new Set(), { sorted: [] })
	};
	
}

/** @this UsersSubscriptionGroup */
export function handleOrgs(updated) {
	if (updated)
		for (const org of updated.added) {
			org.isOrg = true;
			
			org.users = Object.assign(new Set(), { sorted: [] });
		}
	else {
		this.values.orgs.null.users.clear();
		this.values.orgs.null.users.sorted.length = 0;
	}
	
}

/** @this UsersSubscriptionGroup */
export function handleExtendedOrgs(updated) {
	
	const { orgs } = this.values;
	
	if (updated) {
		const { users, extendedOrgs } = this.values;
		
		for (const orgDoc of updated) {
			const org = orgs.get(orgDoc._id);
			
			org.owners = orgDoc.owners.map(_id => users.get(_id) || orgs.get(_id));
			org.slaveOrgs = orgs.getAll(orgDoc.slaveOrgs);
			org.note = orgDoc.note;
			org._l = 0;
		}
		
		const sortedHierarchically = [];
		
		for (const orgDoc of extendedOrgs.sorted) {
			const org = orgs.get(orgDoc._id);
			
			for (const slaveOrg of org.slaveOrgs)
				slaveOrg._l = org._l + 1;
			
			sortedHierarchically.push(org);
		}
		
		orgs.sortedHierarchically = sortedHierarchically;
		
		if (this.isLoaded) {
			this.items.users.emitUpdate();
			this.items.orgs.emitUpdate(updated);
		}
	} else {
		for (const org of orgs.sorted) {
			delete org.owners;
			delete org.slaveOrgs;
			delete org.note;
			delete org._l;
		}
		delete orgs.sortedHierarchically;
	}
	
}
