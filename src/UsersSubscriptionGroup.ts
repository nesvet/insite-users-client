import {
	SubscriptionGroup,
	type SubscriptionGroupOptions,
	type SubscriptionMapWithSubscription,
	type SubscriptionObjectWithSubscription
} from "insite-subscriptions-client";
import { handleExtendedOrgs, handleOrgs, handleOrgsBeforeSubscribe } from "./orgs";
import { handleRoles } from "./roles";
import { handleUser } from "./user";
import { handleExtendedUsers, handleUsers } from "./users";


const basisDefinitions = [
	[ "orgs", "map", handleOrgs, handleOrgsBeforeSubscribe ],
	[ "users", "map", handleUsers ],
	[ "user", [ true ], handleUser ]
];

const extendedDefinitions = [
	[ "roles", "map", handleRoles ],
	[ "extendedUsers", "map", "users.extended", handleExtendedUsers, true ],
	[ "extendedOrgs", "map", "orgs.extended", handleExtendedOrgs, true ]
];

export class UsersSubscriptionGroup extends SubscriptionGroup<typeof basisDefinitions | typeof extendedDefinitions> {
	constructor(options: SubscriptionGroupOptions) {
		super(basisDefinitions, options);
		
	}
	
	isExtended: boolean | null = false;
	
	extend() {
		
		if (this.isExtended === false) {
			this.isExtended = null;
			
			return this.attach(extendedDefinitions).then(() => {
				
				this.isExtended = true;
				
			});
		}
		
		return null;
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
