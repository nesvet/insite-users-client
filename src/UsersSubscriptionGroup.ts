import {
	SubscriptionGroup,
	type SubscriptionMapWithSubscription,
	type SubscriptionObjectWithSubscription
} from "insite-subscriptions-client";
import { handleExtendedOrgs, handleOrgs, handleOrgsBeforeSubscribe } from "./orgs";
import { handleRoles } from "./roles";
import { handleUser } from "./user";
import { handleExtendedUsers, handleUsers } from "./users";
import type { UsersSubscriptionGroupOptions } from "./types";
	}
	
	isExtended: boolean | null = false;
	
	extend() {
		
		if (this.isExtended === false) {
			this.isExtended = null;
			
			return this.attach(extendedDefinitions).then(() => {
				
				this.isExtended = true;
				
			});
		}
	}
	
	unextend() {
		
		if (this.isExtended) {
			this.isExtended = false;
			
			this.detach([ "roles", "extendedUsers", "extendedOrgs" ]);
		}
		
	}
	
	
	static handleValues({
		orgs,
		users,
		user
	}: {
		orgs: SubscriptionMapWithSubscription;
		users: SubscriptionMapWithSubscription;
		user: SubscriptionObjectWithSubscription;
	}, options: SubscriptionGroupOptions) {
		return new SubscriptionGroup([
			[ "orgs", orgs, handleOrgs, handleOrgsBeforeSubscribe ],
			[ "users", users, handleUsers ],
			[ "user", user, handleUser ]
		], options);
	}
	
}
