import { SubscriptionGroup } from "insite-subscriptions-client";
import { handleExtendedOrgs, handleOrgs, handleOrgsBeforeSubscribe } from "./orgs";
import { handleRoles } from "./roles";
import { handleUser } from "./user";
import { handleExtendedUsers, handleUsers } from "./users";


export class UsersSubscriptionGroup extends SubscriptionGroup {
	constructor(options) {
		super([
			[ "orgs", "map", handleOrgs, handleOrgsBeforeSubscribe ],
			[ "users", "map", handleUsers ],
			[ "user", [ true ], handleUser ]
		], options);
		
	}
	
	isExtended = false;
	
	extend() {
		
		if (this.isExtended === false) {
			this.isExtended = null;
			
			return this.attach([
				[ "roles", "map", handleRoles ],
				[ "extendedUsers", "map", "users.extended", handleExtendedUsers, true ],
				[ "extendedOrgs", "map", "orgs.extended", handleExtendedOrgs, true ]
			]).then(() => {
				
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
	
	
	static handleValues({ orgs, users, user }, options) {
		return new SubscriptionGroup([
			[ "orgs", orgs, handleOrgs, handleOrgsBeforeSubscribe ],
			[ "users", users, handleUsers ],
			[ "user", user, handleUser ]
		], options);
	}
	
}
