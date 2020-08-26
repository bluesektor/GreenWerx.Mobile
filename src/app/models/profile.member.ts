import { Node } from './node';


export class ProfileMember extends Node     {

    DOB: Date;
    Gender: string;
    UserUUID: string;
    ProfileUUID: string;
    Height: number;  // convert to inches for database.
    HeightLabel: string; // this is for ui only. stupid select wont default by value
    HeightUOM: string;
    Weight: number;
    WeightUOM: string;
    Description: string;
    LookingFor: string;
    Preference: string;
    Orientation: string;
    RelationshipStatus: string;
    ProfileMember() {
        this.UUIDType = 'ProfileMember';
    }
}
