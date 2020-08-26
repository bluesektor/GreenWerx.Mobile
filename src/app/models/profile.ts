import { Node } from './node';
import {Attribute} from './attribute';
import { EventLocation } from './location';
import { ProfileMember } from './profile.member';
import {User } from './user';
import { VerificationEntry} from './verificationentry';

export class Profile extends Node {

    constructor() {
        super();
        this.LocationDetail = new EventLocation();
        this.User = new User();
        this.Blocked = false;
    }
    LocationUUID: string;

    LocationType: string;

    Theme: string;

    View: string;

    UserUUID: string;

    Description: string;

    LookingFor: string;

    RelationshipStatus: string;

    Attributes: Attribute[] = [];

    Members: ProfileMember[] = [];

    Verifications: VerificationEntry[] = [];

    LocationDetail: EventLocation;

    User: User;

    Blocked: boolean;

    BlockDescription: string;

    ShowPublic: boolean;

    Latitude: string;

    Longitude: string;
}
