import { Node } from './node';
import { DateTime } from 'ionic-angular';

export class UserRole  extends Node {
    // ReferenceUUID refers to the logged in user taking the action.
    ReferenceUUID: string;

    ReferenceType: string;

    // TargetUUID Refers to the target of the action.. blocking for example.
    //  ReferenceUUID  Action     TargetUUID
    //  1234          Block       5678
    //  user 1234 is blocking    user/profile 5678
    TargetUUID: string;
    TargetType: string;

    RoleUUID: string;

    /// <summary>
    /// class for the action
    /// </summary>
    Type: string;

    Action: string;

    /// <summary>
    /// web, forms, mobile
    /// </summary>
    AppType: string;

    StartDate: DateTime;
    EndDate: DateTime;

    // Set this to ignore EndDate
    Persists: boolean;
}
