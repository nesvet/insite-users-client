import { getAll } from "@nesvet/n";
import type { SubscriptionMapUpdated, SubscriptionMapWithSubscription } from "insite-subscriptions-client";
import type { UsersSubscriptionGroup } from "./UsersSubscriptionGroup";


export type Role = {
	_id: string;
	ownInvolves: Role[];
	involves: Role[];
	_l: number;
};

export type Roles = SubscriptionMapWithSubscription<Role>;


/** @this UsersSubscriptionGroup */
export function handleRoles(this: UsersSubscriptionGroup, updated: SubscriptionMapUpdated<Role> | null) {
	if (updated) {
		const roles = this.values.roles as Roles;
		
		for (const role of updated) {
			role.ownInvolves = getAll(roles, role.ownInvolves as unknown as string[], true);
			role.involves = getAll(roles, role.involves as unknown as string[], true);
			role._l = 0;
		}
		
		for (const role of roles.sorted)
			for (const involvedRole of role.ownInvolves)
				involvedRole._l = role._l + 1;
		
		if (this.isLoaded)
			this.items.users.emitUpdate(updated);
	}
	
}
