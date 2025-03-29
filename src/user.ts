import type { Abilities, AbilitiesSchema } from "insite-common";
import type { Org } from "./orgs";
import type { User, UserExtended } from "./users";
import type { UsersSubscriptionGroup } from "./UsersSubscriptionGroup";


export type CurrentUser<AS extends AbilitiesSchema = AbilitiesSchema> = UserExtended & {
	abilities: Abilities<AS>;
	sessionId?: string;
	slaveIds: string[];
	slavesSnapshot: string;
	slaves: (Org | User)[];
	slaveUsers: User[];
	slaveOrgs: Org[];
};


/** @this UsersSubscriptionGroup */
export function handleUser(this: UsersSubscriptionGroup, user: CurrentUser) {
	if (user) {
		
		const slavesSnapshot = user.slaveIds.join(",");
		
		if (user.slavesSnapshot !== slavesSnapshot) {
			user.slavesSnapshot = slavesSnapshot;
			
			const slaves = [];
			const slaveUsers = [];
			const slaveOrgs = [];
			
			const { users, orgs } = this.values;
			
			for (const _id of user.slaveIds) {
				let slave = users.get(_id);
				if (slave) {
					slaves.push(slave);
					slaveUsers.push(slave);
				} else {
					slave = orgs.get(_id);
					if (slave) {
						slaves.push(slave);
						slaveOrgs.push(slave);
					}
				}
			}
			
			user.slaves = slaves;
			user.slaveUsers = slaveUsers;
			user.slaveOrgs = slaveOrgs;
		}
	}
	
}
